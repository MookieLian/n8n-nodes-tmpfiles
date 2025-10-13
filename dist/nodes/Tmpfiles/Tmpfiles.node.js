"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tmpfiles = void 0;
const form_data_1 = __importDefault(require("form-data"));
class Tmpfiles {
    constructor() {
        this.description = {
            displayName: 'Tmpfiles',
            name: 'tmpfiles',
            icon: 'file:tmpfilesLogo_main.svg',
            group: ['transform'],
            version: 1,
            subtitle: 'File Upload',
            description: 'Upload files to Tmpfiles and get a temporary URL',
            defaults: {
                name: 'Tmpfiles',
            },
            usableAsTool: true,
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            requestDefaults: {
                baseURL: 'https://tmpfiles.org/api/v1/upload',
                method: 'POST',
            },
            properties: [
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'hidden',
                    default: 'file',
                    description: 'ID of the field to set. Choose from the list, or specify an ID using an expression.',
                },
                {
                    displayName: 'Input Data Field Name',
                    name: 'binaryDataFieldName',
                    type: 'string',
                    noDataExpression: true,
                    default: 'data',
                    required: true,
                    description: 'The name of the incoming field containing the binary file data to be processed',
                },
            ],
        };
    }
    async execute() {
        var _a, _b;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const binaryDataFieldName = this.getNodeParameter('binaryDataFieldName', i);
            const binaryData = this.helpers.assertBinaryData(i, binaryDataFieldName);
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryDataFieldName);
            const fileName = (_a = binaryData.fileName) !== null && _a !== void 0 ? _a : 'file';
            const mimeType = (_b = binaryData.mimeType) !== null && _b !== void 0 ? _b : 'application/octet-stream';
            const form = new form_data_1.default();
            form.append('file', buffer, {
                filename: fileName,
                contentType: mimeType,
            });
            const response = await this.helpers.httpRequest({
                method: 'POST',
                url: 'https://tmpfiles.org/api/v1/upload',
                body: form.getBuffer(),
                headers: {
                    ...form.getHeaders(),
                    'Content-Length': form.getLengthSync(),
                },
            });
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.Tmpfiles = Tmpfiles;
//# sourceMappingURL=Tmpfiles.node.js.map