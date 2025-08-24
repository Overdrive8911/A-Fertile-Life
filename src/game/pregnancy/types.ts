export interface PregPerkDynamicData {
	currLevel: number;
}
export interface PregPerkStaticData {
	price: number;
	maxLevel: number;
}

export interface PregSideEffectDynamicData {
	/** Remaining duration (in seconds) that the side effect will last before leaving on its own.
	 */
	currDuration: number;
}
export interface PregSideEffectStaticData {
	/** How long (in days) that the side effect will last when it is applied to the womb.
	 *
	 * If multiple values are provided, one is selected randomly
	 */
	maxDuration: [number, ...number[]];
}

// !SECTION
export type PregPerk = PregPerkDynamicData | PregPerkStaticData;

export type PregPerksObject<T extends PregPerk> = Partial<
	Record<
		| "gestator"
		| "hyperFertility"
		| "superFet"
		| "elasticity"
		| "immunityBoost"
		| "motherlyHips"
		| "motherlyBoobs"
		| "ironSpine"
		| "sensitiveWomb"
		| "healthyWomb"
		| "fortifiedWomb"
		| "noPostpartum"
		| "polyhydramnios",
		T
	>
>;

export type PregSideEffect =
	| PregSideEffectDynamicData
	| PregSideEffectStaticData;

export type PregSideEffectsObject<T extends PregSideEffect> = Partial<
	Record<
		| "cravingCrisis"
		| "motherHunger"
		| "restlessBrood"
		| "heavyWomb"
		| "contractions"
		| "labour"
		| "sexCraving"
		| "growthSpurt",
		T
	>
>;

export type Gender = "M" | "F" | "I"; // male, female, intersex

// This will serve as the format for a lookup table used to determine a fetus's stats
export interface FetalGrowthStats {
	height: number; // in cm
	weight: number; // in grams
	fluid: number; // in ml
}
