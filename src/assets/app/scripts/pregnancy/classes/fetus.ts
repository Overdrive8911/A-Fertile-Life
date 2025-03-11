import {
  FetusSpecies,
  WombHealth,
  FetalGrowthStatsEnum,
  GestationalWeek,
} from "../declarations/enums";
import {
  type DevelopmentRatio,
  gMinDevelopmentState,
  type Gender,
  gNumOfPossibleFetusIds,
  gMaxDevelopmentState,
  gMinNormalBirthThreshold,
  gPreemieBirthThreshold,
  gVeryPreemieBirthThreshold,
  gDefaultPregnancyLength,
  gNumOfGestationalWeeks,
  gFetalGrowthOverGestationalWeeks,
  gOverdueStatMultiplier,
} from "../declarations/variables";
import type { Womb } from "./womb";

export class Fetus {
  /**
   * decides the gender, growthRate, weight, and height
   */
  id: number;

  /**
   * scales with the womb's health. don't let it get to zero
   */
  hp: number;
  dateOfConception: Date; // Just here :p
  /**
   * e.g 50%, 23%, 87%, 100%
   */
  developmentRatio: DevelopmentRatio;
  devRatioAtLastUpdate: DevelopmentRatio = 0;
  /**
   * A modifier multiplied to the fetus's growth rate. Comes from other sources
   */
  extraGrowthMod?: number;
  // NOTE - ANY CHANGES TO THE FOLLOWING THREE PROPERTIES MUST BE REFLECTED IN `FetalGrowthStatsEnum`
  /**
   * in grams e.g 360, 501, 600
   */
  weight: number;
  /**
   * in cm e.g 11.38, 10.94
   */
  height: number;
  /**
   * The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
   */
  amnioticFluidVolume: number;
  /**
   * In the off-chance that I add non-human preg, this will store values from an enum containing the possible species to be impregnated with
   */
  species = FetusSpecies.HUMAN;

  /**
   * A value of 1 produces "normal" growth
   */
  static #growthRateValues = [
    0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1, 1, 1, 1, 1.005, 1.01, 1.015,
    1.02, 1.025, 1.03, 1.035,
  ];

  constructor(newId: number, classProp: typeof Fetus | null = null) {
    this.id = newId;

    this.hp = WombHealth.FULL_VITALITY;

    const id = this.id;

    this.developmentRatio = gMinDevelopmentState;
    // Just trying to get an arbitrarily small number
    this.height = id / Math.pow(10, 9);
    this.weight = id / Math.pow(10, 9);
    this.amnioticFluidVolume = id / Math.pow(10, 9);
    this.dateOfConception = variables().gameDateAndTime;

    //
    if (classProp != null) {
      Object.keys(classProp).forEach((prop) => {
        //@ts-expect-error
        this[prop] = clone(classProp[prop]);
      }, this);
    }
  }

  clone() {
    //@ts-expect-error
    return new Fetus(this.id, this);
  }
  toJSON() {
    //@ts-expect-error
    const ownData: Fetus = {};
    Object.keys(this).forEach((prop) => {
      //@ts-expect-error
      ownData[prop] = clone(this[prop]);
    }, this);

    return Serial.createReviver(
      `new ${Fetus.name}(${this.id}, $ReviveData$)`,
      ownData
    );
  }

  get gender(): Gender {
    const id = this.id;
    // There are
    if (id < 0.05 * (gNumOfPossibleFetusIds - 1)) return "I";
    else if (
      id >= 0.05 * (gNumOfPossibleFetusIds - 1) &&
      id < 0.5 * (gNumOfPossibleFetusIds - 1)
    )
      return "F";
    else return "M";
  }

  get growthRate() {
    const growthRateValues = Fetus.#growthRateValues;
    return growthRateValues[this.id % growthRateValues.length];
  }

  getPregnancyLengthModifier(womb: Womb) {
    // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
    let modifier = 1;

    // Account for the fetus's growth rate
    modifier /= this.growthRate;

    //  Account for the womb health. Lower hp make pregnancies slightly longer
    modifier *= Math.clamp(Math.sqrt(womb.maxHp / womb.hp), 1, 1.2);

    // x10 faster pregnancies for the player since the player's own is 10
    modifier /= womb.naturalGrowthMod;

    return modifier;
  }

  getTotalGestationDuration(womb: Womb) {
    return this.getPregnancyLengthModifier(womb) * gDefaultPregnancyLength;
  }

  get gestationalWeek() {
    return Math.floor(
      (this.developmentRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks
    );
  }

  static #getStatForGestationalWeekInOverduePregnancy = (
    overdueGestWeek: number,
    stat: FetalGrowthStatsEnum
  ) => {
    // Use the average stat difference (and a bit of variation) to get a result for overdue pregnancies that don't have an entry in gFetalGrowthOverGestationalWeeks[]

    let averageStatDiffInLastFourWeeksOfPregnancy = 0;
    let overdueStatDiffToAdd = 0;
    const numOfWeeksToGetAverageFor = 4;

    if (overdueGestWeek <= GestationalWeek.MAX)
      overdueGestWeek = GestationalWeek.MAX + 1;

    // Get the average stat gain over the last 4~5 weeks
    for (let i = 0; i <= numOfWeeksToGetAverageFor; i++) {
      const gestationalWeekArrayIndex: GestationalWeek =
        GestationalWeek.MAX - i;
      const precedingGestationalWeekArrayIndex: GestationalWeek =
        GestationalWeek.MAX - (i + 1);

      averageStatDiffInLastFourWeeksOfPregnancy +=
        gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex][stat] -
        gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex][
          stat
        ];
    }
    averageStatDiffInLastFourWeeksOfPregnancy /= numOfWeeksToGetAverageFor;

    // Reduce it by around 66% since growth now would be much slower. This deduction is just to make things more believable
    averageStatDiffInLastFourWeeksOfPregnancy *= gOverdueStatMultiplier;

    // Multiply the average with the extra weeks that have passed while overdue
    overdueStatDiffToAdd =
      averageStatDiffInLastFourWeeksOfPregnancy *
      (overdueGestWeek - GestationalWeek.MAX);

    // Add some variation
    overdueStatDiffToAdd = random(
      overdueStatDiffToAdd - overdueStatDiffToAdd * 0.15,
      overdueStatDiffToAdd + overdueStatDiffToAdd * 0.15
    );

    return (
      gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX][stat] +
      overdueStatDiffToAdd
    );
  };

  get wombVolumeFromFetusStats() {
    // Make sure that, using the stats of a full term fetus, the result is close to 10000ml~11000ml. Preferably the former
    return (
      (this.weight + this.height + this.amnioticFluidVolume * 0.4) * (10 / 4)
    );
  }

  static getAccurateFetalStatForDevelopmentStage(
    stat: FetalGrowthStatsEnum,
    devRatio: DevelopmentRatio
  ) {
    let fetalStat = 0;

    const gestationalWeek: GestationalWeek =
      (devRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks;

    const gestationalWeekFloor: GestationalWeek = Math.floor(gestationalWeek);

    // Need a better name for this
    const extraDurationAsFloat = gestationalWeek - gestationalWeekFloor;

    if (gestationalWeek < GestationalWeek.One) {
      return 0;
    } else if (
      gestationalWeek < gNumOfGestationalWeeks &&
      gestationalWeek + 1 < gNumOfGestationalWeeks
    ) {
      const gestationalWeekStat =
        gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][stat];
      fetalStat =
        gestationalWeekStat +
        (gFetalGrowthOverGestationalWeeks[
          (gestationalWeekFloor + 1) as GestationalWeek
        ][stat] -
          gestationalWeekStat) *
          extraDurationAsFloat;
    } else if (
      gestationalWeek <= gNumOfGestationalWeeks &&
      gestationalWeek + 1 > gNumOfGestationalWeeks
    ) {
      const gestationalWeekStat =
        gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][stat];
      fetalStat =
        gestationalWeekStat +
        (this.#getStatForGestationalWeekInOverduePregnancy(
          gestationalWeekFloor + 1,
          stat
        ) -
          gestationalWeekStat) *
          extraDurationAsFloat;
    } else if (gestationalWeek > gNumOfGestationalWeeks) {
      const gestationalWeekStat =
        this.#getStatForGestationalWeekInOverduePregnancy(
          gestationalWeekFloor,
          stat
        );
      fetalStat =
        gestationalWeekStat +
        (this.#getStatForGestationalWeekInOverduePregnancy(
          gestationalWeekFloor + 1,
          stat
        ) -
          gestationalWeekStat) *
          extraDurationAsFloat;
    }
    console.log(
      `devRatio: ${devRatio}, gestationalWeek: ${gestationalWeekFloor}, fetalStat: ${fetalStat}`
    );

    return fetalStat;
  }

  // Give it 2 development ratios (with the 2nd one always being larger) and the required stat, and then it'll return how much of that particular stat should be increased
  // NOTE - What this function basically does is (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) which will usually give non-integer values. When Math.floor()'d, it gives up the most recent gestational week and we can pick a stat from there (call this value X). However, in order to be truly accurate, we also consider the truncated non-integer component of (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) by having the truncated value be subtracted from the regular result of that expression (e.g 7.8673029 - 7) and multiply this result with the difference of the required stats for the gestational week in use and the next one (e.g gestational week 7 and gestational week 8. Also call this value Y). Now, adding X and Y should give something quite accurate, so do this for both development ratios and return the difference between their values.
  static getStatToAddAfterDevelopmentProgress(
    oldDevRatio: DevelopmentRatio,
    newDevRatio: DevelopmentRatio,
    stat: FetalGrowthStatsEnum
  ) {
    if (oldDevRatio == newDevRatio) return 0;
    let oldStat = 0;
    let newStat = 0;

    oldStat = this.getAccurateFetalStatForDevelopmentStage(stat, oldDevRatio);
    newStat = this.getAccurateFetalStatForDevelopmentStage(stat, newDevRatio);

    return newStat - oldStat;
  }
}
// @ts-expect-error
window[Fetus.name] = Fetus;
