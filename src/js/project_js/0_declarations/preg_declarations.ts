/* Womb, Pregnancy and Birth */
/* A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions */
/* A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has */
/* The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has */
/* Capacity is in cubic centimetres(CCs) */
// Just look for `player_variables.ts`
interface Womb {
  hp: number;
  maxHp: number;
  fertility: number;
  curCapacity: number;
  comfortCapacity: number;
  maxCapacity: number;
  lvl: number;
  exp: number;
  maxExp: number;
  postpartum: number;
  contraceptives: boolean;
  birthRecord: number;
  belongToPlayer: boolean;
  perks: {
    gestator: [currLevel: number, price: number, maxLevel: number];
    hyperFertility: [currLevel: number, price: number, maxLevel: number];
    superfet: [currLevel: number, price: number, maxLevel: number];
    elasticity: [currLevel: number, price: number, maxLevel: number];
    immunityBoost: [currLevel: number, price: number, maxLevel: number];
    motherlyHips: [currLevel: number, price: number, maxLevel: number];
    motherlyBoobs: [currLevel: number, price: number, maxLevel: number];
    ironSpine: [currLevel: number, price: number, maxLevel: number];
    sensitiveWomb: [currLevel: number, price: number, maxLevel: number];
    healthyWomb: [currLevel: number, price: number, maxLevel: number];
    fortifiedWomb: [currLevel: number, price: number, maxLevel: number];
    noPostpartum: [currLevel: number, price: number, maxLevel: number];
  };
  sideEffects: {
    cravingCrisis: [currDuration: number, maxDuration: number[]];
    motherHunger: [currDuration: number, maxDuration: number[]];
    restlessBrood: [currDuration: number, maxDuration: number[]];
    heavyWomb: [currDuration: number, maxDuration: number[]];
    contractions: [currDuration: number, maxDuration: number[]];
    labour: [currDuration: number, maxDuration: number[]];
    sexCraving: [currDuration: number, maxDuration: number[]];
    growthSpurt: [currDuration: number, maxDuration: number[]];
  };
  fetusData: Map<number /* fetusId */, FetusData>;
}

interface FetusData {
  id: number; // decides the gender, growthRate, weight, and height
  gender: string; // e.g M, F, NB
  dateOfConception: Date; // Just here :p
  lastPregUpdate: Date; // Tells the last time the pregnancy progress was calculated. Is the same as `date of conception` upon impregnation
  developmentRatio: number; // e.g 50%, 23%, 87%, 100%
  growthRate: number; // e.g 1.5, 0.5, 2.0
  weight: number; // in grams e.g 360, 501, 600
  height: number; // in cm e.g 11.38, 10.94
  amnioticFluidVolume: number; // The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
}

// This will serve as the format for a lookup table used to determine a fetus's stats
interface FetalGrowthStats {
  height: number; // in cm
  weight: number; // in grams
  amnioticFluidProduced: number; // in ml
}

// These are just function params
enum FetalGrowthStatsEnum {
  HEIGHT,
  WEIGHT,
  AMNIOTIC_FLUID,
}

// The chances for the fertilized ova to split are determined by these values. The first is a 25% chance to get twins and then another 20% for triplets ONLY IF the chance for twins succeeded so its actually a 0.5% chance for triplets. However, high fertility can provide bonuses to supplement this
const gChanceOfNaturalOvaSplit = [
  // 0.25, 0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.01,
  0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.03, 0.01, 0.005,
];

// The chance that more than one sperm will find and successfully fertilize more than one egg
const gChanceOfNaturalMultipleOvaFertilization = [0.1, 0.05, 0.03];

// The enums for the trimesters. The growth progress for the trimesters are in a ratio 3:5:4
enum Trimesters {
  First = 3 / 12,
  Second = 5 / 12,
  Third = 4 / 12,
}
// These 2 determine the lower and upper bounds of the `developmentRatio` of a fetus
const gMinDevelopmentState = 0; // 0 Percent
const gMaxDevelopmentState = 100; // 100 Percent

const gFirstTrimesterState = Trimesters.First * gMaxDevelopmentState; // 25 i.e 0 to 25
const gSecondTrimesterState =
  Trimesters.Second * gMaxDevelopmentState + gFirstTrimesterState; // 66.67 i.e 25 to 66.67
const gThirdTrimesterState =
  Trimesters.Third * gMaxDevelopmentState + gSecondTrimesterState; // 100 i.e 66.67 to 100

const gNumOfGestationalWeeks = 40; // Birth can start 100% safely from the 36th week, before then (32 - 36), it's an early birth
const gDefaultPregnancyLength = 26280028.8; // 10 months. 40 weeks. 26280028.8 seconds. For the player, this is 4
let gActualPregnancyLength = gDefaultPregnancyLength; // NOTE - This will be changed, depending on whether the mother is the player, genetic conditions, and/or drugs, as well as the growthRate of the fetus

// There are 40 gestational weeks, give or take. Each gestational week doesn't mean a literal week, more so, a relative portion of gestational development that mirrors irl. So it's a fixed ratio whose actual value depends on the length of gestation
enum GestationalWeek {
  One = 1 / gNumOfGestationalWeeks,
  Two = 2 / gNumOfGestationalWeeks,
  Three = 3 / gNumOfGestationalWeeks,
  Four = 4 / gNumOfGestationalWeeks,
  Five = 5 / gNumOfGestationalWeeks,
  Six = 6 / gNumOfGestationalWeeks,
  Seven = 7 / gNumOfGestationalWeeks,
  Eight = 8 / gNumOfGestationalWeeks,
  Nine = 9 / gNumOfGestationalWeeks,
  Ten = 10 / gNumOfGestationalWeeks,
  Eleven = 11 / gNumOfGestationalWeeks,
  Twelve = 12 / gNumOfGestationalWeeks,
  Thirteen = 13 / gNumOfGestationalWeeks,
  Fourteen = 14 / gNumOfGestationalWeeks,
  Fifteen = 15 / gNumOfGestationalWeeks,
  Sixteen = 16 / gNumOfGestationalWeeks,
  Seventeen = 17 / gNumOfGestationalWeeks,
  Eighteen = 18 / gNumOfGestationalWeeks,
  Nineteen = 19 / gNumOfGestationalWeeks,
  Twenty = 20 / gNumOfGestationalWeeks,
  TwentyOne = 21 / gNumOfGestationalWeeks,
  TwentyTwo = 22 / gNumOfGestationalWeeks,
  TwentyThree = 23 / gNumOfGestationalWeeks,
  TwentyFour = 24 / gNumOfGestationalWeeks,
  TwentyFive = 25 / gNumOfGestationalWeeks,
  TwentySix = 26 / gNumOfGestationalWeeks,
  TwentySeven = 27 / gNumOfGestationalWeeks,
  TwentyEight = 28 / gNumOfGestationalWeeks,
  TwentyNine = 29 / gNumOfGestationalWeeks,
  Thirty = 30 / gNumOfGestationalWeeks,
  ThirtyOne = 31 / gNumOfGestationalWeeks,
  ThirtyTwo = 32 / gNumOfGestationalWeeks,
  ThirtyThree = 33 / gNumOfGestationalWeeks,
  ThirtyFour = 34 / gNumOfGestationalWeeks,
  ThirtyFive = 35 / gNumOfGestationalWeeks,
  ThirtySix = 36 / gNumOfGestationalWeeks,
  ThirtySeven = 37 / gNumOfGestationalWeeks,
  ThirtyEight = 38 / gNumOfGestationalWeeks,
  ThirtyNine = 39 / gNumOfGestationalWeeks,
  Forty = 40 / gNumOfGestationalWeeks,
}

enum PregnancyState {
  NOT_PREGNANT,
  PREGNANT,
  READY_TO_DROP,
  OVERDUE,
}

// This is mainly for singleton pregnancies
const gFetalGrowthOverGestationalWeeks: {
  [key in GestationalWeek]?: FetalGrowthStats;
} = {
  // I'll just hallucinate some values
  [GestationalWeek.One]: {
    height: 0.005,
    weight: 0.005,
    amnioticFluidProduced: 0.5,
  },
  [GestationalWeek.Two]: { height: 0.02, weight: 1, amnioticFluidProduced: 1 },
  [GestationalWeek.Three]: {
    height: 0.035,
    weight: 3,
    amnioticFluidProduced: 2,
  },
  [GestationalWeek.Four]: {
    height: 0.065,
    weight: 5,
    amnioticFluidProduced: 3.5,
  },
  [GestationalWeek.Five]: { height: 0.1, weight: 7, amnioticFluidProduced: 5 },
  [GestationalWeek.Six]: { height: 0.6, weight: 10, amnioticFluidProduced: 7 },
  [GestationalWeek.Seven]: {
    height: 1.1,
    weight: 14,
    amnioticFluidProduced: 10,
  },
  // From here, it's more accurate
  [GestationalWeek.Eight]: {
    height: 1.57,
    weight: 20,
    amnioticFluidProduced: 13,
  },
  [GestationalWeek.Nine]: {
    height: 2.3,
    weight: 27,
    amnioticFluidProduced: 27.5,
  },
  [GestationalWeek.Ten]: { height: 3.1, weight: 35, amnioticFluidProduced: 50 },
  [GestationalWeek.Eleven]: {
    height: 4.1,
    weight: 45,
    amnioticFluidProduced: 57.5,
  },
  [GestationalWeek.Twelve]: {
    height: 5.4,
    weight: 58,
    amnioticFluidProduced: 75,
  },
  [GestationalWeek.Thirteen]: {
    height: 7.4,
    weight: 76,
    amnioticFluidProduced: 95,
  },
  [GestationalWeek.Fourteen]: {
    height: 8.7,
    weight: 93,
    amnioticFluidProduced: 125,
  },
  [GestationalWeek.Fifteen]: {
    height: 10.1,
    weight: 117,
    amnioticFluidProduced: 155,
  },
  [GestationalWeek.Sixteen]: {
    height: 11.6,
    weight: 146,
    amnioticFluidProduced: 175,
  },
  [GestationalWeek.Seventeen]: {
    height: 13,
    weight: 181,
    amnioticFluidProduced: 225,
  },
  [GestationalWeek.Eighteen]: {
    height: 14.2,
    weight: 223,
    amnioticFluidProduced: 260,
  },
  [GestationalWeek.Nineteen]: {
    height: 15.3,
    weight: 273,
    amnioticFluidProduced: 300,
  },
  [GestationalWeek.Twenty]: {
    height: 16.4,
    weight: 331,
    amnioticFluidProduced: 350,
  },
  [GestationalWeek.TwentyOne]: {
    height: 26.7,
    weight: 399,
    amnioticFluidProduced: 375,
  },
  [GestationalWeek.TwentyTwo]: {
    height: 27.8,
    weight: 478,
    amnioticFluidProduced: 425,
  },
  [GestationalWeek.TwentyThree]: {
    height: 28.9,
    weight: 568,
    amnioticFluidProduced: 475,
  },
  [GestationalWeek.TwentyFour]: {
    height: 30,
    weight: 670,
    amnioticFluidProduced: 525,
  },
  [GestationalWeek.TwentyFive]: {
    height: 34.6,
    weight: 785,
    amnioticFluidProduced: 600,
  },
  [GestationalWeek.TwentySix]: {
    height: 35.6,
    weight: 913,
    amnioticFluidProduced: 675,
  },
  [GestationalWeek.TwentySeven]: {
    height: 36.6,
    weight: 1055,
    amnioticFluidProduced: 750,
  },
  [GestationalWeek.TwentyEight]: {
    height: 37.6,
    weight: 1210,
    amnioticFluidProduced: 825,
  },
  [GestationalWeek.TwentyNine]: {
    height: 38.6,
    weight: 1379,
    amnioticFluidProduced: 900,
  },
  [GestationalWeek.Thirty]: {
    height: 39.9,
    weight: 1559,
    amnioticFluidProduced: 975,
  },
  [GestationalWeek.ThirtyOne]: {
    height: 41.1,
    weight: 1751,
    amnioticFluidProduced: 1050,
  },
  [GestationalWeek.ThirtyTwo]: {
    height: 42.4,
    weight: 1953,
    amnioticFluidProduced: 1125,
  },
  [GestationalWeek.ThirtyThree]: {
    height: 43.7,
    weight: 2162,
    amnioticFluidProduced: 1200,
  },
  [GestationalWeek.ThirtyFour]: {
    height: 45,
    weight: 2377,
    amnioticFluidProduced: 1275,
  },
  [GestationalWeek.ThirtyFive]: {
    height: 46.2,
    weight: 2595,
    amnioticFluidProduced: 1350,
  },
  [GestationalWeek.ThirtySix]: {
    height: 47.4,
    weight: 2813,
    amnioticFluidProduced: 1375,
  },
  [GestationalWeek.ThirtySeven]: {
    height: 48.6,
    weight: 3028,
    amnioticFluidProduced: 1400, // Amniotic fluid maxes around the 37/38th week
  },
  [GestationalWeek.ThirtyEight]: {
    height: 49.8,
    weight: 3236,
    amnioticFluidProduced: 1200,
  },
  [GestationalWeek.ThirtyNine]: {
    height: 50.7,
    weight: 3435,
    // amnioticFluidProduced: 1000,
    amnioticFluidProduced: 1100,
  },
  [GestationalWeek.Forty]: {
    height: 51.2,
    weight: 3619,
    // amnioticFluidProduced: 800,
    amnioticFluidProduced: 900,
  },
  // NOTE - From here onwards, the weight averages at around +150g per week while height ranges from +0.2cm to +0.5cm. Amniotic fluid reduces at a rate of 100~125 ml/week till around 250 ml (at week 43) where it stops reducing
};
