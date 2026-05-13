"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const constants_1 = require("./constants");
const createMethods_1 = require("./helpers/createMethods");
const generatorUtils_1 = require("./utils/generatorUtils");
const writeFileSafely_1 = require("./utils/writeFileSafely");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const { version } = require('../package.json');
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        return {
            version,
            defaultOutput: './fake-data.ts',
            prettyName: constants_1.GENERATOR_NAME,
        };
    },
    async onGenerate(options) {
        var _a;
        (0, tiny_invariant_1.default)(typeof options.generator.config.extraExport === 'string' ||
            options.generator.config.extraExport === undefined, 'extraExport must be a string or empty');
        (0, tiny_invariant_1.default)(typeof options.generator.config.extraExport === 'string' ||
            options.generator.config.extraExport === undefined, 'extraExport must be a string or empty');
        (0, tiny_invariant_1.default)(typeof options.generator.config.emptyValueAs === 'string' ||
            options.generator.config.emptyValueAs === undefined, 'emptyValueAs must be a string or empty');
        const fakeMethods = await (0, createMethods_1.createMethods)(options.dmmf.datamodel, options.generator.config.extraImport, options.generator.config.extraExport, options.generator.config.emptyValueAs, (0, generatorUtils_1.extractClientPath)(options));
        await (0, writeFileSafely_1.writeFileSafely)((_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value, fakeMethods);
    },
});
//# sourceMappingURL=generator.js.map