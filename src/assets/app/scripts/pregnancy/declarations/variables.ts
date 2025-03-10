import { GestationalWeek, BellyState } from "./enums";
import type {
  PregPerksObject,
  PregPerkStaticData,
  PregSideEffectsObject,
  PregSideEffectStaticData,
} from "./types";

export const gAllPregPerks: Required<PregPerksObject<PregPerkStaticData>> = {
  /* Its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant. */
  /* Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility */
  /* Each perk is an object of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level */
  /*TODO - Change the prices later to something more reasonable. Also, add more perks */

  // NOTE - Only store these if they're active
  gestator: {
    // currLevel: 1,
    price: 5000,
    maxLevel: 10,
  } /* Increases the speed of pregnancies, but makes and keeps the user hungrier. At the maximum level, pregnancy duration sped up by `gGestatorPerkMaxSpeedBoost` and additional hunger drain is always 30% of that. */,
  hyperFertility: {
    // currLevel: 1,
    price: 3000,
    maxLevel: 5,
  } /* Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */,
  superFet: {
    // currLevel: 1,
    price: 15000,
    maxLevel: 5,
  } /* Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */,
  elasticity: {
    // currLevel: 1,
    price: 7000,
    maxLevel: 10,
  } /* Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */,
  immunityBoost: {
    // currLevel: 1,
    price: 2000,
    maxLevel: 5,
  } /* Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */,
  motherlyHips: {
    // currLevel: 1,
    price: 5000,
    maxLevel: 5,
  } /* Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */,
  motherlyBoobs: {
    // currLevel: 1,
    price: 5000,
    maxLevel: 5,
  } /* Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */,
  ironSpine: {
    // currLevel: 1,
    price: 7000,
    maxLevel: 5,
  } /* Can carry bigger pregnancies and more weight before becoming bed bound */,
  sensitiveWomb: {
    // currLevel: 1,
    price: 6000,
    maxLevel: 5,
  } /* Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */,
  healthyWomb: {
    // currLevel: 1,
    price: 3000,
    maxLevel: 10,
  } /* Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */,
  fortifiedWomb: {
    // currLevel: 1,
    price: 10000,
    maxLevel: 5,
  } /* Raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */,
  noPostpartum: {
    // currLevel: 1,
    price: 2000,
    maxLevel: 10,
  } /* Reduces the postpartum period, completely erasing it at max FertilityLevel. Is only useful when activated before giving birth, that is, activating this perk during the postpartum period does nothing (Note that the PC has a recovery period of a week) */,
  polyhydramnios: {
    price: 1500,
    maxLevel: 10,
  } /* Increases amniotic fluid production per fetus */,
};

export const gGestatorPerkMaxSpeedBoost = 3; // +300% speed
export const gElasticityPerkMaxExpBoost = 0.5; // +50% increase
export const gElasticityPerkCapacityMaxBoost = 0.2; // +20% increase to both `comfortCapacity` and `maxCapacity`
export const gImmunityPerkMaxBoostPerFetus = 3; // 3 extra immunity points for every 1% increase in development per fetus
export const gHealthyWombPerkMaxHPIncrementBuff = 0.75; // +75% to all sources of positive hp
export const gHealthyWombPerkMaxHPDecrementNerf = 0.25; // -25% to all sources of negative hp
export const gFortifiedWombPerkMaxCapacityBoost = 0.5; // +50% increase to `maxCapacity`
export const gFortifiedWombPerkMaxNaturalBirthDelay = 0.25; // +25% more time after becoming due before birth may occur
export const gFortifiedWombPerkMaxPassiveHPDrainNerf = 0.25; // -25% to passive hp drain
export const gPolyhydramniosPerkMaxFluidProductionBoost = 0.5; // +50% more amniotic fluid per fetus

export const gAllSideEffects: Required<
  PregSideEffectsObject<PregSideEffectStaticData>
> = {
  /* Most can occur anytime in a pregnancy after 20% of fetal development is achieved and usually reduce performance or do some other undesirable stuff until they leave. Upgrading some perks can cause them to become stronger. */
  /* They are objects containing 2 values; the first decides if the user is afflicted with them and how long the condition (in seconds) will last while the second is an array storing the amount of days the side effect can last (if the latter is 0, it means the during depends entirely on other things). */
  /* TODO - Add more side effects */

  cravingCrisis: {
    // currDuration: 0,
    maxDuration: [1, 2],
  } /* Constantly reduces some stats and benefits of food until a randomly generated craving is satisfied. */,
  motherHunger: {
    // currDuration: 0,
    maxDuration: [1, 2, 3],
  } /* Reduces the amount of fullness food gives and allows fullness to be exceeded to a randomly generated extent. The user suffers penalties in stats and productivity if their . */,
  restlessBrood: {
    // currDuration: 0,
    maxDuration: [2, 3],
  } /* Drains energy faster and increases the energy cost of actions. Also reduces concentration and efficiency at work. The user will have to temporarily soother their children a lot. */,
  heavyWomb: {
    // currDuration: 0,
    maxDuration: [3, 5, 7],
  } /* Reduces non-vehicle movement speed and drains energy faster. Trying to do work in this condition may extend it. */,
  contractions: {
    // currDuration: 0,
    maxDuration: [1, 2, 3, 5],
  } /* Happens randomly around the user's due date and takes a small cut out of their stats. It also has the user stunned in place temporarily. */,
  labour: {
    // currDuration: 0,
    maxDuration: [3],
  } /* Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */,
  sexCraving: {
    // currDuration: 0,
    maxDuration: [1, 3],
  } /* Maxes out arousal once a day and keeps it above 75 */,
  growthSpurt: {
    // currDuration: 0,
    maxDuration: [1, 2, 3],
  } /* Can happen whenever the user does a lot of stuff that attributes to the growth of their pregnancy. This will happen around 12pm or 12am */,
};

export type DevelopmentRatio = number;
export type Gender = "M" | "F" | "I"; // male, female, intersex

// This will serve as the format for a lookup table used to determine a fetus's stats
export interface FetalGrowthStats {
  height: number; // in cm
  weight: number; // in grams
  amnioticFluidVolume: number; // in ml
}

export const gHoursBetweenPregUpdate = 4; // How many hours it takes till the function to update the stats of pregnancy occurs

export const gMinimumVolumeOfAmnioticFluid = 375; // 375 ml

// The chances for the fertilized ova to split are determined by these values. The first is a 25% chance to get twins and then another 20% for triplets ONLY IF the chance for twins succeeded so its actually a 0.5% chance for triplets. However, high fertility can provide bonuses to supplement this
export const gChanceOfNaturalOvaSplit = [
  // 0.25, 0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.01,
  0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.03, 0.01, 0.005,
];

// The chance that more than one sperm will find and successfully fertilize more than one egg
export const gChanceOfNaturalMultipleOvaFertilization = [0.1, 0.05, 0.03];

// These 2 determine the lower and upper bounds of the `developmentRatio` of a fetus
export const gMinDevelopmentState = 0; // 0 Percent
export const gMaxDevelopmentState = 100; // 100 Percent

// In most cases, birth is considered "full-term" from this week onwards. Week 37
export const gMinNormalBirthThreshold = 92.5; // 37 weeks
export const gPreemieBirthThreshold = 82.5; // 33 weeks
export const gVeryPreemieBirthThreshold = 70; // 28 weeks. For simplicity, assume that this is the vey minimum threshold for birth to occur.

export const gNumOfGestationalWeeks = 40; // IGNORE THIS COMMENT. Birth can start 100% safely from the 36th week, before then (32 - 36), it's an early birth
export const gDefaultPregnancyLength = 26280028.8; // 10 months. 40 weeks. 26280028.8 seconds. For the player, this is 4

export const gPostpartumPeriod = 4320000; // Time in seconds when the user can't be impregnated. Irl, it takes 6 ~ 8 weeks so I'll just go with a weighted average closer to 8 which is `getWeightedAverage(6, 8) * 7 * 24 * 60 * 60`

// The higher this number, the higher the rate at which height/weight/amnioticFluid increase and decrease.
// Best leave it at small ratios and below 1
export const gOverdueStatMultiplier = 0.34;

export const gDefaultMaxWombHP = 100;
export const gNumOfPossibleFetusIds = 65536;

// This is mainly for singleton pregnancies
export const gFetalGrowthOverGestationalWeeks: {
  [key in GestationalWeek]: FetalGrowthStats;
} = {
  // I'll just hallucinate some values
  [GestationalWeek.One]: {
    height: 0.005,
    weight: 0.005,
    amnioticFluidVolume: 0.5,
  },
  [GestationalWeek.Two]: { height: 0.02, weight: 1, amnioticFluidVolume: 1 },
  [GestationalWeek.Three]: {
    height: 0.035,
    weight: 3,
    amnioticFluidVolume: 2,
  },
  [GestationalWeek.Four]: {
    height: 0.065,
    weight: 5,
    amnioticFluidVolume: 3.5,
  },
  [GestationalWeek.Five]: { height: 0.1, weight: 7, amnioticFluidVolume: 5 },
  [GestationalWeek.Six]: { height: 0.6, weight: 10, amnioticFluidVolume: 7 },
  [GestationalWeek.Seven]: {
    height: 1.1,
    weight: 14,
    amnioticFluidVolume: 10,
  },
  // From here, it's more accurate
  [GestationalWeek.Eight]: {
    height: 1.57,
    weight: 20,
    amnioticFluidVolume: 13,
  },
  [GestationalWeek.Nine]: {
    height: 2.3,
    weight: 27,
    amnioticFluidVolume: 27.5,
  },
  [GestationalWeek.Ten]: { height: 3.1, weight: 35, amnioticFluidVolume: 50 },
  [GestationalWeek.Eleven]: {
    height: 4.1,
    weight: 45,
    amnioticFluidVolume: 57.5,
  },
  [GestationalWeek.Twelve]: {
    height: 5.4,
    weight: 58,
    amnioticFluidVolume: 75,
  },
  [GestationalWeek.Thirteen]: {
    height: 7.4,
    weight: 76,
    amnioticFluidVolume: 95,
  },
  [GestationalWeek.Fourteen]: {
    height: 8.7,
    weight: 93,
    amnioticFluidVolume: 125,
  },
  [GestationalWeek.Fifteen]: {
    height: 10.1,
    weight: 117,
    amnioticFluidVolume: 155,
  },
  [GestationalWeek.Sixteen]: {
    height: 11.6,
    weight: 146,
    amnioticFluidVolume: 175,
  },
  [GestationalWeek.Seventeen]: {
    height: 13,
    weight: 181,
    amnioticFluidVolume: 225,
  },
  [GestationalWeek.Eighteen]: {
    height: 14.2,
    weight: 223,
    amnioticFluidVolume: 260,
  },
  [GestationalWeek.Nineteen]: {
    height: 15.3,
    weight: 273,
    amnioticFluidVolume: 300,
  },
  [GestationalWeek.Twenty]: {
    height: 16.4,
    weight: 331,
    amnioticFluidVolume: 350,
  },
  [GestationalWeek.TwentyOne]: {
    height: 26.7,
    weight: 399,
    amnioticFluidVolume: 375,
  },
  [GestationalWeek.TwentyTwo]: {
    height: 27.8,
    weight: 478,
    amnioticFluidVolume: 425,
  },
  [GestationalWeek.TwentyThree]: {
    height: 28.9,
    weight: 568,
    amnioticFluidVolume: 475,
  },
  [GestationalWeek.TwentyFour]: {
    height: 30,
    weight: 670,
    amnioticFluidVolume: 525,
  },
  [GestationalWeek.TwentyFive]: {
    height: 34.6,
    weight: 785,
    amnioticFluidVolume: 600,
  },
  [GestationalWeek.TwentySix]: {
    height: 35.6,
    weight: 913,
    amnioticFluidVolume: 675,
  },
  [GestationalWeek.TwentySeven]: {
    height: 36.6,
    weight: 1055,
    amnioticFluidVolume: 750,
  },
  [GestationalWeek.TwentyEight]: {
    height: 37.6,
    weight: 1210,
    amnioticFluidVolume: 825,
  },
  [GestationalWeek.TwentyNine]: {
    height: 38.6,
    weight: 1379,
    amnioticFluidVolume: 900,
  },
  [GestationalWeek.Thirty]: {
    height: 39.9,
    weight: 1559,
    amnioticFluidVolume: 975,
  },
  [GestationalWeek.ThirtyOne]: {
    height: 41.1,
    weight: 1751,
    amnioticFluidVolume: 1050,
  },
  [GestationalWeek.ThirtyTwo]: {
    height: 42.4,
    weight: 1953,
    amnioticFluidVolume: 1125,
  },
  [GestationalWeek.ThirtyThree]: {
    height: 43.7,
    weight: 2162,
    amnioticFluidVolume: 1200,
  },
  [GestationalWeek.ThirtyFour]: {
    height: 45,
    weight: 2377,
    amnioticFluidVolume: 1275,
  },
  [GestationalWeek.ThirtyFive]: {
    height: 46.2,
    weight: 2595,
    amnioticFluidVolume: 1350,
  },
  [GestationalWeek.ThirtySix]: {
    height: 47.4,
    weight: 2813,
    amnioticFluidVolume: 1375,
  },
  [GestationalWeek.ThirtySeven]: {
    height: 48.6,
    weight: 3028,
    amnioticFluidVolume: 1400, // Amniotic fluid maxes around the 37/38th week
  },
  [GestationalWeek.ThirtyEight]: {
    height: 49.8,
    weight: 3236,
    amnioticFluidVolume: 1200,
  },
  [GestationalWeek.ThirtyNine]: {
    height: 50.7,
    weight: 3435,
    // amnioticFluidVolume: 1000,
    amnioticFluidVolume: 1100,
  },
  [GestationalWeek.Forty]: {
    height: 51.2,
    weight: 3619,
    // amnioticFluidVolume: 800,
    amnioticFluidVolume: 950,
  },
  // NOTE - An idea: The weight averages at around +150g per week while height ranges from +0.2cm to +0.5cm. Amniotic fluid reduces at a rate of 100~125 ml/week till around 250 ml (at week 43) where it stops reducing
};

const calcWombExpReq = (previousLvl: number) => {
  return (
    ((2 * previousLvl + Math.floor(previousLvl / 2)) * BellyState.FULL_TERM) /
    10
  );
};

// On average, it'd take (2*LVL + Math.floor(LVL/2)) full term singleton pregnancies to gain enough exp to reach the next level (i.e 2 from LVL_1 to LVL_2, 5 from LVL_2 to LVL_3, 7 from LVL_3 to LVL_4, 10 from LVL_4 to LVL_5)
// Just follow the pattern if its confusing  >~<
export enum WombExpLimit {
  LVL_1 = 0,
  LVL_2 = calcWombExpReq(1), // Roughly 2000
  LVL_3 = calcWombExpReq(2) + LVL_2, // Roughly 7000
  LVL_4 = calcWombExpReq(3) + LVL_3, // Roughly 14000
  LVL_5 = calcWombExpReq(4) + LVL_4,
  LVL_6 = calcWombExpReq(5) + LVL_5,
  LVL_7 = calcWombExpReq(6) + LVL_6,
  LVL_8 = calcWombExpReq(7) + LVL_7,
  LVL_9 = calcWombExpReq(8) + LVL_8,
  LVL_10 = calcWombExpReq(9) + LVL_9,
  LVL_11 = calcWombExpReq(10) + LVL_10,
  LVL_12 = calcWombExpReq(11) + LVL_11,
  LVL_13 = calcWombExpReq(12) + LVL_12,
  LVL_14 = calcWombExpReq(13) + LVL_13,
  LVL_15 = calcWombExpReq(14) + LVL_14,

  LVL_MAX = LVL_15,
  NOT_AVAILABLE = -999,
}

export const gMinWombLevel = 1;
export const gMaxWombLevel = 15;

export const gExpPerSinglePregnancy = 1000; // Singleton, non-overdue, full-term pregnancies award this in total. However, 40% of it is only given during birth.
export const gExpPerSingleBirth = gExpPerSinglePregnancy * 0.4;
export const gExpPerSingleFetusGestation =
  gExpPerSinglePregnancy - gExpPerSingleBirth;
