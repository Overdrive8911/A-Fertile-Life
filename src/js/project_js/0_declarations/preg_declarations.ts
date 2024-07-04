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
  gender: string; // e.g M, F, NB
  dateOfConception: Date; // Just here :p
  lastPregUpdate: Date; // Tells the last time the pregnancy progress was calculated. Is the same as `date of conception` upon impregnation
  developmentRatio: number; // e.g 50%, 23%, 87%, 100%
  growthRate: number; // e.g 1.5, 0.5, 2.0
  weight: number; // in grams e.g 360, 501, 600
  height: number; // in inches e.g 11.38, 10.94
  amnioticFluidVolume: number; // The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
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
const gMaxDevelopmentState = 100; // 100 Percent

const gFirstTrimesterState = Trimesters.First * gMaxDevelopmentState; // From 0 to 25
const gSecondTrimesterState =
  Trimesters.Second * gMaxDevelopmentState + gFirstTrimesterState; // To 66.67 i.e 25 to 66.67
const gThirdTrimesterState =
  Trimesters.Third * gMaxDevelopmentState + gSecondTrimesterState; // To 100 i.e 66.67 to 100
