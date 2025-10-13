"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCancel = void 0;
exports.withCancelHandler = withCancelHandler;
exports.ensureN8nPackage = ensureN8nPackage;
const prompts_1 = require("@clack/prompts");
const package_1 = require("./package");
async function withCancelHandler(prompt) {
    const result = await prompt;
    if ((0, prompts_1.isCancel)(result))
        return (0, exports.onCancel)();
    return result;
}
const onCancel = (message = 'Cancelled', code = 0) => {
    (0, prompts_1.cancel)(message);
    process.exit(code);
};
exports.onCancel = onCancel;
async function ensureN8nPackage(commandName) {
    const isN8nNode = await (0, package_1.isN8nNodePackage)();
    if (!isN8nNode) {
        prompts_1.log.error(`Make sure you are in the root directory of your node package and your package.json contains the "n8n" field

For example:
{
	"name": "n8n-nodes-my-app",
	"version": "0.1.0",
	"n8n": {
		"nodes": ["dist/nodes/MyApp.node.js"]
	}
}
`);
        (0, exports.onCancel)(`${commandName} can only be run in an n8n node package`, 1);
        process.exit(1);
    }
}
//# sourceMappingURL=prompts.js.map