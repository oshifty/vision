import type { PageServerLoad } from './$types';

import { promises as fs } from 'fs';

import { UDRVersion } from '$lib/enums';
import type * as UDR from '$lib/udr.next';
import type * as origUDR from '$lib/udr';

import { join } from 'path';
import * as TJS from 'typescript-json-schema';

import Ajv2019, { type JSONSchemaType } from 'ajv/dist/2019';
import { Try } from '$lib/helpers';

export const prerender = false;

export const load = (async () => {
	const ajv = new Ajv2019();
	const draft7MetaSchema = await import('ajv/dist/refs/json-schema-draft-07.json');
	ajv.addMetaSchema(draft7MetaSchema);

	function createSchemaGenerator(library: string) {
		const settings: TJS.PartialArgs = {
			required: true
		};

		const files = [join('src/lib', library + '.d.ts')];

		const program = TJS.getProgramFromFiles(files);

		const generator = TJS.buildGenerator(program, settings, files);

		if (generator) {
			return generator;
		} else {
			throw new Error('Generator could not be created');
		}
	}

	const udrSchemaGenerator = createSchemaGenerator(UDRVersion.UDR);
	const udrNextSchemaGenerator = createSchemaGenerator(UDRVersion.UDRnext);
	console.log('Validator initialized');

	function getSchemaValidationFn<T>(generator: TJS.JsonSchemaGenerator, symbol: string) {
		const schema = generator.getSchemaForSymbol(symbol);
		if (schema) {
			return ajv.compile(schema as JSONSchemaType<T>);
		} else {
			throw new Error(`Schema for symbol "${symbol}" could not be created`);
		}
	}

	async function getTestFile(filename: string) {
		return await fs.readFile(`./src/test/${filename}`, 'utf8').then((res) =>
			Try<unknown>(
				() => JSON.parse(res),
				(err) => {
					console.log(`\nData: ${res}`);
					throw new Error(`JSON not valid | ${err}`);
				}
			)
		);
	}

	const validateUDR = getSchemaValidationFn<origUDR.Device>(udrSchemaGenerator, 'Device');
	const validateUDRnext = getSchemaValidationFn<UDR.Device>(udrNextSchemaGenerator, 'Device');

	const filename = 'myFixture.json';
	const file = await getTestFile(filename);
	const validUDR = validateUDR(file);
	const validUDRnext = validateUDRnext(file);

	return {
		filename: filename,
		validUDR: validUDR,
		validUDRnext: validUDRnext,
		file: file,
		validateUDRErrors: validateUDR.errors,
		validateUDRnextErrors: validateUDRnext.errors
	};
}) satisfies PageServerLoad;
