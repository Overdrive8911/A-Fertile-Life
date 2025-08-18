import type { GenericItemDynamicData } from "../types";

interface FoodDynamicData extends GenericItemDynamicData {
	timeSinceObtained: number; // In seconds
}

export type { FoodDynamicData };
