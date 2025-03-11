import type { NumberKeys } from "../../declarations/types";
import {
  FetalGrowthStatsEnum,
  GestationalWeek,
  WombHealth,
} from "../declarations/enums";
import type {
  PregSideEffectsObject,
  PregSideEffectDynamicData,
} from "../declarations/types";
import {
  gMaxDevelopmentState,
  gAllPregPerks,
  gGestatorPerkMaxSpeedBoost,
  gImmunityPerkMaxBoostPerFetus,
  gPolyhydramniosPerkMaxFluidProductionBoost,
  gMinimumVolumeOfAmnioticFluid,
  gMinNormalBirthThreshold,
  gPreemieBirthThreshold,
  gVeryPreemieBirthThreshold,
} from "../declarations/variables";
import { Fetus } from "./fetus";
import { Womb } from "./womb";

type FetusProps = Exclude<NumberKeys<Fetus>, undefined | "id" | "species">;
/**
 * A Pregnancy is simply a collection of fetuses conceived at the same time and allows be to apply effects equally to related fetuses.
 */
export class Pregnancy {
  id!: number;
  fetuses: Map<number /* fetusId */, Fetus> = new Map();
  dateConceived = variables().gameDateAndTime;
  /**
   * Tells the last time the pregnancy progress was calculated.
   */
  lastPregUpdate = this.dateConceived;

  // static readonly #numOfPossibleFetusIds = 256

  constructor(womb: Womb, numOfFetuses: number);
  constructor(classData: typeof Pregnancy);
  constructor(classDataOrWomb: Womb | typeof Pregnancy, numOfFetuses = 1) {
    if (classDataOrWomb instanceof Womb) {
      for (let i = 0; i < numOfFetuses; i++) {
        this.fetuses.set(this.size, this.#generateFetus(classDataOrWomb));
      }

      // Connect this pregnancy to the womb
      const wombPregnancies = classDataOrWomb.pregnancies;
      const pregId = Pregnancy.#generateId(wombPregnancies);
      this.id = pregId;
      wombPregnancies.set(pregId, this);
    } else {
      Object.keys(classDataOrWomb).forEach((prop) => {
        //@ts-ignore
        this[prop] = clone(classDataOrWomb[prop]);
      }, this);
    }
  }

  get size() {
    return this.fetuses.size;
  }

  /**
   * A simple way of getting a unique id instead of just using the map's size
   */
  static #generateId(
    map: typeof Womb.prototype.pregnancies | typeof this.prototype.fetuses
  ) {
    // Convert the map to an array and get it's last element, if any
    const arr = [...map.values()] as (Fetus | Pregnancy | undefined)[];
    const lastElement = arr[arr.length - 1];

    return lastElement ? lastElement.id + 1 : 0;
  }

  /**
   * Gets the sum of all stats of a specific fetus.
   *
   * Please be reasonable while using this
   */
  #combinedStat(prop: FetusProps) {
    let sum = 0;

    this.fetuses.forEach((fetus) => (sum += fetus[prop]));

    return sum;
  }

  #averageStat(prop: FetusProps) {
    const size = this.size;
    if (!size) return 0;

    return this.#combinedStat(prop) / size;
  }

  /**
   * Average development percentage of all fetuses in this pregnancy.
   */
  get devRatio() {
    return this.#averageStat("developmentRatio");
  }

  /**
   * Average development percentage of all fetuses in this pregnancy. Note that this represents the development level before any updates from the pregnancy's growth
   */
  get lastDevRatio() {
    return this.#averageStat("devRatioAtLastUpdate");
  }

  /**
   * Total volume (in ml) that the fetuses take up
   */
  get volume() {
    return this.#combinedStat("wombVolumeFromFetusStats");
  }

  /**
   * Average gestation duration for all fetuses
   */
  gestDuration(womb: Womb) {
    let combinedGestationDuration = 0;
    this.fetuses.forEach((fetus) => {
      combinedGestationDuration += fetus.getTotalGestationDuration(womb);
    });
    return combinedGestationDuration / this.size;
  }

  #generateFetus(womb?: Womb) {
    const fetus = new Fetus(Pregnancy.#generateId(this.fetuses));

    // TODO: Use the womb to set specific stuff

    return fetus;
  }

  // get #generateUnusedFetusId() {
  //     // Check all fetuses in the womb (if any) and generate a random 16-bit number that isn't shared with any other existing fetus
  //     let newFetusId = random(0, Pregnancy.#numOfPossibleFetusIds - 1);

  //     this.fetuses.forEach((fetus) => {
  //       const existingFetusId = fetus.id;

  //       if (newFetusId == existingFetusId) {
  //         // Restart the function
  //         this.#generateUnusedFetusId;
  //       }
  //     });

  //     return newFetusId;
  // }

  // addFetus(fetus: Fetus, index?: number) {
  //   if (index == null) index = this.fetuses.size;

  //   this.fetuses.set(index, fetus);
  // }
  // // If `fetus` is given, find a matching copy with the same id, else if an `index` is given instead, use it. If none are given, default to the first fetus
  // removeFetus(fetus?: Fetus, index?: number | undefined) {
  //   if (fetus) {
  //     index = [...this.fetuses.values()].find((data) => {
  //       return data.id == fetus.id;
  //     })?.id;
  //   }

  //   if (index == undefined) index = [...this.fetuses.keys()][0]; // Use the first fetus if no fetus data is explicitly given

  //   if (index == undefined) return false;

  //   this.fetuses.delete(index);
  //   return true;
  // }

  totalStats(stat: FetalGrowthStatsEnum) {
    return this.#combinedStat(stat);
  }

  // SECTION - Pregnancy update code
  /**
   * This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
   *
   * REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidVolume by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
   *
   * TODO - Add side effects to womb Health
   *
   * @param womb
   * @param elapsedTime - in seconds
   * @param inputUser
   * @returns
   */
  updateGrowth(
    womb: Womb,
    elapsedTime = (variables().gameDateAndTime.getTime() -
      this.lastPregUpdate.getTime()) /
      1000,
    inputUser = variables().player
  ) {
    // NOTE - `customTime` must be in seconds.

    const currentTime = variables().gameDateAndTime;
    // const pregUpdateTimeBeforeGettingAffectedByThisFunction =
    //   this.lastPregUpdate != null ? this.lastPregUpdate : this.dateConceived;

    this.fetuses.forEach((targetFetus) => {
      // Determine how much to progress the fetus since the last update
      // Also get useful data

      // Get the total gestation time for the fetus
      const gestationPeriod = targetFetus.getTotalGestationDuration(womb);

      // If, for some reason, time moves backwards, just exit the function (for now at least)
      // TODO - Add a way to reverse growth. I feel like letting it receive negative values would be exactly what I need but eh, feels like something else would break and I'm not in the mood for it yet.
      if (elapsedTime < 0) return;

      // Reduce the duration of sideEffects
      for (const key in womb.sideEffects) {
        if (Object.prototype.hasOwnProperty.call(womb.sideEffects, key)) {
          const data =
            womb.sideEffects[
              key as keyof PregSideEffectsObject<PregSideEffectDynamicData>
            ];

          if (data) data.currDuration -= elapsedTime;
        }
      }

      // SECTION - Determine how much to increase the `developmentRatio` of the fetus
      let additionalDevelopmentProgress =
        (elapsedTime / gestationPeriod) * gMaxDevelopmentState; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage/ratio

      // SECTION - Apply the effects of relevant perks during pregnancy

      // ANCHOR - GESTATOR PERK
      const perks = womb.perks || {};
      const gestatorPerk = perks.gestator;
      // Apply the gestator perk boost, if any
      let gestatorPerkSpeedBoost =
        perks && gestatorPerk
          ? (gestatorPerk.currLevel / gAllPregPerks.gestator.maxLevel) *
            gGestatorPerkMaxSpeedBoost
          : 0;

      additionalDevelopmentProgress +=
        additionalDevelopmentProgress * gestatorPerkSpeedBoost;

      // ANCHOR - IMMUNITY PERK
      const immunityPerk = perks.immunityBoost;
      inputUser.immunity +=
        perks && immunityPerk
          ? (immunityPerk.currLevel / gAllPregPerks.immunityBoost.maxLevel) *
            gImmunityPerkMaxBoostPerFetus *
            additionalDevelopmentProgress
          : 0;
      // !SECTION

      // Add the additional progress into the fetus's data and make sure it doesn't exceed the limit. It can go beyond 100, and that means the fetus is overdue
      const newDevelopmentRatio =
        targetFetus.developmentRatio + additionalDevelopmentProgress;
      // Save the current development ratio for use later
      const oldDevelopmentRatio = targetFetus.developmentRatio;

      // Update the data
      targetFetus.developmentRatio =
        targetFetus.developmentRatio < newDevelopmentRatio
          ? newDevelopmentRatio
          : targetFetus.developmentRatio;
      // !SECTION

      // SECTION - Determine the newHeight, newWeight, and newFluidVolume (and also the belly size) using newDevelopmentRatio
      // TODO - Add drugs, eating habits and conditions that can also affect these.

      // Get the new gestation week after having the developmentRatio updated
      let newFetalGestationalWeek = targetFetus.gestationalWeek;
      if (!newFetalGestationalWeek)
        newFetalGestationalWeek = GestationalWeek.One;

      let newWeight = targetFetus.weight;
      let newHeight = targetFetus.height;
      let newFluidVolume = targetFetus.amnioticFluidVolume;

      let weightDiff: number = 0;
      let heightDiff: number = 0;
      let fluidDiff: number = 0;

      // I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id. This should allow for variation while still having similar values

      // To remove repetition
      const getStatDiff = (stat: FetalGrowthStatsEnum) => {
        return Fetus.getStatToAddAfterDevelopmentProgress(
          oldDevelopmentRatio,
          newDevelopmentRatio,
          stat
        );
      };

      weightDiff = getStatDiff(FetalGrowthStatsEnum.WEIGHT);
      heightDiff = getStatDiff(FetalGrowthStatsEnum.HEIGHT);
      fluidDiff = getStatDiff(FetalGrowthStatsEnum.AMNIOTIC_FLUID);

      // check for the polyhydramnios condition
      if (perks && perks.polyhydramnios) {
        fluidDiff +=
          (perks.polyhydramnios.currLevel /
            gAllPregPerks.polyhydramnios.maxLevel) *
          gPolyhydramniosPerkMaxFluidProductionBoost *
          fluidDiff;
      }

      console.log(
        `oldDevelopmentRatio: ${oldDevelopmentRatio}, newDevelopmentRatio: ${newDevelopmentRatio}`
      );
      console.log(
        `weightDiff: ${weightDiff}, heightDiff: ${heightDiff}, fluidDiff: ${fluidDiff}`
      );

      // SECTION - Using the fetus's id to alter the gained a bit
      const bitCheck = (targetFetus.id & (1 << random(0, 16))) !== 0; // Randomly pick the index of a bit and check if it's true
      const bitCheck2 = (targetFetus.id & (1 << random(0, 16))) !== 0; // Do it again :3
      const bitCheck3 = (targetFetus.id & (1 << random(0, 16))) !== 0; // And again :D
      // !SECTION

      // WEIGHT
      const weightBonusOrReduction = randomFloat(
        weightDiff * 0,
        weightDiff * (Math.abs(Math.sin(targetFetus.id)) / 5)
      );

      // HEIGHT
      const heightBonusOrReduction = randomFloat(
        heightDiff * 0.0,
        heightDiff * (Math.abs(Math.sin(targetFetus.id)) / 5)
      );

      // FLUID.
      const fluidBonus = randomFloat(
        fluidDiff * 0.0,
        fluidDiff * (Math.abs(Math.sin(targetFetus.id)) / 5)
      );

      // Add the regular diffs before the bonus/reductions
      newWeight += weightDiff;
      newHeight += heightDiff;
      // TODO - Make this amount fluctuate depending on the amount of fetuses in the womb
      newFluidVolume += fluidDiff;

      if (bitCheck) newWeight += weightBonusOrReduction;
      else newWeight -= weightBonusOrReduction;

      if (bitCheck2) newHeight += heightBonusOrReduction;
      else newHeight -= heightBonusOrReduction;

      // For fluid, there will be no deductions, only additions/no change
      if (bitCheck3) newFluidVolume += fluidBonus;
      // !SECTION

      // SECTION - Update relevant values abt the fetus. Make sure that the values don't reduce
      targetFetus.weight =
        targetFetus.weight < newWeight ? newWeight : targetFetus.weight;
      targetFetus.height =
        targetFetus.height < newHeight ? newHeight : targetFetus.height;
      // Amniotic fluid volume is the only one (out of the 3) that can reduce
      if (newFetalGestationalWeek > GestationalWeek.MAX) {
        // Amniotic volume begins to reduce close to the end of the gestational weeks so clamp it somewhere to prevent "absurd" values
        targetFetus.amnioticFluidVolume =
          newFluidVolume < gMinimumVolumeOfAmnioticFluid
            ? gMinimumVolumeOfAmnioticFluid
            : newFluidVolume;
      } else {
        targetFetus.amnioticFluidVolume = newFluidVolume;
      }
      this.lastPregUpdate = currentTime;

      // Adjust fetal hp
      targetFetus.hp = (womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY;

      // Consume some of the user's fullness
      // REVIEW -  Every 2% of `additionalDevelopmentProgress` consumes 1 fullness point.
      //        - Every 2kg of fetal weight consumes 1 fullness point.
      //        - However, `additionalDevelopmentProgress` must be above 0 for any calculation to occur. So spamming this function wouldn't lead to unintended issues.
      let fullnessToConsume =
        (additionalDevelopmentProgress * (targetFetus.weight / 1000)) / 2;
      fullnessToConsume += fullnessToConsume * (gestatorPerkSpeedBoost * 0.3);
      inputUser.fullness -= fullnessToConsume;

      // Replace the data of the fetus with the updated one
      this.fetuses.set(targetFetus.id, targetFetus);
    });

    // Apply womb damage
    womb.addHp(womb.calculateHealthDamage());

    // Increase the womb's exp
    womb.exp += womb.updateExpValue();

    // Update belly size during pregnancy
    womb.updateBellySize();

    // Update the dev ratio record for all fetuses
    this.fetuses.forEach((fetus) => {
      fetus.devRatioAtLastUpdate = fetus.developmentRatio; // Update it
    });

    return true;
  }
  // !SECTION

  /**
   * I could probably use the current time in milliseconds / seconds and the day and / or maybe their id. Instead of relying on random values.
   */
  get canBirth() {
    if (this.isOverdue) return true;

    const devRatio = this.devRatio;
    const sanitizedId = this.id || 1;
    const chance =
      ((((variables().gameDateAndTime.getTime() / 1000) * sanitizedId) %
        devRatio) /
        devRatio) *
      100;

    return devRatio >= gMaxDevelopmentState
      ? true
      : devRatio >= gMinNormalBirthThreshold && chance % 100 <= 25
      ? true
      : devRatio >= gPreemieBirthThreshold && chance % 100 <= 10
      ? true
      : devRatio >= gVeryPreemieBirthThreshold && chance % 100 <= 10;
  }

  get isOverdue() {
    return this.devRatio > gMaxDevelopmentState;
  }
}
