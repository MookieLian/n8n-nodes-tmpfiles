"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryReadGitUser = tryReadGitUser;
exports.initGit = initGit;
const child_process_1 = require("child_process");
const child_process_2 = require("./child-process");
function tryReadGitUser() {
    const user = { name: '', email: '' };
    try {
        const name = (0, child_process_1.execSync)('git config --get user.name', {
            stdio: ['pipe', 'pipe', 'ignore'],
        })
            .toString()
            .trim();
        if (name)
            user.name = name;
    }
    catch {
    }
    try {
        const email = (0, child_process_1.execSync)('git config --get user.email', {
            stdio: ['pipe', 'pipe', 'ignore'],
        })
            .toString()
            .trim();
        if (email)
            user.email = email;
    }
    catch {
    }
    return user;
}
async function initGit(dir) {
    await (0, child_process_2.runCommand)('git', ['init', '-b', 'main'], { cwd: dir });
}
//# sourceMappingURL=git.js.map