import { join } from 'path';
import * as tjs from 'typescript-json-schema';

import ajv2019, { type JSONSchemaType } from 'ajv/dist/2019';
const ajv = new ajv2019();
const Draft7MetaSchema = await import('ajv/dist/refs/json-schema-draft-07.json');
ajv.addMetaSchema(Draft7MetaSchema);

import { UDRVersion } from '$lib/enums';

export async function getUDRSchemaForSymbol<T>(
	symbol: string,
	version: UDRVersion = UDRVersion.UDR
) {
	const settings: tjs.PartialArgs = {
		required: true
	};

	const files = [join('src/lib', version + '.d.ts')];
	const program = tjs.getProgramFromFiles(files);
	const generator = tjs.buildGenerator(program, settings, files);
	if (!generator) throw new Error('Generator could not be created');

	return generator.getSchemaForSymbol(symbol) as JSONSchemaType<T>;
}

export async function validateDocumentAgainstSchema<T>(
	schema: JSONSchemaType<T>,
	document: unknown
) {
	const validate = ajv.compile(schema);

	const valid = validate(document);

	if (valid) {
		return { valid: true as const, contents: document as T };
	} else {
		return { valid: false as const, errors: validate.errors };
	}
}

export async function validateAgainstUDRSymbol<T>(
	document: unknown,
	symbol: string,
	version: UDRVersion = UDRVersion.UDR
) {
	const schema = await getUDRSchemaForSymbol<T>(symbol, version);
	return validateDocumentAgainstSchema(schema, document);
}
