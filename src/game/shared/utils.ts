import { GAME_ENGINE } from "../engine/engine";

/** Returns a random floating number within the specified range */
function getRandomFloatInRange(lowerBound: number, upperBound: number): number {
	if (upperBound < lowerBound)
		throw new Error("Upper bound is less than lower bound");

	return lowerBound + GAME_ENGINE.random * (upperBound - lowerBound);
}

/** Returns a random integer within the specified range */
function getRandomIntegerInRange(
	lowerBound: number,
	upperBound: number,
): number {
	return Math.round(getRandomFloatInRange(lowerBound, upperBound));
}

export { getRandomFloatInRange, getRandomIntegerInRange };
