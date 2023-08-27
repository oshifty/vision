export function Try<T>(fn: () => T, err: (e: Error) => T): T {
	try {
		return fn();
	} catch (e) {
		return err(e as Error);
	}
}

export function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function add(a: number, b: number): number {
	return a + b;
}
