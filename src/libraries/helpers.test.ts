import { add } from "./helpers";

describe("sum module", () => {
	test("adds 1 + 2 to equal 3", () => {
		expect(add(1, 2)).toBe(3);
	});
});
