// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import nodeEndpoint from 'comlink/dist/esm/node-adapter.mjs';
import { parentPort } from 'worker_threads';
import * as Comlink from 'comlink';
import { join } from 'path';
import * as tjs from 'typescript-json-schema';
import ajv2019, { type JSONSchemaType } from 'ajv/dist/2019';
import { UDRVersion } from '$lib/enums';

const ajv = new ajv2019();
const Draft7MetaSchema = await import('ajv/dist/refs/json-schema-draft-07.json');
ajv.addMetaSchema(Draft7MetaSchema);

export const api = {
	getUDRSchemaForSymbol: <T>(symbol: string, version: UDRVersion = UDRVersion.UDR) => {
		const settings: tjs.PartialArgs = {
			required: true
		};

		const files = [join('src/lib', version + '.d.ts')];
		const program = tjs.getProgramFromFiles(files);
		const generator = tjs.buildGenerator(program, settings, files);
		if (!generator) throw new Error('Generator could not be created');

		return generator.getSchemaForSymbol(symbol) as JSONSchemaType<T>;
	},
	validateDocumentAgainstSchema: <T>(schema: JSONSchemaType<T>, document: unknown) => {
		const validate = ajv.compile(schema);

		const valid = validate(document);

		if (valid) {
			return { valid: true as const, contents: document as T };
		} else {
			return { valid: false as const, errors: validate.errors };
		}
	},
	validateAgainstUDRSymbol: <T>(
		document: unknown,
		symbol: string,
		version: UDRVersion = UDRVersion.UDR
	) => {
		const schema = api.getUDRSchemaForSymbol<T>(symbol, version);
		return api.validateDocumentAgainstSchema(schema, document);
	}
};
if (!parentPort) throw new Error('parentPort is undefined');

Comlink.expose(api, nodeEndpoint(parentPort));
