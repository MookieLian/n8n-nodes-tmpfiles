"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIntro = void 0;
const package_manager_1 = require("../../utils/package-manager");
const createIntro = () => {
    const maybePackageManager = (0, package_manager_1.detectPackageManagerFromUserAgent)();
    const packageManager = maybePackageManager ?? 'npm';
    return maybePackageManager ? ` ${packageManager} create @n8n/node ` : ' n8n-node new ';
};
exports.createIntro = createIntro;
//# sourceMappingURL=utils.js.map