"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileSafely = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const writeFileSafely = async (writeLocation, content) => {
    fs_1.default.mkdirSync(path_1.default.dirname(writeLocation), {
        recursive: true,
    });
    fs_1.default.writeFileSync(writeLocation, content);
};
exports.writeFileSafely = writeFileSafely;
//# sourceMappingURL=writeFileSafely.js.map