// These are just function params

import { gFetalGrowthOverGestationalWeeks } from "./variables";

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
export enum FertilityLevel {
  BARREN,
  ALMOST_BARREN = 10,
  POOR_FERTILITY = 25,
  AVERAGE_FERTILITY = random(45, 55),
  HIGH_FERTILITY = 65,
  EXTREME_FERTILITY = random(75, 80),
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

// Contains the thresholds for different belly sizes.
// NOTE - This may also be used for stuffing content too
export enum BellyState {
  SAG = -1,
  FLAT = 0,
  PREG_MIN = 0,
  // BLOATED = 100,
  // STUFFED = 500,

  EARLY_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].amnioticFluidVolume
  ), // 12 weeks or less
  EARLY_PREGNANCY_2 = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen]
      .amnioticFluidVolume
  ), // Week 13 till Week 19
  VISIBLE_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].amnioticFluidVolume
  ), // Week 20 till Week 27
  LATE_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight]
      .amnioticFluidVolume
  ), // Week 28 till Week 35
  LATE_PREGNANCY_2 = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix]
      .amnioticFluidVolume
  ), // Week 36 till Week 40
  FULL_TERM = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].amnioticFluidVolume
  ), // Week 40. Should be around 10000

  FULL_TERM_TWINS = FULL_TERM * 2,
  FULL_TERM_TRIPLETS = FULL_TERM * 3,
  FULL_TERM_QUADS = FULL_TERM * 4,
  FULL_TERM_QUINTS = FULL_TERM * 5,
  FULL_TERM_SEXTUPLETS = FULL_TERM * 6,
  FULL_TERM_SEPTUPLETS = FULL_TERM * 7,
  FULL_TERM_OCTUPLETS = FULL_TERM * 8,
  FULL_TERM_NONUPLETS = FULL_TERM * 9,
  FULL_TERM_DECUPLETS = FULL_TERM * 10,

  PREG_MAX = FULL_TERM_DECUPLETS,
}

// This is only here because I'm using it in the enum above
function getWombVolumeFromFetusStats(
  height: number,
  weight: number,
  fluidVolume: number
) {
  // Make sure that, using the stats of a full term fetus, the result is close to 10000ml~11000ml. Preferably the former
  return (weight + height + fluidVolume * 0.4) * (10 / 4);
}
