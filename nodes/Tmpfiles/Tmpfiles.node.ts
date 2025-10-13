import { type INodeType, type INodeTypeDescription, type IExecuteFunctions, type INodeExecutionData, type IDataObject } from 'n8n-workflow';
import FormData from 'form-data';

export class Tmpfiles implements INodeType {
	description: INodeTypeDescription = {
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const binaryDataFieldName = this.getNodeParameter('binaryDataFieldName', i) as string;

			const binaryData = this.helpers.assertBinaryData(i, binaryDataFieldName);
			const buffer = await this.helpers.getBinaryDataBuffer(i, binaryDataFieldName);
			const fileName = binaryData.fileName ?? 'file';
			const mimeType = binaryData.mimeType ?? 'application/octet-stream';

			const form = new FormData();
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

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(response as unknown as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}

		return [returnData];
	}
}
