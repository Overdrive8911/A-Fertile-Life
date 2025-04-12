import type { PassageBase } from "twine-sugarcube";
import type { PassageDescriptorWithOptionalTags } from "../types";

const passagesToAdd: PassageBase[] = [];
setup.initPassages = () => {
	passagesToAdd.forEach((passage) => {
		Story.add(passage);
	});
};
/** Use this for any passages you want to add*/

export function addPassage(
	name: PassageDescriptorWithOptionalTags["name"],
	tags: PassageDescriptorWithOptionalTags["tags"],
	text: PassageDescriptorWithOptionalTags["text"]
) {
	passagesToAdd.push({
		name: name,
		tags: tags ?? [""],
		text: typeof text == "string" ? text : text.join(""),
	});
}

/**
 * Use this for every temp variable you want to create
 */
export function generateRandomTempVar() {
	// Get rid of invalid characters
	return `_temp${crypto.randomUUID().split("-").join("")}` as const;
}

export function macroEither(...args: (number | string)[]) {
	return `either(${args
		.map((arg) => (typeof arg == "number" ? arg : `"${arg}"`))
		.join(", ")})`;
}
