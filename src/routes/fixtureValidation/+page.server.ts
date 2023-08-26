import type { PageServerLoad } from './$types';
import type * as UDR from '$lib/udr';
import type * as UDRnext from '$lib/udr.next';
import { validateAgainstUDRSymbol } from '$lib/validator';
import { getFileAsJSON } from '$lib/helpers';
import { UDRVersion } from '$lib/enums';

export const load = (async () => {
	const filepath = './src/test/myFixture.json';
	const unknownJSONDoc = await getFileAsJSON(filepath);

	const validatedUDRDoc = validateAgainstUDRSymbol<UDR.Device>(unknownJSONDoc, 'Device');
	const validatedUDRNextDoc = validateAgainstUDRSymbol<UDRnext.Device>(
		unknownJSONDoc,
		'Device',
		UDRVersion.UDRnext
	);

	await Promise.all([validatedUDRDoc, validatedUDRNextDoc]);

	return {
		filepath: filepath,
		unknownJSONDoc: unknownJSONDoc,
		validatedUDRDoc: validatedUDRDoc,
		validatedUDRNextDoc: validatedUDRNextDoc
	};
}) satisfies PageServerLoad;
