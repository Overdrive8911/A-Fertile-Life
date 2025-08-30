import type { FoodEffectType } from "./enums";
import type { FoodEffect } from "./types";

/**
 * Creates a packed food effect by combining effect type and percentage into a single number.
 * Upper 8 bits = effect type, lower 8 bits = percentage (0-100)
 *
 * @param percentage must be a value between 0 and 100 inclusively
 */
export function createFoodEffect(
	type: FoodEffectType,
	percentage: number,
): FoodEffect {
	if (percentage < 0 || percentage > 100) {
		throw new Error(`Percentage must be between 0-100, got ${percentage}`);
	}

	//@ts-expect-error Brand type
	return (type << 8) | percentage;
}

/**
 * Parses a packed food effect back into type and percentage
 */
export function parseFoodEffect(packedEffect: FoodEffect): {
	type: FoodEffectType;
	percentage: number;
} {
	return {
		type: (packedEffect >> 8) & 0xff,
		percentage: packedEffect & 0xff,
	};
}
