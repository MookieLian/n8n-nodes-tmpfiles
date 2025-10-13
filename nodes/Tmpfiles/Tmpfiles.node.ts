import { type INodeType, type INodeTypeDescription, type IExecuteFunctions, type INodeExecutionData, type IDataObject, IHttpRequestOptions } from 'n8n-workflow';
type BinaryBuffer = { length: number };
declare const Buffer: {
    from(input: string, encoding: string): BinaryBuffer;
    concat(chunks: Array<unknown>): BinaryBuffer;
};

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


			// Build multipart/form-data body manually (Drive-like approach without external imports)
			const boundary = `----n8nFormBoundary${Date.now()}`;
			const preamble =
				`--${boundary}\r\n` +
				`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
				`Content-Type: ${mimeType}\r\n\r\n`;
			const closing = `\r\n--${boundary}--\r\n`;
			const bodyBuffer = Buffer.concat([
				Buffer.from(preamble, 'utf8'),
				buffer as unknown as BinaryBuffer,
				Buffer.from(closing, 'utf8'),
			]);

			const requestOptions: IHttpRequestOptions = {
				method: 'POST',
				url: 'https://tmpfiles.org/api/v1/upload',
				headers: {
					'Content-Type': `multipart/form-data; boundary=${boundary}`,
					'Content-Length': bodyBuffer.length,
				},
				body: bodyBuffer,
			};

			const response = await this.helpers.httpRequest(requestOptions);

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(response as unknown as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}

		return [returnData];
	}
}
