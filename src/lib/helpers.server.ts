import { readFile } from 'fs/promises';
import { Try } from './helpers';

export async function getFileAsJSON(path: string) {
	return await readFile(path, 'utf8').then((res) =>
		Try<unknown>(
			() => JSON.parse(res),
			(err) => {
				console.log(`\nData: ${res}`);
				throw new Error(`JSON not valid | ${err}`);
			}
		)
	);
}
