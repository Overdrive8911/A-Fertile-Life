import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { isSingleFlagSet } from "~/utils/bitfields";
import { GAME_ENGINE } from "../engine/engine";
import { BodyArea } from "./enums";

/** Returns a random floating number within the specified range */
function getRandomFloatInRange(lowerBound: number, upperBound: number): number {
	if (upperBound < lowerBound) {
		const temp = upperBound;
		upperBound = lowerBound;
		lowerBound = temp;
	}

	let randomSource: number;

	try {
		randomSource = GAME_ENGINE.random;
	} catch {
		// Since the default variables include a class that relies on the random function (which cannot use the game engine since it wouldn't be initalized by then, fall back to Math.random)
		randomSource = Math.random();
	}

	return lowerBound + randomSource * (upperBound - lowerBound);
}

/** Returns a random integer within the specified range */
function getRandomIntegerInRange(
	lowerBound: number,
	upperBound: number,
): number {
	return Math.round(getRandomFloatInRange(lowerBound, upperBound));
}

/** Clones any stateful class  */
function cloneClass<TClass extends SugarBoxCompatibleClassInstance<unknown>>(
	classInstance: TClass,
): TClass {
	//@ts-expect-error The library doesn't expose the class constructor interface directly so this is a temporary type sworkaround
	return classInstance.constructor.fromJSON(classInstance.toJSON());
}

/** For a biased average. i.e. Biased towards larger numbers in the input */
function getDominantAverage(...input: number[]) {
	// Get the total sum
	const sum = input.reduce((acc, number) => acc + number, 0);

	// Calculate weighted sum in a single pass
	const sumOfWeightedValues = input.reduce((acc, number) => {
		const weight = (number / sum) * 100;
		return acc + number * weight;
	}, 0);

	const res = sumOfWeightedValues / 100;

	// Return the weighted average
	return Number.isNaN(res) ? 0 : res;
}

/** Utility method so I won't repeat myself when having to render money :3 */
function presentNumberAsMoney(number: number) {
	return `¤${number}` as const;
}

function isBodyAreaInner(bodyArea: BodyArea) {
	return isSingleFlagSet(BodyArea.INNER, bodyArea);
}

function isBodyAreaTattoo(bodyArea: BodyArea) {
	return isSingleFlagSet(BodyArea.TATTOO, bodyArea);
}

function isBodyAreaOuter(bodyArea: BodyArea) {
	return !isBodyAreaInner(bodyArea) && !isBodyAreaTattoo(bodyArea);
}

export {
	getRandomFloatInRange,
	getRandomIntegerInRange,
	cloneClass,
	getDominantAverage,
	presentNumberAsMoney,
	isBodyAreaInner,
	isBodyAreaOuter,
	isBodyAreaTattoo,
};
