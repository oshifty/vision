import type { PageServerLoad } from './$types';
import type * as UDR from '$lib/udr';
import type * as UDRnext from '$lib/udr.next';
import { validateAgainstUDRSymbol } from '$lib/validator';
import { getFileAsJSON } from '$lib/helpers';
import { UDRVersion } from '$lib/enums';

export const load = (async () => {
	const filepath = './src/test/myFixture.json';
	const unknownJSONDoc = getFileAsJSON(filepath);

	const validatedUDRDoc = validateAgainstUDRSymbol<UDR.Device>(await unknownJSONDoc, 'Device');
	const validatedUDRNextDoc = validateAgainstUDRSymbol<UDRnext.Device>(
		await unknownJSONDoc,
		'Device',
		UDRVersion.UDRnext
	);

	return {
		filepath: filepath,
		streamed: {
			unknownJSONDoc: unknownJSONDoc,
			validatedUDRDoc: validatedUDRDoc,
			validatedUDRNextDoc: validatedUDRNextDoc
		}
	};
}) satisfies PageServerLoad;
