import { GestationalWeek } from "./enums";
import type { FetalGrowthStats } from "./types";
import { getWombVolumeFromFetusStats } from "./utils";

export type DevelopmentRatio = number;
// The chances for the fertilized ova to split are determined by these values. The first is a 25% chance to get twins and then another 20% for triplets ONLY IF the chance for twins succeeded so its actually a 0.5% chance for triplets. However, high fertility can provide bonuses to supplement this
export const gChanceOfNaturalOvaSplit = [
	// 0.25, 0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.01,
	0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.03, 0.01, 0.005,
] as const;

// The chance that more than one sperm will find and successfully fertilize more than one egg
export const gChanceOfNaturalMultipleOvaFertilization = [
	0.1, 0.05, 0.03,
] as const;

// This is mainly for singleton pregnancies
export const gFetalGrowthOverGestationalWeeks = {
	// I'll just hallucinate some values
	[GestationalWeek.One]: {
		fluid: 0.5,
		height: 0.005,
		weight: 0.005,
	},
	[GestationalWeek.Two]: { fluid: 1, height: 0.02, weight: 1 },
	[GestationalWeek.Three]: {
		fluid: 2,
		height: 0.035,
		weight: 3,
	},
	[GestationalWeek.Four]: {
		fluid: 3.5,
		height: 0.065,
		weight: 5,
	},
	[GestationalWeek.Five]: { fluid: 5, height: 0.1, weight: 7 },
	[GestationalWeek.Six]: { fluid: 7, height: 0.6, weight: 10 },
	[GestationalWeek.Seven]: {
		fluid: 10,
		height: 1.1,
		weight: 14,
	},
	// From here, it's more accurate
	[GestationalWeek.Eight]: {
		fluid: 13,
		height: 1.57,
		weight: 20,
	},
	[GestationalWeek.Nine]: {
		fluid: 27.5,
		height: 2.3,
		weight: 27,
	},
	[GestationalWeek.Ten]: { fluid: 50, height: 3.1, weight: 35 },
	[GestationalWeek.Eleven]: {
		fluid: 57.5,
		height: 4.1,
		weight: 45,
	},
	[GestationalWeek.Twelve]: {
		fluid: 75,
		height: 5.4,
		weight: 58,
	},
	[GestationalWeek.Thirteen]: {
		fluid: 95,
		height: 7.4,
		weight: 76,
	},
	[GestationalWeek.Fourteen]: {
		fluid: 125,
		height: 8.7,
		weight: 93,
	},
	[GestationalWeek.Fifteen]: {
		fluid: 155,
		height: 10.1,
		weight: 117,
	},
	[GestationalWeek.Sixteen]: {
		fluid: 175,
		height: 11.6,
		weight: 146,
	},
	[GestationalWeek.Seventeen]: {
		fluid: 225,
		height: 13,
		weight: 181,
	},
	[GestationalWeek.Eighteen]: {
		fluid: 260,
		height: 14.2,
		weight: 223,
	},
	[GestationalWeek.Nineteen]: {
		fluid: 300,
		height: 15.3,
		weight: 273,
	},
	[GestationalWeek.Twenty]: {
		fluid: 350,
		height: 16.4,
		weight: 331,
	},
	[GestationalWeek.TwentyOne]: {
		fluid: 375,
		height: 26.7,
		weight: 399,
	},
	[GestationalWeek.TwentyTwo]: {
		fluid: 425,
		height: 27.8,
		weight: 478,
	},
	[GestationalWeek.TwentyThree]: {
		fluid: 475,
		height: 28.9,
		weight: 568,
	},
	[GestationalWeek.TwentyFour]: {
		fluid: 525,
		height: 30,
		weight: 670,
	},
	[GestationalWeek.TwentyFive]: {
		fluid: 600,
		height: 34.6,
		weight: 785,
	},
	[GestationalWeek.TwentySix]: {
		fluid: 675,
		height: 35.6,
		weight: 913,
	},
	[GestationalWeek.TwentySeven]: {
		fluid: 750,
		height: 36.6,
		weight: 1055,
	},
	[GestationalWeek.TwentyEight]: {
		fluid: 825,
		height: 37.6,
		weight: 1210,
	},
	[GestationalWeek.TwentyNine]: {
		fluid: 900,
		height: 38.6,
		weight: 1379,
	},
	[GestationalWeek.Thirty]: {
		fluid: 975,
		height: 39.9,
		weight: 1559,
	},
	[GestationalWeek.ThirtyOne]: {
		fluid: 1050,
		height: 41.1,
		weight: 1751,
	},
	[GestationalWeek.ThirtyTwo]: {
		fluid: 1125,
		height: 42.4,
		weight: 1953,
	},
	[GestationalWeek.ThirtyThree]: {
		fluid: 1200,
		height: 43.7,
		weight: 2162,
	},
	[GestationalWeek.ThirtyFour]: {
		fluid: 1275,
		height: 45,
		weight: 2377,
	},
	[GestationalWeek.ThirtyFive]: {
		fluid: 1350,
		height: 46.2,
		weight: 2595,
	},
	[GestationalWeek.ThirtySix]: {
		fluid: 1375,
		height: 47.4,
		weight: 2813,
	},
	[GestationalWeek.ThirtySeven]: {
		fluid: 1400, // Amniotic fluid maxes around the 37/38th week
		height: 48.6,
		weight: 3028,
	},
	[GestationalWeek.ThirtyEight]: {
		fluid: 1200,
		height: 49.8,
		weight: 3236,
	},
	[GestationalWeek.ThirtyNine]: {
		// fluid: 1000,
		fluid: 1100,
		height: 50.7,
		weight: 3435,
	},
	[GestationalWeek.Forty]: {
		// fluid: 800,
		fluid: 950,
		height: 51.2,
		weight: 3619,
	},
	// NOTE - An idea: The weight averages at around +150g per week while height ranges from +0.2cm to +0.5cm. Amniotic fluid reduces at a rate of 100~125 ml/week till around 250 ml (at week 43) where it stops reducing
} as const satisfies Record<GestationalWeek, FetalGrowthStats>;

/** Contains the thresholds for different belly sizes.
 *
 * NOTE - The order of this is important.
 *
 * NOTE - This may also be used for stuffing content too
 */
export const BellySize = {
	SAG: -1,
	FLAT: 0,
	PREG_MIN: 0,
	// BLOATED = 100,
	// STUFFED = 500,

	EARLY_PREGNANCY: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.One].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.One].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.One].fluid,
	), // 12 weeks or less
	EARLY_PREGNANCY_2: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].fluid,
	), // Week 13 till Week 19
	VISIBLE_PREGNANCY: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].fluid,
	), // Week 20 till Week 27
	LATE_PREGNANCY: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].fluid,
	), // Week 28 till Week 35
	LATE_PREGNANCY_2: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].fluid,
	), // Week 36 till Week 40
	FULL_TERM: getWombVolumeFromFetusStats(
		gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].weight,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].height,
		gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].fluid,
	), // Week 40. Should be around 10000

	get FULL_TERM_TWINS() {
		return this.FULL_TERM * 2;
	},
	get FULL_TERM_TRIPLETS() {
		return this.FULL_TERM * 3;
	},
	get FULL_TERM_QUADS() {
		return this.FULL_TERM * 4;
	},
	get FULL_TERM_QUINTS() {
		return this.FULL_TERM * 5;
	},
	get FULL_TERM_SEXTUPLETS() {
		return this.FULL_TERM * 6;
	},
	get FULL_TERM_SEPTUPLETS() {
		return this.FULL_TERM * 7;
	},
	get FULL_TERM_OCTUPLETS() {
		return this.FULL_TERM * 8;
	},
	get FULL_TERM_NONUPLETS() {
		return this.FULL_TERM * 9;
	},
	get FULL_TERM_DECUPLETS() {
		return this.FULL_TERM * 10;
	},

	get PREG_MAX(): number {
		return this.FULL_TERM_DECUPLETS;
	},
} as const;

export type BellySize = (typeof BellySize)[keyof typeof BellySize];

const calcWombExpReq = (previousLvl: number): number => {
	const currentLevelExp =
		((2 * previousLvl + Math.floor(previousLvl / 2)) * BellySize.FULL_TERM) /
		10;

	return (
		currentLevelExp + (previousLvl > 1 ? calcWombExpReq(previousLvl - 1) : 0)
	);
};

/**
 * On average, it'd take (2*LVL + Math.floor(LVL/2)) full term singleton pregnancies to gain enough exp to reach the next level (i.e 2 from LVL_1 to LVL_2, 5 from LVL_2 to LVL_3, 7 from LVL_3 to LVL_4, 10 from LVL_4 to LVL_5)
 *
 * NOTE: These are the limits for each lvl (i.e It takes 0 exp to reach LVL_1 and roughly 2000 exp to reach LVL_2)
 */
export const WombExpLimit = {
	// Just follow the pattern if its confusing  >~<.
	1: 0,
	2: calcWombExpReq(1), // Roughly 2000
	3: calcWombExpReq(2), // Roughly 7000
	4: calcWombExpReq(3), // Roughly 14000
	5: calcWombExpReq(4),
	6: calcWombExpReq(5),
	7: calcWombExpReq(6),
	8: calcWombExpReq(7),
	9: calcWombExpReq(8),
	10: calcWombExpReq(9),
	11: calcWombExpReq(10),
	12: calcWombExpReq(11),
	13: calcWombExpReq(12),
	14: calcWombExpReq(13),
	15: calcWombExpReq(14),
} as const;
