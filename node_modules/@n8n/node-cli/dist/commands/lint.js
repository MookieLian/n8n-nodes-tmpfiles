"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const child_process_1 = require("../utils/child-process");
class Lint extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Lint);
        const args = ['.'];
        if (flags.fix) {
            args.push('--fix');
        }
        try {
            await (0, child_process_1.runCommand)('eslint', args, { context: 'local', stdio: 'inherit' });
        }
        catch (error) {
            if (error instanceof child_process_1.ChildProcessError) {
                if (error.signal) {
                    process.kill(process.pid, error.signal);
                }
                else {
                    process.exit(error.code ?? 0);
                }
            }
            throw error;
        }
    }
}
Lint.description = 'Lint the node in the current directory. Includes auto-fixing.';
Lint.examples = ['<%= config.bin %> <%= command.id %>'];
Lint.flags = {
    fix: core_1.Flags.boolean({ description: 'Automatically fix problems', default: false }),
};
exports.default = Lint;
//# sourceMappingURL=lint.js.map