import type { SugarcubeVariable } from "../../../declarations/types";

export function macroNumberInput(
	storyVariable: SugarcubeVariable,
	defaultValue: number | string | SugarcubeVariable,
	minValue?: number,
	maxValue?: number,
	step?: number
) {
	return `<<numberinput "${storyVariable}" ${defaultValue} ${minValue ?? ""} ${
		maxValue ?? ""
	} ${step ?? ""}>>` as const;
}
