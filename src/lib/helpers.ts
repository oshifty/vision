export function Try<T>(fn: () => T, err: (e: Error) => T): T {
	try {
		return fn();
	} catch (e) {
		return err(e as Error);
	}
}

export function add(a: number, b: number): number {
	return a + b;
}
