import { isFloat } from "./math";

export function toTwoDemicalPlaces(num: number): string {
	return isFloat(num) ? num.toFixed(2) : `${num}`;
}
