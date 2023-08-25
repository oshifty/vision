import { describe, expect, it } from 'vitest';
import { add } from './helpers';

describe('sum module', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(add(1, 2)).toBe(3);
	});
});
