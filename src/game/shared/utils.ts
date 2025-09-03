import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { isSingleFlagSet } from "~/utils/bitfields";
import { GAME_ENGINE } from "../engine/engine";
import { BodyArea } from "./enums";

/** Returns a random floating number within the specified range */
function getRandomFloatInRange(lowerBound: number, upperBound: number): number {
	if (upperBound < lowerBound)
		throw new Error("Upper bound is less than lower bound");

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

/** For a biased average */
function getWeightedAverage(...input: number[]) {
	// Get the total sum
	let sum = 0;
	input.forEach((number) => {
		sum += number;
	});

	// Use the sum to produce ratios and multiply each ratio by 100
	const weights = input.map((number) => {
		return (number / sum) * 100;
	});

	// Multiply each initial number and their weight, then obtain their sum
	let sumOfWeightedValues = 0;
	input.forEach((number, index) => {
		sumOfWeightedValues += number * (weights[index] ?? 0);
	});

	// Divided the sum of weighted values by 100 and return the answer
	return sumOfWeightedValues / 100;
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
	getWeightedAverage,
	presentNumberAsMoney,
	isBodyAreaInner,
	isBodyAreaOuter,
	isBodyAreaTattoo,
};
