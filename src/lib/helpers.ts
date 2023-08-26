import { readFile } from 'fs/promises';

export function Try<T>(fn: () => T, err: (e: Error) => T): T {
	try {
		return fn();
	} catch (e) {
		return err(e as Error);
	}
}

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

export function add(a: number, b: number): number {
	return a + b;
}
