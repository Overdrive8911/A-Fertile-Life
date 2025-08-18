/** biome-ignore-all lint/suspicious/noConstEnum: <Const enum :3> */
// These are just function params
//

import { getRandomIntegerInRange } from "../shared/utils";

// REVIEW - I greatly regret hardcoding these values.
export const enum FetalGrowthStatsEnum {
	HEIGHT = "height",
	WEIGHT = "weight",
	AMNIOTIC_FLUID = "amnioticFluidVolume",
}
export const enum FetusSpecies {
	HUMAN,
	TENTACLE,
}

// Enum constants to dictate the level of fertility (it's over 100)
export const enum FertilityLevel {
	BARREN,
	ALMOST_BARREN = 10,
	POOR_FERTILITY = 25,
	AVERAGE_FERTILITY = 45,
	HIGH_FERTILITY = 65,
	EXTREME_FERTILITY = 85,
	UNFATHOMABLE_FERTILITY = 100,
	FERTILITY_IDOL = 101,
}

// Imagine these as percentages (womb.hp / womb.maxHp)
export enum WombHealth {
	RIP,
	CRITICAL = 15,
	VERY_POOR = 35,
	POOR = 50,
	MEDIOCRE = 70,
	HEALTHY = 80,
	VERY_HEALTHY = 90,
	FULL_VITALITY = 100,
}

export enum BirthRecordThreshold {
	NEWB,
	INEXPERIENCED = 1,
	STARTER = 3,
	EXPERIENCED = 5,
	VETERAN = 10,
	MOTHER = 25,
}

// There are 40 gestational weeks, give or take. Each gestational week doesn't mean a literal week, more so, a relative portion of gestational development that mirrors irl. So it's a fixed ratio whose actual value depends on the length of gestation
export const enum GestationalWeek {
	One = 1,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Eleven,
	Twelve,
	Thirteen,
	Fourteen,
	Fifteen,
	Sixteen,
	Seventeen,
	Eighteen,
	Nineteen,
	Twenty,
	TwentyOne,
	TwentyTwo,
	TwentyThree,
	TwentyFour,
	TwentyFive,
	TwentySix,
	TwentySeven,
	TwentyEight,
	TwentyNine,
	Thirty,
	ThirtyOne,
	ThirtyTwo,
	ThirtyThree,
	ThirtyFour,
	ThirtyFive,
	ThirtySix,
	ThirtySeven,
	ThirtyEight,
	ThirtyNine,
	Forty,

	//
	MAX = GestationalWeek.Forty,
}
