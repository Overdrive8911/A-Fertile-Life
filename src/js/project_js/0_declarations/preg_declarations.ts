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
  developmentWeek: number; // e.g 12, 23, 32, 40
  growthRate: number; // e.g 1.5, 0.5, 2.0
  weight: number; // in grams e.g 360, 501, 600
  height: number; // in inches e.g 11.38, 10.94
}

// The chances for the fertilized ova to split are determined by these values. The first is a 25% chance to get twins and then another 20% for triplets ONLY IF the chance for twins succeeded so its actually a 0.5% chance for triplets. However, high fertility can provide bonuses to supplement this
const chanceOfNaturalOvaSplit = [
  // 0.25, 0.2, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05, 0.01,
  0.25, 0.2, 0.2, 0.15, 0.1, 0.05, 0.03, 0.01, 0.005,
];

// The chance that more than one sperm will find and successfully fertilize more than one egg
const chanceOfNaturalMultipleOvaFertilization = [0.1, 0.05, 0.03];
