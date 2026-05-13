"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractClientPath = extractClientPath;
const path_1 = require("path");
function extractClientPath(options) {
    var _a, _b, _c;
    const targetPath = (_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value;
    const clientPath = (_c = (_b = options.otherGenerators.find((g) => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.provider) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.includes('prisma-client'); })) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.value;
    if ((clientPath === null || clientPath === void 0 ? void 0 : clientPath.includes('node_modules/@prisma/client')) ||
        (clientPath === null || clientPath === void 0 ? void 0 : clientPath.includes('node_modules\\@prisma\\client'))) {
        return '@prisma/client';
    }
    if (!clientPath) {
        return undefined;
    }
    const targetDir = (0, path_1.dirname)(targetPath);
    const relativePath = (0, path_1.relative)(targetDir, `${clientPath}/client`);
    const normalizedPath = relativePath.replace(/\\/g, '/');
    return normalizedPath.startsWith('..')
        ? normalizedPath
        : `./${normalizedPath}`;
}
//# sourceMappingURL=generatorUtils.js.map