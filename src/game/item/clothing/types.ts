import { ClothingState } from "../enums";
import type { GenericItemDynamicData } from "../types";

interface ClothingDynamicData extends GenericItemDynamicData {
	clothingState: ClothingState;
}

type AllClothingDurabilityPoints =
	| ClothingState.DURABILITY_LVL_1
	| ClothingState.DURABILITY_LVL_2
	| ClothingState.DURABILITY_LVL_3
	| ClothingState.DURABILITY_LVL_4
	| ClothingState.DURABILITY_LVL_5
	| ClothingState.DURABILITY_LVL_6
	| ClothingState.DURABILITY_LVL_7
	| ClothingState.DURABILITY_LVL_8
	| ClothingState.DURABILITY_LVL_9
	| ClothingState.DURABILITY_LVL_10
	| ClothingState.DURABILITY_LVL_11
	| ClothingState.DURABILITY_LVL_12
	| ClothingState.DURABILITY_LVL_13
	| ClothingState.DURABILITY_LVL_14
	| ClothingState.DURABILITY_LVL_15
	| ClothingState.DURABILITY_LVL_16
	| ClothingState.DURABILITY_LVL_17
	| ClothingState.DURABILITY_LVL_18
	| ClothingState.DURABILITY_LVL_19
	| ClothingState.DURABILITY_LVL_20
	| ClothingState.DURABILITY_LVL_21
	| ClothingState.DURABILITY_LVL_22
	| ClothingState.DURABILITY_LVL_23
	| ClothingState.DURABILITY_LVL_24
	| ClothingState.DURABILITY_LVL_25
	| ClothingState.DURABILITY_LVL_26
	| ClothingState.DURABILITY_LVL_27
	| ClothingState.DURABILITY_LVL_28
	| ClothingState.DURABILITY_LVL_29
	| ClothingState.DURABILITY_LVL_30;

export {
	type ClothingDynamicData,
	ClothingState,
	type AllClothingDurabilityPoints,
};
