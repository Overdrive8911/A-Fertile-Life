namespace NSPregnancy {
  /* Womb, Pregnancy and Birth */
  /* A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions */
  /* A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has */
  /* The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has */
  /* Capacity is in cubic centimetres(CCs) */
  export class Womb {
    hp =
      gDefaultMaxWombHP; /* Unhealthy wombs gestate slower. It slowly reduces with time while pregnant but will only get critically low if the user doesn't take care of themselves. Going beyond womb.comfortCapacity, and to a much higher extent with womb.maxCapacity, consumes more hp. The PC's womb will give out at 0hp. Heals overnight while sleeping, with drugs, womb treatments, or eating */
    maxHp = gDefaultMaxWombHP;

    fertility = either(
      FertilityLevel.POOR_FERTILITY,
      FertilityLevel.AVERAGE_FERTILITY,
      FertilityLevel.HIGH_FERTILITY
    );

    // TODO - Rename this 'capacity' stuff to 'size'
    curCapacity =
      BellyState.FLAT; /* Determines the size of her pregnancy, going too far beyond womb.maxCapacity can cause the babies to be 'skin-wrapped' */
    comfortCapacity =
      BellyState.FULL_TERM; /* How big she can get without losing any comfort. Slowly increases as womb.exp increases */
    maxCapacity =
      BellyState.FULL_TERM +
      BellyState.LATE_PREGNANCY; /* How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks */

    exp = 0; /* Increases when pregnant; the amount depends on size and number of fetuses, womb.curCapacity, womb.comfortCapacity and womb.maxCapacity. Increases faster once womb.curCapacity nears womb.comfortCapacity and even faster when it goes beyond it; basically the ratio of womb.curCapacity/womb.comfortCapacity (and womb.curCapacity/womb.maxCapacity when the former is high enough) decides how fast exp increases. Once it surpasses the limit for womb.lvl, levels up her womb. Some types of food, drugs, treatments and perks increase its rate of gain. Slowly decreases when not pregnant.
      
      Higher levels have higher capacities, the ability to use stronger and higher level perks, and a lower rate of hp loss. Exp levels can be found in the enum `WombExpLimit` */

    postpartum = 0; /* 0 -> Can get pregnant, >= 1 -> Postpartum. This variable is set to 7 (can be influenced by some perks) once the PC gives birth to all her children */
    onContraceptives = false;
    birthRecord = 0; /* Number of times the user has given birth */

    lastFertilized: Date =
      null; /* The date when the womb was last impregnated */
    lastBirth: Date = null; /* The date of the last birth */
    lastPregUpdate: Date = null; // Tells the last time the pregnancy progress was calculated. Is the same as `date of conception` upon impregnation
    // lastExpUpdate: Date =
    //   null; /* The last time the exp update function was ran on this womb*/ // REVIEW - Check whether its possible to use `lastPregUpdate` of the fetus. In fact, see if that variable can be moved to the womb instead

    // belongToPlayer: boolean;
    naturalGrowthMod = 1; // A multiplier that affects the growth rate of the fetuses, the player's own is x10

    perks: PregPerksObject = {};
    sideEffects: PregSideEffectsObject = {};
    fetuses: Map<number /* fetusId */, Fetus> = new Map();

    constructor(classProperties: Womb = null) {
      if (classProperties != null) {
        Object.keys(classProperties).forEach((prop) => {
          //@ts-expect-error
          this[prop] = clone(classProperties[prop]);
        }, this);
      }
    }

    clone() {
      return new (this.constructor as typeof Womb)(this);
    }
    toJSON() {
      const ownData: unknown = {};
      Object.keys(this).forEach((prop) => {
        //@ts-expect-error
        ownData[prop] = clone(this[prop]);
      }, this);

      return JSON.reviveWrapper(
        `new ${(this.constructor as typeof Womb).name}($ReviveData$)`,
        ownData
      );
    }

    get isPregnant() {
      // There is at least one fetus
      if (this.fetuses.size > 0) return true;
      else return false;
    }

    // get fetuses() {
    //   return this.fetuses;
    // }

    get generateUnusedFetusId() {
      // Check all fetuses in the womb (if any) and generate a random 16-bit number that isn't shared with any other existing fetus
      let newFetusId = random(0, gNumOfPossibleFetusIds - 1);

      const fetusData = this.fetuses;
      for (let i = 0; i < fetusData.size; i++) {
        const existingFetusId = fetusData.get(i).id;

        if (newFetusId == existingFetusId) {
          // Restart the function
          this.generateUnusedFetusId;
          break;
        }
      }

      return newFetusId;
    }

    // Just a check to see if pregnancy can be started
    #tryToImpregnate(
      virility: number,
      fertility: number,
      areContraceptivesActive: boolean,
      virilityBonus: number | undefined,
      fertilityBonus: number | undefined
    ): boolean {
      // Both parameters have a range of 0 - 100 in most cases. Even when both sides have a 100, conception might still fail, although with a very minute chance. If for some reason, either value is above 100, conception is guaranteed (the PC can get a fertility above 100)

      // The respective bonuses are capped at 30 each and reduced to 30~50% of their original value , before being added to 'pregChance'

      // Having a virility or fertility above 100 makes one basically a fertility idol and guarantees pregnancies
      if (virility > 100 || fertility > 100) return true;

      // Contraceptives greatly reduce the chance for pregnancy by 90%
      if (areContraceptivesActive && random(0, 100) < 10) return false;

      // Virility has more a bit more importance than fertility
      let virileChance = randomFloat(0.85, 1.1);
      let fertileChance = randomFloat(0.8, 1.05);

      let pregChance =
        virility * virileChance +
        fertility * fertileChance -
        (virility * virileChance - fertility * fertileChance) * 0.1;

      // This would me mostly out of the player's control
      if (virilityBonus) {
        if (virilityBonus > 30) {
          virilityBonus = 30;
        }
        pregChance += virilityBonus * (random(30, 50) / 100);
      }
      if (fertilityBonus) {
        if (fertilityBonus > 30) {
          fertilityBonus = 30;
        }
        pregChance += fertilityBonus * (random(30, 50) / 100);
      }

      pregChance /= 200;

      if (randomFloat(0, 1) < pregChance) return true;
      else return false;
    }

    // ANCHOR - Call this to create a pregnancy
    tryCreatePregnancy(
      virility: number,
      virilityBonus: number | undefined,
      numOfFetusesToForceToSpawn?: number
    ) {
      if (!virilityBonus) virilityBonus = 0;
      let fertilityBonus = 0;
      // TODO - calculate all the fertility bonuses from the womb
      // const isPregnancySuccessful =

      // Only allow if the impregnation chance comes up true and the womb health is >= 80 OR if a designated number of fetuses to spawn has been given.
      if (
        (this.#tryToImpregnate(
          virility,
          this.fertility,
          this.onContraceptives,
          virilityBonus,
          fertilityBonus
        ) &&
          (this.hp / this.maxHp) * WombHealth.FULL_VITALITY >
            WombHealth.HEALTHY) ||
        numOfFetusesToForceToSpawn
      ) {
        let i = 0,
          j = 0;

        // TODO - Deal with the sperm stuff later
        // NOTE - The bonuses should be capped at 30 somewhere. They can be obtained from drugs, conditions, randomly, etc
        // Assume `virility` = 70, and `virilityBonus` = 30. A but on the high side but eh
        let totalVirility = virility + virilityBonus * 0.5;
        let totalFertility = this.fertility + fertilityBonus;

        // SECTION - Decide how many offspring to create
        let numOfFoetusToSpawn = 1;

        // The chance of more than 1 sperm fertilizing an egg. It's not really much :p
        while (i < gChanceOfNaturalMultipleOvaFertilization.length) {
          // Use the virility bonus to boost the chance a bit, like by ~0.3...
          let chance =
            gChanceOfNaturalMultipleOvaFertilization[i] +
            (totalVirility * 0.1) / virility +
            (virility * 0.25) / 100;
          console.log(`virile chance: ${chance}`);

          if (parseFloat(randomFloat(1).toFixed(2)) < chance) {
            numOfFoetusToSpawn++;
          } else {
            // Once it fails, quit making more fetuses
            break;
          }
          i++;
        }

        // The ova splitting part
        while (j < gChanceOfNaturalOvaSplit.length) {
          let chance =
            gChanceOfNaturalOvaSplit[i] +
            (totalFertility * 0.1) / this.fertility +
            (this.fertility * 0.1) / 100 +
            (fertilityBonus * 0.75) / 100; // 0.455 is the extra bonus gotten with 100 fertility and 30 fertilityBonus

          // TODO - Add drugs that directly increase the chance for multiples, separate from the fertilityBonus stat. Also, these calculations need extra tweaking

          // The player has the hyper fertility perk
          const perks = this.perks;
          if (perks && perks.hyperFertility) {
            // Give a large multiplier to the chance for multiples.
            chance *= 1.55;

            // Gently add a flat increase it with every extra level
            let k = 1;
            while (k < perks.hyperFertility.currLevel) {
              chance += 0.055;
              k++;
            }
          }
          if (this.isPregnant) {
            if (perks && perks.superFet) {
              // Applies to superfetation, lets make it difficult >:D
              chance *= 0.1;
            } else {
              // No chance to make more babies :p
              chance = 0;
              numOfFoetusToSpawn = 0;
            }
          }

          console.log(`fertile chance: ${chance}`);
          // This is on the woman's side so superfet genes affect this chance
          if (parseFloat(randomFloat(1).toFixed(2)) < chance) {
            // If the probability passes, add another fetus
            numOfFoetusToSpawn++;
          } else {
            // Once it fails, quit making more fetuses
            break;
          }

          j++;
        }

        // If this parameter is given, override the regular number of fetuses to spawn
        if (numOfFetusesToForceToSpawn && numOfFetusesToForceToSpawn != 0)
          numOfFoetusToSpawn = numOfFetusesToForceToSpawn;

        // NOTE - For now, the max amount of offspring is limited to the max capacity of the womb so
        const maxFetusNumber = this.getMinimumNumOfFullTermFetusesAtBellyState(
          this.maxCapacity
        );
        if (numOfFoetusToSpawn > maxFetusNumber)
          numOfFoetusToSpawn = maxFetusNumber;
        // !SECTION

        // SECTION - Create the babies and push them into the womb. Not much data about them is needed since the player can't keep them anyway
        for (i = 0; i < numOfFoetusToSpawn; i++) {
          // NOTE - the ID is used to generate these stuff. I may add another random chance if I'm feeling like but for now, having the same ID will create the same stats
          const id = this.generateUnusedFetusId;
          this.addFetus(new Fetus(id), id);
        }
        // !SECTION

        // Update specific data for the womb
        this.lastFertilized = variables().gameDateAndTime;
        return true;
      } else {
        return false;
      }
    }

    addFetus(fetus: Fetus, index: number = null) {
      if (index == null) index = this.fetuses.size;

      this.fetuses.set(index, fetus);
    }
    // If `fetus` is given, find a matching copy with the same id, else if an `index` is given instead, use it. If none are given, default to the first fetus
    removeFetus(fetus?: Fetus, index?: number) {
      if (fetus) {
        index = [...this.fetuses.values()].find((data) => {
          return data.id == fetus.id;
        }).id;
      }

      if (index == undefined) index = [...this.fetuses.keys()][0]; // Use the first fetus if no fetus data is explicitly given

      if (index == undefined) return false;

      this.fetuses.delete(index);
      return true;
    }

    totalOfFetalStats(stat: FetalGrowthStatsEnum) {
      let sumOfFetalStats = 0;

      for (let i = 0; i < this.fetuses.size; i++) {
        sumOfFetalStats += this.fetuses.get(i)[stat];
      }

      return sumOfFetalStats;
    }

    // Accepts any value from the enum BellyState but will only work with members that have `FULL_TERM` appended. Returns the minimum number of full grown, non-overdue fetuses that can achieve the inputted size
    getMinimumNumOfFullTermFetusesAtBellyState(bellyState: BellyState) {
      if (bellyState < BellyState.FULL_TERM) return 0;

      return Math.floor(bellyState / BellyState.FULL_TERM);
    }

    calculateWombDamage() {
      const womb = this as Womb;
      if (!gIsWombDamageEnabled) return 0;
      // Don't allow negative values
      if ((womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY < WombHealth.RIP) {
        womb.hp = WombHealth.RIP;
        return 0;
      }
      // TODO - Consider having the weight affect this. Also superfetation

      // Get the average developmentRatio of all fetuses
      let averageDevelopmentRatio = 0;
      for (let i = 0; i < womb.fetuses.size; i++) {
        averageDevelopmentRatio += womb.fetuses.get(i).developmentRatio;
      }
      averageDevelopmentRatio /= womb.fetuses.size;

      // Every 10% progress in pregnancy has a 15% chance to subtract 0.5 womb health. This number is increased by the number of fetuses the user is pregnant with
      let timesToRunDamageCheck = Math.floor(averageDevelopmentRatio / 10);

      let wombDamage = 0;
      while (timesToRunDamageCheck > 0) {
        if (random(100) < 15) {
          wombDamage += womb.fetuses.size * 0.5;
        }
        timesToRunDamageCheck--;
      }

      return wombDamage;
    }

    // Every gHoursBetweenPregUpdate, the womb will heal by this much depending on how much hp it already had
    gradualWombHealthIncreaser() {
      const womb = this as Womb;
      // Don't allow too large values
      if (womb.hp > womb.maxHp) {
        womb.hp = womb.maxHp;
        return 0;
      }

      const hpRatio = (womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY;
      if (hpRatio >= WombHealth.VERY_HEALTHY) {
        return 5;
      } else if (
        hpRatio > WombHealth.VERY_HEALTHY &&
        hpRatio >= WombHealth.HEALTHY
      ) {
        return 4;
      } else if (
        hpRatio > WombHealth.HEALTHY &&
        hpRatio >= WombHealth.MEDIOCRE
      ) {
        return 3;
      } else if (hpRatio > WombHealth.MEDIOCRE && hpRatio >= WombHealth.POOR) {
        return 2;
      } else if (hpRatio > WombHealth.POOR && hpRatio >= WombHealth.VERY_POOR) {
        return 1;
      }

      return 0.5;
    }

    updatePregnantBellySize() {
      let combinedWombVolume = 0;
      this.fetuses.forEach((fetus) => {
        combinedWombVolume += fetus.wombVolumeFromFetusStats;
      });
      this.curCapacity = combinedWombVolume;
    }

    // SECTION - Exp update code

    /* How should the womb exp system work?
    - The awarded exp increases depending on the fetal development and number
    - Exp is only awarded every gHoursBetweenPregUpdate as long as the PC is expecting
    - A huge chunk of the exp (40%) is awarded at birth depending on the size and number of fetuses (i think this implies that the exp gained during pregnancy would be relatively small)
    - updateWombExp shouldn't grant more exp if it was called more often
    - On average, it'd take (2*LVL + Math.floor(LVL/2)) full term singleton pregnancies to gain enough exp to reach the next level (i.e 2 from LVL_1 to LVL_2, 5 from LVL_2 to LVL_3, 7 from LVL_3 to LVL_4, 10 from LVL_4 to LVL_5)
    - Each singleton full-term, non-overdue pregnancy gives about a 1000exp without bonuses
    */

    // TODO - Remember to add exp in the birth function
    updateWombExp() {
      let expToAdd = 0;
      const wombLvl = this.wombLvl;

      if (wombLvl == gMaxWombLevel) {
        // At max lvl, return no exp
        return 0;
      }

      // 1000 exp = 1 single pregnancy and 400 exp = birth
      // 600 exp = 10 gestational months or gDefaultPregnancyLength/gActualPregnancyLength
      // if 600/10 exp = 10/10 gest. months then
      // ??? exp = 600 * (gHoursBetweenPregUpdate * 3600)/gActualPregnancyLength
      // We're only getting a max of 92.05% >~<

      // SECTION - Actual exp stuff
      this.fetuses.forEach((fetus) => {
        // Calculate the exp for each fetus separately. Each fetus can produce up to 1000 exp in total at term (with 40% only give on birth so its actually 600 exp). Going overdue will add an extra 20% to the regular exp gain the fetus will provide
        // TODO - Make it so that exp starts off really small (x0.1), at a "normal" rate halfway through (x1), and then is much more abundant(x10) with greater development
        expToAdd =
          (gExpPerSingleFetusGestation *
            ((fetus.developmentRatio - fetus.devRatioAtLastExpUpdate) /
              gMaxDevelopmentState)) |
          1;

        // Add a random chance to bump it up or down by a random percentage between 1% and 10% because :3
        const randPercentage = random(1, 10) / 100;
        expToAdd = random(1)
          ? expToAdd + expToAdd * randPercentage
          : expToAdd - expToAdd * randPercentage;

        fetus.devRatioAtLastExpUpdate = fetus.developmentRatio; // Update it
      });
      // !SECTION

      console.log(
        `womb exp limit: ${Womb.getWombExpLimit(wombLvl)}, wombLvl: ${wombLvl}`
      );

      // Just let the player keep the exp
      // // If not pregnant, reduce the exp depending on how it has been since the character was last pregnant
      // if (!isPregnant(womb)) {
      //   expToAdd = 0;
      //   let timeSinceLastPregnancy = 0; // in seconds

      //   if (womb.lastBirth.getTime())
      //     timeSinceLastPregnancy = Math.floor(
      //       (variables().gameDateAndTime.getTime() - womb.lastBirth.getTime()) /
      //         1000
      //     );

      //   const timeSinceLastPregnancyInDays = timeSinceLastPregnancy / 86400;

      //   expToAdd -= timeSinceLastPregnancyInDays * getWombExpLimit(wombLvl) * 0.01;
      // }
      console.log(`expToAdd: ${expToAdd}`);

      return expToAdd;
    }

    // Get's the lvl of the womb using its max exp limit. Returns a number between 1 and 15 inclusive
    get wombLvl() {
      const womb = this as Womb;
      // Fill up an intermediary array with all the levels in WombExpLimit, while ignoring any member with a negative value
      let wombExpLimitArray = Object.values(WombExpLimit).filter(
        (value) => typeof value == "number" && (value as number) >= 0
      ) as number[];
      console.log(WombExpLimit);

      // Remove duplicates by converting to a Set and then back to an array
      wombExpLimitArray = [...new Set(wombExpLimitArray)];

      for (let i = 1; i < wombExpLimitArray.length; i++) {
        const expLimit = wombExpLimitArray[i];
        const previousExpLimit = wombExpLimitArray[i - 1];

        if (expLimit > womb.exp && previousExpLimit <= womb.exp) return i;
        else if (womb.exp >= WombExpLimit.LVL_MAX) {
          // The user's womb is at or above the max level and the iteration has ended on the highest possible level
          return wombExpLimitArray[i];
        }
      }

      // For some reason, the lvl is unavailable
      return WombExpLimit.NOT_AVAILABLE;
    }

    // Give it the level and it'll return the appropriate exp cap
    static getWombExpLimit = (lvl: number) => {
      if (lvl < gMinWombLevel) lvl = gMinWombLevel;
      if (lvl > gMaxWombLevel) lvl = gMaxWombLevel;

      if (lvl == gMaxWombLevel) {
        return WombExpLimit.NOT_AVAILABLE;
      }

      const lvlMember = `LVL_${lvl + 1}` as any;

      // The members of WombExpLimit include LVL_1, LVL_2, LVL_3, etc
      return WombExpLimit[lvlMember] as unknown as WombExpLimit;
    };
    // !SECTION

    // SECTION - Pregnancy update code
    // This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
    // REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidVolume by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
    // TODO - Add side effects to womb health
    updatePregnancyGrowth() {
      // const targetWomb = this as Womb1
      // The target is pregnant so do everything required under here
      if (this.isPregnant) {
        const currentTime = variables().gameDateAndTime;
        const pregUpdateTimeBeforeGettingAffectedByThisFunction =
          this.lastPregUpdate != null
            ? this.lastPregUpdate
            : this.lastFertilized;

        this.fetuses.forEach((targetFetus) => {
          // Determine how much to progress the fetus since the last update
          // Also get useful data

          // Get the total gestation time for the fetus
          gActualPregnancyLength = targetFetus.getTotalGestationDuration(this);

          // Get the time elapsed in seconds since the pregnancy was updated
          const timeElapsedSinceLastPregUpdate =
            currentTime.getTime() / 1000 -
            pregUpdateTimeBeforeGettingAffectedByThisFunction.getTime() / 1000;

          // If, for some reason, time moves backwards, just exit the function (for now at least)
          // TODO - Add a way to reverse growth
          if (timeElapsedSinceLastPregUpdate < 0) return;

          // SECTION - Determine how much to increase the `developmentRatio` of the fetus
          let additionalDevelopmentProgress =
            (timeElapsedSinceLastPregUpdate / gActualPregnancyLength) *
            gMaxDevelopmentState; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage/ratio

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
          // NOTE - These values are only calculated per gestational week, and will not change for any other smaller time measurement
          // TODO - Add drugs, eating habits and conditions that can also affect these.

          // Get the new gestation week after having the developmentRatio updated
          let newFetalGestationalWeek = targetFetus.gestationalWeek;
          if (!newFetalGestationalWeek)
            newFetalGestationalWeek = GestationalWeek.One;

          let newWeight = targetFetus.weight;
          let newHeight = targetFetus.height;
          let newFluidVolume = targetFetus.amnioticFluidVolume;

          let weightDiff: number = null;
          let heightDiff: number = null;
          let fluidDiff: number = null;

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
          targetFetus.hp = (this.hp / this.maxHp) * WombHealth.FULL_VITALITY;

          // Replace the data of the fetus with the updated one
          this.fetuses.set(targetFetus.id, targetFetus);
        });

        // Apply womb damage
        this.hp -= this.calculateWombDamage();

        // Increase the womb's exp
        this.exp += this.updateWombExp();

        // Update belly size during pregnancy
        this.updatePregnantBellySize();

        // Update the last time this function was called
        variables().lastPregUpdateFunctionCall = currentTime;
      }
    }
    // !SECTION

    // SECTION - Birth methods
    triggerBirth() {
      // This is what will expunge the fetuses from the womb (except in the case for superfetation)
      const perks = this.perks;
      // TODO - It's just bare-bones now
      if (perks && perks.superFet) {
        // Deal with superfetation
      } else {
        // Handle postpartum, birth scenes, etc

        // Give exp
        let expToAdd = 0;
        this.fetuses.forEach((fetus) => {
          // Longer gestating babies take longer
          expToAdd +=
            (fetus.developmentRatio / gMaxDevelopmentState) *
            gExpPerSingleBirth;
        });
        this.exp += expToAdd;

        // Just clear out the womb
        this.fetuses.clear;
        this.lastBirth = variables().gameDateAndTime;
      }
    }

    get isLiableForBirth() {
      // This will check to see if an inputted womb is ready to giving birth, regardless of the actual chance of a successful delivery
      // NOTE - Drugs and conditions may affect this

      let chanceOfBirth = 0;

      // Include something to account for superfetation. Like a giant IF statement
      const perks = this.perks;
      if (perks && perks.superFet) {
        // Handle superfetation
      } else {
        // Regular Birth (mostly)

        // If the womb's current capacity is within 90% of the max capacity, force birth ASAP else check other conditions
        if (this.curCapacity >= this.maxCapacity * 0.9) return true;
        else {
          // Check whether if all the fetuses are in the development range for birthing. If false, prevent birth so long as the womb's max capacity has not been exceeded/near. If true, create a random choice that decides whether it's time to birth. Increase the chance as gestational weeks progress
          let sumOfDevelopmentRatio = 0;

          this.fetuses.forEach((fetus) => {
            // All fetuses must be at or above a particular threshold for birth to occur
            if (fetus.developmentRatio < gMinBirthThreshold) return false;

            //  Get the sum of the development of all fetuses. This will be used to determine the average which is what will be used to determine the chance of birth (if possible)
            sumOfDevelopmentRatio += fetus.developmentRatio;
          });

          const averageDevelopmentOfFetus =
            sumOfDevelopmentRatio / this.fetuses.size;

          // Every 1% above gMaxDevelopmentState adds a 2.5% chance for the character's water to break
          chanceOfBirth +=
            (averageDevelopmentOfFetus - gMaxDevelopmentState) * 2.5;
        }
      }

      // Unhealthy wombs are at higher risk of birthing, however, clamp the increased chance at 33%
      chanceOfBirth += Math.clamp(
        (this.maxHp / this.hp) * (this.maxHp - this.hp) * 0.75,
        0,
        33
      );

      // Using `chanceOfBirth`, check if the character should birth or not
      if (randomFloat(0, 100) <= chanceOfBirth) return true;
      else return false;
    }
    // !SECTION

    // SECTION - Perks and Side effects
    applyPerk(perk: keyof typeof this.perks) {
      const allPerks: PregPerksObject = {
        /* its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant. */
        /* Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility */
        /* Each perk is an object of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level */
        /*TODO - Change the prices later to something more reasonable. Also, add more perks */

        // TODO - Only store these if they're active
        gestator: {
          currLevel: 1,
          price: 5000,
          maxLevel: 10,
        } /* Increases the speed of pregnancies depending on how much food is consumed. At the maximum level, pregnancy duration is shortened to at most a week */,
        hyperFertility: {
          currLevel: 1,
          price: 3000,
          maxLevel: 5,
        } /* Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */,
        superFet: {
          currLevel: 1,
          price: 15000,
          maxLevel: 5,
        } /* Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */,
        elasticity: {
          currLevel: 1,
          price: 7000,
          maxLevel: 10,
        } /* Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */,
        immunityBoost: {
          currLevel: 1,
          price: 2000,
          maxLevel: 10,
        } /* Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */,
        motherlyHips: {
          currLevel: 1,
          price: 5000,
          maxLevel: 5,
        } /* Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */,
        motherlyBoobs: {
          currLevel: 1,
          price: 5000,
          maxLevel: 5,
        } /* Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */,
        ironSpine: {
          currLevel: 1,
          price: 7000,
          maxLevel: 5,
        } /* Can carry bigger pregnancies and more weight before becoming bed bound */,
        sensitiveWomb: {
          currLevel: 1,
          price: 6000,
          maxLevel: 5,
        } /* Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */,
        healthyWomb: {
          currLevel: 1,
          price: 3000,
          maxLevel: 10,
        } /* Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */,
        fortifiedWomb: {
          currLevel: 1,
          price: 10000,
          maxLevel: 5,
        } /* Reduces the increase rate of womb.comfortCapacity but raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */,
        noPostpartum: {
          currLevel: 1,
          price: 2000,
          maxLevel: 7,
        } /* Reduces the postpartum period of the PC by 1 day (Note that the PC has a recovery period of a week) */,
      };

      const selectedPerk: PregPerk | undefined = allPerks[perk];
      if (selectedPerk && !this.isPerkActive(perk)) {
        this.perks[perk] = clone(selectedPerk);
        return true;
      }
      return false;
    }
    isPerkActive(perk: keyof typeof this.perks) {
      return this.perks[perk] ? true : false;
    }
    removePerk(perk: keyof typeof this.perks) {
      if (this.isPerkActive(perk)) {
        delete this.perks[perk];
        return true;
      }
      return false;
    }

    //

    applySideEffect(sideEffect: keyof typeof this.sideEffects) {
      const allSideEffects: PregSideEffectsObject = {
        /* Most can occur anytime in a pregnancy after 20% of fetal development is achieved and usually reduce performance or do some other undesirable stuff until they leave. Upgrading some perks can cause them to become stronger. */
        /* They are objects containing 2 values; the first decides if the user is afflicted with them and how long the condition will last while the second is an array storing the amount of days the side effect can last (if the latter is 0, it means the during depends entirely on other things). */
        /* TODO - Add more side effects */

        cravingCrisis: {
          currDuration: 0,
          maxDuration: [1, 2],
        } /* Constantly reduces some stats and benefits of food until a randomly generated craving is satisfied. */,
        motherHunger: {
          currDuration: 0,
          maxDuration: [1, 2, 3],
        } /* Reduces the amount of fullness food gives and allows fullness to be exceeded to a randomly generated extent. The user suffers penalties in stats and productivity if their . */,
        restlessBrood: {
          currDuration: 0,
          maxDuration: [2, 3],
        } /* Drains energy faster and increases the energy cost of actions. Also reduces concentration and efficiency at work. The user will have to temporarily soother their children a lot. */,
        heavyWomb: {
          currDuration: 0,
          maxDuration: [3, 5, 7],
        } /* Reduces non-vehicle movement speed and drains energy faster. Trying to do work in this condition may extend it. */,
        contractions: {
          currDuration: 0,
          maxDuration: [0],
        } /* Happens randomly around the user's due date and takes a small cut out of their stats. It also has the user stunned in place temporarily. */,
        labour: {
          currDuration: 0,
          maxDuration: [0],
        } /* Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */,
        sexCraving: {
          currDuration: 0,
          maxDuration: [1, 3],
        } /* Maxes out arousal once a day and keeps it above 75 */,
        growthSpurt: {
          currDuration: 0,
          maxDuration: [0],
        } /* Can happen whenever the user does a lot of stuff that attributes to the growth of their pregnancy. This will happen around 12pm or 12am */,
      };

      const selectedSideEffect: PregSideEffect | undefined =
        allSideEffects[sideEffect];
      if (selectedSideEffect && !this.isSideEffectActive(sideEffect)) {
        this.sideEffects[sideEffect] = clone(selectedSideEffect);
        return true;
      }
      return false;
    }
    isSideEffectActive(sideEffect: keyof typeof this.sideEffects) {
      return this.sideEffects[sideEffect] ? true : false;
    }
    removeSideEffect(sideEffect: keyof typeof this.sideEffects) {
      if (this.isSideEffectActive(sideEffect)) {
        delete this.sideEffects[sideEffect];
        return true;
      }
      return false;
    }
    // !SECTION
  }
  // @ts-expect-error
  window[Womb.name] = Womb;

  export class Fetus {
    id: number; // decides the gender, growthRate, weight, and height
    hp: number; // scales with the womb's health. don't let it get to zero
    dateOfConception: Date; // Just here :p
    developmentRatio: DevelopmentRatio; // e.g 50%, 23%, 87%, 100%
    devRatioAtLastExpUpdate: DevelopmentRatio = 0;
    extraGrowthMod?: number = null; // A modifier multiplied to the fetus's growth rate. Comes from other sources
    weight: number; // in grams e.g 360, 501, 600
    height: number; // in cm e.g 11.38, 10.94
    amnioticFluidVolume: number; // The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
    species = FetusSpecies.HUMAN; // In the off-chance that I add non-human preg, this will store values from an enum containing the possible species to be impregnated with

    constructor(newId: number, classProp: typeof Fetus = null) {
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
      return new (this.constructor as typeof Fetus)(this.id, this);
    }
    toJSON() {
      //@ts-expect-error
      const ownData: Fetus = {};
      Object.keys(this).forEach((prop) => {
        //@ts-expect-error
        ownData[prop] = clone(this[prop]);
      }, this);

      return JSON.reviveWrapper(
        `new ${(this.constructor as typeof Fetus).name}(${
          this.id
        }, $ReviveData$)`,
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
      // A value of 1 produces "normal" growth
      const growthRateValues = [
        0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1, 1, 1, 1, 1.005, 1.01,
        1.015, 1.02, 1.025, 1.03, 1.035,
      ];
      return growthRateValues[this.id % growthRateValues.length];
    }

    // whether or not the fetus should be expunged when birth happens (only applies for superfetation)
    get shouldBirth() {
      return false;
    }

    get isOverdue() {
      return this.developmentRatio > gMaxDevelopmentState;
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
}
