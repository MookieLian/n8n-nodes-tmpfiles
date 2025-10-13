"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@clack/prompts");
const core_1 = require("@oclif/core");
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const picocolors_1 = __importDefault(require("picocolors"));
const rimraf_1 = require("rimraf");
const filesystem_1 = require("../../utils/filesystem");
const package_manager_1 = require("../../utils/package-manager");
const prompts_2 = require("../../utils/prompts");
const validation_1 = require("../../utils/validation");
const build_1 = require("../build");
const utils_1 = require("./utils");
const child_process_1 = require("../../utils/child-process");
class Dev extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Dev);
        const packageManager = (await (0, package_manager_1.detectPackageManager)()) ?? 'npm';
        const { runPersistentCommand } = (0, utils_1.commands)();
        (0, prompts_1.intro)(picocolors_1.default.inverse(' n8n-node dev '));
        await (0, prompts_2.ensureN8nPackage)('n8n-node dev');
        await (0, build_1.copyStaticFiles)();
        const linkingSpinner = (0, prompts_1.spinner)();
        linkingSpinner.start('Linking custom node to n8n');
        await (0, child_process_1.runCommand)(packageManager, ['link']);
        const n8nUserFolder = flags['custom-user-folder'];
        const customNodesFolder = node_path_1.default.join(n8nUserFolder, '.n8n', 'custom');
        await (0, filesystem_1.ensureFolder)(customNodesFolder);
        const packageName = await (0, utils_1.readPackageName)();
        const invalidNodeNameError = (0, validation_1.validateNodeName)(packageName);
        if (invalidNodeNameError)
            return (0, prompts_2.onCancel)(invalidNodeNameError);
        await (0, rimraf_1.rimraf)(node_path_1.default.join(customNodesFolder, 'package.json'));
        await (0, child_process_1.runCommand)(packageManager, ['link', packageName], {
            cwd: customNodesFolder,
        });
        linkingSpinner.stop('Linked custom node to n8n');
        if (!flags['external-n8n']) {
            let setupComplete = false;
            const npxN8nSpinner = (0, prompts_1.spinner)();
            npxN8nSpinner.start('Starting n8n dev server');
            prompts_1.log.warn(picocolors_1.default.dim('First run may take a few minutes while dependencies are installed'));
            try {
                await Promise.race([
                    new Promise((resolve) => {
                        runPersistentCommand('npx', ['-y', '--quiet', '--prefer-online', 'n8n@latest'], {
                            cwd: n8nUserFolder,
                            env: {
                                ...process.env,
                                N8N_DEV_RELOAD: 'true',
                                N8N_RUNNERS_ENABLED: 'true',
                                DB_SQLITE_POOL_SIZE: '10',
                                N8N_USER_FOLDER: n8nUserFolder,
                            },
                            name: 'n8n',
                            color: picocolors_1.default.green,
                            allowOutput: (line) => {
                                if (line.includes('Initializing n8n process')) {
                                    resolve();
                                }
                                return setupComplete;
                            },
                        });
                    }),
                    new Promise((_, reject) => {
                        setTimeout(() => {
                            const error = new Error('n8n startup timeout after 120 seconds');
                            reject(error);
                        }, 120_000);
                    }),
                ]);
                setupComplete = true;
                npxN8nSpinner.stop('Started n8n dev server');
            }
            catch (error) {
                npxN8nSpinner.stop('Failed to start n8n dev server');
                (0, prompts_2.onCancel)(error instanceof Error ? error.message : 'Unknown error occurred', 1);
                return;
            }
        }
        (0, prompts_1.outro)('✓ Setup complete');
        runPersistentCommand(packageManager, ['exec', '--', 'tsc', '--watch'], {
            name: 'build',
            color: picocolors_1.default.cyan,
        });
    }
}
Dev.description = 'Run n8n with the node and rebuild on changes for live preview';
Dev.examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --external-n8n',
    '<%= config.bin %> <%= command.id %> --custom-user-folder /Users/test',
];
Dev.flags = {
    'external-n8n': core_1.Flags.boolean({
        default: false,
        description: 'By default n8n-node dev will run n8n in a sub process. Enable this option if you would like to run n8n elsewhere. Make sure to set N8N_DEV_RELOAD to true in that case.',
    }),
    'custom-user-folder': core_1.Flags.directory({
        default: node_path_1.default.join(node_os_1.default.homedir(), '.n8n-node-cli'),
        description: 'Folder to use to store user-specific n8n data. By default it will use ~/.n8n-node-cli. The node CLI will install your node here.',
    }),
};
exports.default = Dev;
//# sourceMappingURL=index.js.map