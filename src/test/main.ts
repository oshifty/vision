import { promises as fs } from "fs";

import { UDRVersion } from "../libraries/enums";
import * as UDR from "../libraries/udr.next";
import * as origUDR from "../libraries/udr";

import { join } from "path";
import * as TJS from "typescript-json-schema";

import Ajv2019, { JSONSchemaType } from "ajv/dist/2019";
import { Try } from "../libraries/helpers";
const ajv = new Ajv2019();
const draft7MetaSchema = require("ajv/dist/refs/json-schema-draft-07.json");
ajv.addMetaSchema(draft7MetaSchema);

function createSchemaGenerator(library: string) {
	const settings: TJS.PartialArgs = {
		required: true,
	};

	const files = [join("src/libraries", library + ".d.ts")];

	const program = TJS.getProgramFromFiles(files);

	let generator = TJS.buildGenerator(program, settings, files);

	if (generator) {
		return generator;
	} else {
		throw new Error("Generator could not be created");
	}
}

const udrSchemaGenerator = createSchemaGenerator(UDRVersion.UDR);
const udrNextSchemaGenerator = createSchemaGenerator(UDRVersion.UDRnext);
console.log("Validator initialized");

async function main() {
	let deviceSchemaUDR = udrSchemaGenerator.getSchemaForSymbol("Device");
	let deviceSchemaUDRnext =
		udrNextSchemaGenerator.getSchemaForSymbol("Device");

	const UDRSchema: JSONSchemaType<origUDR.Device> =
		deviceSchemaUDR as JSONSchemaType<origUDR.Device>;

	const UDRnextSchema: JSONSchemaType<UDR.Device> =
		deviceSchemaUDRnext as JSONSchemaType<UDR.Device>;

	const validateUDR = ajv.compile(UDRSchema);
	const validateUDRnext = ajv.compile(UDRnextSchema);

	const data = await fs
		.readFile("./src/test/src/myFixture.json", "utf8")
		.then((res) =>
			Try<any>(
				() => JSON.parse(res),
				(err) => {
					console.log(`\nData: ${res}`);
					throw new Error(`JSON not valid | ${err}`);
				},
			),
		);

	console.log(`\nData: ${JSON.stringify(data, null, "\t")}`);

	console.log(`\nValidating against UDR Schema...`);
	if (validateUDR(data)) {
		console.log(`Successfully read "${data.userIdentifier}".`);
	} else {
		for (const error of validateUDR.errors || []) {
			console.log(`Error parsing "myFixture.json": ${error.message}\n`);
		}
	}

	console.log(`\nValidating against UDRnext Schema...`);
	if (validateUDRnext(data)) {
		console.log(
			`Successfully read "${data.userIdentifier}" with "${data.test}".`,
		);
	} else {
		for (const error of validateUDRnext.errors || []) {
			console.log(`Error parsing "myFixture.json": ${error.message}\n`);
		}
	}
}

main();
