"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMethods = createMethods;
const faker_1 = require("@faker-js/faker");
const internals_1 = require("@prisma/internals");
const MAX_INT = 2147483647;
function getFieldDefinition(models, model, field, enums, emptyValueAs) {
    var _a, _b, _c, _d, _e, _f;
    const docLines = ((_a = field.documentation) === null || _a === void 0 ? void 0 : _a.split('\n')) || [];
    const fakeLine = docLines.find((line) => line.startsWith('FAKE:'));
    const fakeValue = fakeLine === null || fakeLine === void 0 ? void 0 : fakeLine.replace('FAKE:', '');
    if (fakeLine && !fakeValue) {
        internals_1.logger.warn(`${model.name}.${field.name} appears to have a '///FAKE:' comment but is missing a method or JSON after it.`);
    }
    if (fakeValue) {
        return `${field.name}: ${fakeValue}`;
    }
    if (field.isId) {
        return `${field.name}: ${field.type === 'String'
            ? 'faker.string.uuid()'
            : `faker.number.int({ max: ${MAX_INT} })`}`;
    }
    if (field.hasDefaultValue) {
        if (field.isList && field.kind === 'enum') {
            const enumName = field.type;
            const enumValues = ((_b = enums.find((it) => it.name === enumName)) === null || _b === void 0 ? void 0 : _b.values) || [];
            if (enumValues.length === 0) {
                internals_1.logger.warn(`Enum ${enumName} has no enum values. Field ${field.name} won't be generated.`);
            }
            else {
                const defaults = (_c = field.default) === null || _c === void 0 ? void 0 : _c.map((d) => `${enumName}.${d}`).join(', ');
                return `${field.name}: [${defaults}]`;
            }
        }
        if (field.isList) {
            return `${field.name}: ${((_d = field.default) === null || _d === void 0 ? void 0 : _d.toString()) || '[]'}`;
        }
        if (['Json'].includes(field.type)) {
            return `${field.name}: ${fakeValue || ((_e = field.default) === null || _e === void 0 ? void 0 : _e.toString()) || '{}'}`;
        }
        if (field.kind === 'enum') {
            return `${field.name}: ${field.type}.${field.default}`;
        }
        if (['Int', 'Float', 'Boolean'].includes(field.type)) {
            return `${field.name}: ${field.default}`;
        }
        if (['Decimal'].includes(field.type)) {
            return `${field.name}: new Decimal(${field.default})`;
        }
        if (['BigInt'].includes(field.type)) {
            return `${field.name}: BigInt(${field.default})`;
        }
        if (['String'].includes(field.type)) {
            return `${field.name}: '${field.default}'`;
        }
        if (field.type === 'DateTime') {
            return `${field.name}: new Date()`;
        }
    }
    if (!field.isRequired) {
        return `${field.name}: ${emptyValueAs}`;
    }
    if (field.kind === 'enum') {
        const enumName = field.type;
        const enumValues = ((_f = enums.find((it) => it.name === enumName)) === null || _f === void 0 ? void 0 : _f.values) || [];
        if (enumValues.length === 0) {
            internals_1.logger.warn(`Enum ${enumName} has no enum values. Field ${field.name} won't be generated.`);
        }
        else {
            const enumValuesAsString = enumValues
                .map((v) => `${enumName}.${v.name}`)
                .join(', ');
            return `${field.name}: faker.helpers.arrayElement([${enumValuesAsString}] as const)`;
        }
    }
    if (model.fields.some((it) => { var _a; return (_a = it.relationFromFields) === null || _a === void 0 ? void 0 : _a.includes(field.name); })) {
        return `${field.name}: ${field.type === 'String' ? 'faker.string.uuid()' : 'faker.number.int()'}`;
    }
    if (field.type === 'String') {
        if (field.isList) {
            return `${field.name}: faker.lorem.words(5).split(' ')`;
        }
        if (field.name === 'email') {
            return `${field.name}: faker.internet.email()`;
        }
        if (field.name === 'image' || field.name === 'avatar') {
            return `${field.name}: faker.image.avatar()`;
        }
        if (field.name === 'username') {
            return `${field.name}: faker.internet.username()`;
        }
        if (field.name === 'name') {
            return `${field.name}: faker.person.fullName()`;
        }
        if (field.name === 'firstName') {
            return `${field.name}: faker.person.firstName()`;
        }
        if (field.name === 'lastName') {
            return `${field.name}: faker.person.lastName()`;
        }
        return `${field.name}: faker.lorem.words(5)`;
    }
    if (field.type === 'Int') {
        if (field.isList) {
            return `${field.name}: [faker.number.int({ max: ${MAX_INT} }),faker.number.int({ max: ${MAX_INT} }),faker.number.int({ max: ${MAX_INT} }),faker.number.int({ max: ${MAX_INT} }),faker.number.int({ max: ${MAX_INT} })]`;
        }
        if (field.name === 'age') {
            return `${field.name}: faker.number.int({min: 0, max: 99})`;
        }
        return `${field.name}: faker.number.int()`;
    }
    if (field.type === 'BigInt') {
        if (field.isList) {
            return `${field.name}: [BigInt(faker.number.int()),BigInt(faker.number.int()),BigInt(faker.number.int()),BigInt(faker.number.int()),BigInt(faker.number.int())]`;
        }
        return `${field.name}: BigInt(faker.number.int())`;
    }
    if (field.type === 'Float') {
        if (field.isList) {
            return `${field.name}: [faker.number.float(),faker.number.float(),faker.number.float(),faker.number.float(),faker.number.float()]`;
        }
        return `${field.name}: faker.number.float()`;
    }
    if (field.type === 'Boolean') {
        if (field.isList) {
            return `${field.name}: [faker.datatype.boolean(),faker.datatype.boolean(),faker.datatype.boolean(),faker.datatype.boolean(),faker.datatype.boolean()]`;
        }
        return `${field.name}: faker.datatype.boolean()`;
    }
    if (field.type === 'Decimal') {
        if (field.isList) {
            return `${field.name}: [new Decimal(faker.number.float()),new Decimal(faker.number.float()),new Decimal(faker.number.float()),new Decimal(faker.number.float()),new Decimal(faker.number.float())]`;
        }
        return `${field.name}: new Decimal(faker.number.float())`;
    }
    if (field.type === 'DateTime') {
        if (field.isList) {
            return `${field.name}: [faker.date.anytime(),faker.date.anytime(),faker.date.anytime(),faker.date.anytime(),faker.date.anytime()]`;
        }
        return `${field.name}: faker.date.anytime()`;
    }
    if (field.type === 'Json') {
        return `${field.name}: JSON.stringify(${generateRandomJson()})`;
    }
    internals_1.logger.warn(`Type ${field.type}${field.isList ? '[]' : ''} (${field.kind}) is not supported. Field ${field.name} won't be generated.`);
    return null;
}
async function createMethods({ enums, models }, extraImport, extraExport, emptyValueAs = 'undefined', clientImportPath = '@prisma/client') {
    const functions = [];
    models.forEach((m) => {
        createFakeFunctionsWithoutFKs(models, m, enums, functions, emptyValueAs);
        createFakeFunctionsWithFKs(models, m, enums, functions, emptyValueAs);
    });
    const enumNames = enums.map((it) => it.name).join(', ');
    return await `import { ${enumNames} } from '${clientImportPath}';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';
${extraImport || ''}
${extraExport || ''}

${functions.join('\n')}
`;
}
function createFakeFunctionsWithoutFKs(models, model, enums, functions, emptyValueAs) {
    const validFields = model.fields
        .filter((field) => !field.isId)
        .filter((field) => field.kind === 'scalar' || field.kind === 'enum')
        .filter((field) => {
        return !model.fields.find((it) => {
            var _a;
            return (_a = it.relationFromFields) === null || _a === void 0 ? void 0 : _a.includes(field.name);
        });
    })
        .filter((field) => !field.hasDefaultValue)
        .map((f) => getFieldDefinition(models, model, f, enums, emptyValueAs))
        .filter(Boolean);
    if (validFields.length > 0) {
        functions.push(`export function fake${model.name}() {
  return {
    ${validFields.join(',\n    ')},
  };
}`);
    }
}
function createFakeFunctionsWithFKs(models, model, enums, functions, emptyValueAs) {
    const validFields = model.fields
        .filter((field) => field.kind === 'scalar' || field.kind === 'enum')
        .map((f) => getFieldDefinition(models, model, f, enums, emptyValueAs))
        .filter(Boolean);
    if (validFields.length > 0) {
        functions.push(`export function fake${model.name}Complete() {
  return {
    ${validFields.join(',\n    ')},
  };
}`);
    }
}
function generateRandomJson() {
    const obj = {
        foo: faker_1.faker.string.uuid(),
        bar: faker_1.faker.number.int(),
        bike: faker_1.faker.number.hex(),
        a: faker_1.faker.string.alphanumeric(),
        b: faker_1.faker.number.float(),
        name: faker_1.faker.person.firstName(),
        prop: faker_1.faker.string.binary(),
    };
    return JSON.stringify(obj);
}
//# sourceMappingURL=createMethods.js.map