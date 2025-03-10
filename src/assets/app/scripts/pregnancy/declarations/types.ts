export interface PregPerkDynamicData {
  // Only `currLevel` gets stored in the save file
  currLevel: number;

  // price?: never;
  // maxLevel?: never;
}
export interface PregPerkStaticData {
  // Is stored as a global static variable
  price: number;
  maxLevel: number;

  // currLevel?: never;
}

export interface PregSideEffectDynamicData {
  // Only `currDuration` gets stored in the save file
  currDuration: number;

  // maxDuration?: never;
}
export interface PregSideEffectStaticData {
  // Is stored as a global static variable
  maxDuration: number[];

  // currDuration?: never;
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
