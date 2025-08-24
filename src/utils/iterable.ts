import { getRandomFloatInRange } from "~/game/shared/utils";

/** Returns a random value from the array */
function either<TValue>(...values: TValue[]): TValue {
	// biome-ignore lint/style/noNonNullAssertion: <will not be undefined in reasonable cases>
	return values[getRandomFloatInRange(0, values.length)]!;
}

/** Like `Array.prototype.includes` but instead of checking for a single value, we check for all the elements in a given array */
function includesAll<TValue>(
	mainIterable: Set<TValue>,
	arrayToBeCheckedIfAllItsElementsAreIncluded: TValue[],
): boolean {
	for (const ele of arrayToBeCheckedIfAllItsElementsAreIncluded) {
		if (!mainIterable.has(ele)) return false;
	}

	return true;
}

export { either, includesAll };
