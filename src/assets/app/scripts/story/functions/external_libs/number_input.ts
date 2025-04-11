import type { SugarcubeVariable } from "../../../declarations/types";

export function macroNumberInput(
	storyVariable: SugarcubeVariable,
	defaultValue: number | string | SugarcubeVariable,
	minValue?: number | SugarcubeVariable,
	maxValue?: number | SugarcubeVariable,
	step?: number | SugarcubeVariable
) {
	return `<<numberinput '${storyVariable}' ${defaultValue} ${minValue ?? ""} ${
		maxValue ?? ""
	} ${step ?? ""}>>` as const;
}

export function macroNumberSlider(
	storyVariable: SugarcubeVariable,
	defaultValue: number | string | SugarcubeVariable,
	minValue?: number | SugarcubeVariable,
	maxValue?: number | SugarcubeVariable,
	step?: number | SugarcubeVariable
) {
	return `<<numberslider '${storyVariable}' ${defaultValue} ${minValue ?? ""} ${
		maxValue ?? ""
	} ${step ?? ""}>>` as const;
}
