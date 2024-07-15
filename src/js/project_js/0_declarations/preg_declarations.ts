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
  // TODO - Rename this 'capacity' stuff to 'size'
  curCapacity: BellyState;
  comfortCapacity: BellyState;
  maxCapacity: BellyState;
  exp: number;
  postpartum: number;
  contraceptives: boolean;
  birthRecord: number;
  lastFertilized: Date;
  lastBirth: Date;
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
  gender: string;
  dateOfConception: Date; // Just here :p
  lastPregUpdate: Date; // Tells the last time the pregnancy progress was calculated. Is the same as `date of conception` upon impregnation
  developmentRatio: number; // e.g 50%, 23%, 87%, 100%
  growthRate: number; // e.g 1.5, 0.5, 2.0
  weight: number; // in grams e.g 360, 501, 600
  height: number; // in cm e.g 11.38, 10.94
  amnioticFluidVolume: number; // The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
  shouldBirth: boolean; // whether or not the fetus should be expunged when birth happens (only applies for superfetation)

  species: FetusSpecies; // In the off-chance that I add non-human preg, this will store values from an enum containing the possible species to be impregnated with
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

enum PregPerkElements {
  CURRENT_LVL,
  PRICE,
  MAX_LVL,
}

enum PregSideEffectElements {
  CURRENT_DURATION,
  MAX_DURATION,
}

enum FetusSpecies {
  HUMAN,
  TENTACLE,
}

// Enum constants to dictate the level of fertility (it's over 100)
enum FertilityLevel {
  BARREN,
  ALMOST_BARREN = 10,
  POOR_FERTILITY = 25,
  AVERAGE_FERTILITY = random(45, 55),
  HIGH_FERTILITY = 65,
  EXTREME_FERTILITY = random(75, 80),
  UNFATHOMABLE_FERTILITY = 100,
  FERTILITY_IDOL = 101,
}

// The amount of exp it takes for the character's womb to reach the next level
enum WombExpLimit {
  LVL_1 = 0,
  LVL_2 = 1000,
  LVL_3 = 3000,
  LVL_4 = 7000,
  LVL_5 = 12000,
  LVL_6 = 20000,
  LVL_7 = 30000,
  LVL_8 = 45000,
  LVL_9 = 70000,
  LVL_10 = 100000,
  LVL_11 = 150000,
  LVL_12 = 220000,
  LVL_13 = 310000,
  LVL_14 = 420000,
  LVL_15 = 550000,
  // LVL_16 = 1000000,

  LVL_MAX = LVL_15,
  LVL_NOT_AVAILABLE = -999,
}

const gMinWombLevel = 1;
const gMaxWombLevel = 15;

const gNumOfHoursInAWeek = 168; // 604800 seconds, 7 days
const gHoursBetweenPregUpdate = 4; // How many hours it takes till the function to update the stats of pregnancy occurs

const gMinimumVolumeOfAmnioticFluid = 375; // 375 ml

// The chances for the fertilized ova to split are determined by these values. The first is a 25% chance to get twins and then another 20% for triplets ONLY IF the chance for twins succeeded so its actually a 0.5% chance for triplets. However, high fertility can provide bonuses to supplement this
const gChanceOfNaturalOvaSplit = [
  // 0.25, 0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.01,
  0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.03, 0.01, 0.005,
];

// The chance that more than one sperm will find and successfully fertilize more than one egg
const gChanceOfNaturalMultipleOvaFertilization = [0.1, 0.05, 0.03];

// Man this thing is nearly useless
enum PregnancyState {
  NOT_PREGNANT = 1 << 0,
  PREGNANT = 1 << 1,
  READY_TO_DROP = 1 << 2,
  OVERDUE = 1 << 3,

  // The bitwise combinations
  NOT_OVERDUE = NOT_PREGNANT | PREGNANT | READY_TO_DROP,
}

// The enums for the trimesters. The growth progress for the trimesters are in a ratio 3:5:4
// TODO - The last one is for overdue pregnancies and continues growth at a flat pace of 2.5~3.5
enum Trimesters {
  First = 3 / 12,
  Second = 5 / 12,
  Third = 4 / 12,

  Overdue,
}
// These 2 determine the lower and upper bounds of the `developmentRatio` of a fetus
const gMinDevelopmentState = 0; // 0 Percent
const gMaxDevelopmentState = 100; // 100 Percent

// In most cases, birth can only happen when above this threshold
const gMinBirthThreshold = 85; // 85 Percent

const gFirstTrimesterState = Trimesters.First * gMaxDevelopmentState; // 25 i.e 0 to 25
const gSecondTrimesterState =
  Trimesters.Second * gMaxDevelopmentState + gFirstTrimesterState; // 66.67 i.e 25 to 66.67
const gThirdTrimesterState =
  Trimesters.Third * gMaxDevelopmentState + gSecondTrimesterState; // 100 i.e 66.67 to 100

const gNumOfGestationalWeeks = 40; // IGNORE THIS COMMENT. Birth can start 100% safely from the 36th week, before then (32 - 36), it's an early birth
const gDefaultPregnancyLength = 26280028.8; // 10 months. 40 weeks. 26280028.8 seconds. For the player, this is 4
let gActualPregnancyLength = gDefaultPregnancyLength; // NOTE - This will be changed, depending on whether the mother is the player, genetic conditions, and/or drugs, as well as the growthRate of the fetus
const gOverduePregnancyLength = Infinity; // Overdue pregnancies have an indefinite length

// The higher this number, the higher the rate at which height/weight/amnioticFluid increase and decrease.
// Best leave it at small ratios and below 1
const gOverdueStatMultiplier = 0.34;

const gDefaultMaxWombHP = 100;

// There are 40 gestational weeks, give or take. Each gestational week doesn't mean a literal week, more so, a relative portion of gestational development that mirrors irl. So it's a fixed ratio whose actual value depends on the length of gestation
enum GestationalWeek {
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
  // NOTE - An idea: The weight averages at around +150g per week while height ranges from +0.2cm to +0.5cm. Amniotic fluid reduces at a rate of 100~125 ml/week till around 250 ml (at week 43) where it stops reducing
};

// This is only here because I'm using it in the enum below
const getWombVolumeFromFetusStats = (
  height: number,
  weight: number,
  fluidVolume: number
) => {
  // Make sure that, using the stats of a full term fetus, the result is close to 10000ml~11000ml
  return (weight + height * 0.75 + fluidVolume * 0.5) * (10 / 4);
};

// Contains the thresholds for different belly sizes.
// NOTE - This may also be used for stuffing content too
enum BellyState {
  SAG = -1,
  FLAT = 0,
  // BLOATED = 100,
  // STUFFED = 500,

  EARLY_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.One].amnioticFluidProduced
  ), // 12 weeks or less
  EARLY_PREGNANCY_2 = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Thirteen]
      .amnioticFluidProduced
  ), // Week 13 till Week 19
  VISIBLE_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Twenty]
      .amnioticFluidProduced
  ), // Week 20 till Week 27
  LATE_PREGNANCY = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.TwentyEight]
      .amnioticFluidProduced
  ), // Week 28 till Week 35
  LATE_PREGNANCY_2 = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.ThirtySix]
      .amnioticFluidProduced
  ), // Week 36 till Week 40
  FULL_TERM = getWombVolumeFromFetusStats(
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Forty].weight,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Forty].height,
    gFetalGrowthOverGestationalWeeks[GestationalWeek.Forty]
      .amnioticFluidProduced
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
