import { Matrix4, type Matrix4Tuple } from 'three';

/**
 * Parses a GDTF Position string into a three.js Matrix4.
 *
 * @param matrix A GDTF Position `string` like:
 * ```typescript
 * let positionString = "{11,12,13,14}{21,22,23,24}{31,32,33,34}{41,42,43,44}"
 * ```
 * @returns ```typescript
 * new Matrix4(11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44)
 * ```
 */
export function parseMatrix4(matrix: string): Matrix4 {
	const matrixTuple = [
		...matrix
			.split(/[^0-9.+-]+/g)
			.slice(1, -1)
			.map((n) => parseFloat(n))
	] as Matrix4Tuple;
	return new Matrix4(...matrixTuple);
}

/**
 * The coordinate system of GDTF is different from three.js.
 *
 * ```
 *    three.js (X, Y, Z)                  GDTF (X, Z, -Y)
 *       Y                                 Z
 *       |                                 |
 *       |                                 |
 *       |                                 |
 *       +---------> X                     +---------> X
 *      /                                   \
 *     /                                     \
 *    Z                                       Y
 * ```
 *
 * This is why we need to apply this Matrix4 to the GDTF Matrix4 upon import.
 * It is a so called `change-of-basis` matrix:
 *
 * ```
 * 1,   0,   0,   0,
 * 0,   0,   1,   0,
 * 0, - 1,   0,   0,
 * 0,   0,   0,   1
 * ```
 * <br />
 *
 * @see https://discourse.threejs.org/t/convert-from-one-coordinate-system-to-another/13240/10
 */
export const cobMatrix = new Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
