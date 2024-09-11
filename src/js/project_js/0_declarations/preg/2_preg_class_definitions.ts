namespace NSPregnancy {
  /* Womb, Pregnancy and Birth */
  /* A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions */
  /* A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has */
  /* The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has */
  /* Capacity is in cubic centimetres(CCs) */
  export class Womb1 {
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
    lastExpUpdate: Date =
      null; /* The last time the exp update function was ran on this womb*/

    // belongToPlayer: boolean;
    naturalGrowthMod = 1; // A multiplier that affects the growth rate of the fetuses, the player's own is x10

    perks: PregPerksObject = {
      /* If a perk's value is 0, it hasn't been enabled. Any number above 0 is its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant. */
      /* Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility */
      /* Each perk is an object of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level */
      /*TODO - Change the prices later to something more reasonable. Also, add more perks */

      // TODO - Only store these if they're active
      gestator: {
        currLevel: 0,
        price: 5000,
        maxLevel: 10,
      } /* Increases the speed of pregnancies depending on how much food is consumed. At the maximum level, pregnancy duration is shortened to at most a week */,
      hyperFertility: {
        currLevel: 0,
        price: 3000,
        maxLevel: 5,
      } /* Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */,
      superFet: {
        currLevel: 0,
        price: 15000,
        maxLevel: 5,
      } /* Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */,
      elasticity: {
        currLevel: 0,
        price: 7000,
        maxLevel: 10,
      } /* Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */,
      immunityBoost: {
        currLevel: 0,
        price: 2000,
        maxLevel: 10,
      } /* Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */,
      motherlyHips: {
        currLevel: 0,
        price: 5000,
        maxLevel: 5,
      } /* Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */,
      motherlyBoobs: {
        currLevel: 0,
        price: 5000,
        maxLevel: 5,
      } /* Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */,
      ironSpine: {
        currLevel: 0,
        price: 7000,
        maxLevel: 5,
      } /* Can carry bigger pregnancies and more weight before becoming bed bound */,
      sensitiveWomb: {
        currLevel: 0,
        price: 6000,
        maxLevel: 5,
      } /* Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */,
      healthyWomb: {
        currLevel: 0,
        price: 3000,
        maxLevel: 10,
      } /* Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */,
      fortifiedWomb: {
        currLevel: 0,
        price: 10000,
        maxLevel: 5,
      } /* Reduces the increase rate of womb.comfortCapacity but raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */,
      noPostpartum: {
        currLevel: 0,
        price: 2000,
        maxLevel: 7,
      } /* Reduces the postpartum period of the PC by 1 day (Note that the PC has a recovery period of a week) */,
    };
    sideEffects: PregSideEffectsObject = {
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
    fetusData: Map<number /* fetusId */, Fetus1> = new Map();

    constructor(classProperties: typeof Womb1 = null) {
      if (classProperties != null) {
        Object.keys(classProperties).forEach((prop) => {
          //@ts-expect-error
          this[prop] = clone(classProperties[prop]);
        }, this);
      }
    }

    clone() {
      //@ts-expect-error
      return new (this.constructor as typeof Womb1)(this);
    }
    toJSON() {
      const ownData: unknown = {};
      Object.keys(this).forEach((prop) => {
        //@ts-expect-error
        ownData[prop] = clone(this[prop]);
      }, this);

      return JSON.reviveWrapper(
        `new ${(this.constructor as typeof Womb1).name}($ReviveData$)`,
        ownData
      );
    }

    get isPregnant() {
      // There is at least one fetus
      if (this.fetusData.size > 0) return true;
      else return false;
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
          if (this.perks.hyperFertility.currLevel) {
            // Give a large multiplier to the chance for multiples.
            chance *= 1.55;

            // Gently add a flat increase it with every extra level
            let k = 1;
            while (k < this.perks.hyperFertility.currLevel) {
              chance += 0.055;
              k++;
            }
          }
          if (isPregnant) {
            if (this.perks.superFet.currLevel) {
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
        const maxFetusNumber = getMinimumNumOfFullTermFetusesAtBellyState(
          this.maxCapacity
        );
        if (numOfFoetusToSpawn > maxFetusNumber)
          numOfFoetusToSpawn = maxFetusNumber;

        // SECTION - Create the babies and push them into the womb. Not much data about them is needed since the player can't keep them anyway
        for (i = 0; i < numOfFoetusToSpawn; i++) {
          // NOTE - the ID is used to generate these stuff. I may add another random chance if I'm feeling like but for now, having the same ID will create the same stats
          this.addFetus(new Fetus1(this), i);
        }

        // Update specific data for the womb
        this.lastFertilized = variables().gameDateAndTime;
        return true;
      } else {
        return false;
      }
    }

    addFetus(fetus: Fetus1, index: number = null) {
      if (index == null) index = this.fetusData.size;

      this.fetusData.set(index, fetus);
    }
    // If `fetus` is given, find a matching copy with the same id, else if an `index` is given instead, use it. If none are given, default to the first fetus
    removeFetus(fetus?: Fetus1, index?: number) {
      if (fetus) {
        index = [...this.fetusData.values()].find((data) => {
          return data.id == fetus.id;
        }).id;
      }

      if (index == undefined) index = [...this.fetusData.keys()][0]; // Use the first fetus if no fetus data is explicitly given

      if (index == undefined) return false;

      this.fetusData.delete(index);
      return true;
    }

    totalOfFetalStats(stat: FetalGrowthStatsEnum) {
      let sumOfFetalStats = 0;

      for (let i = 0; i < this.fetusData.size; i++) {
        sumOfFetalStats += this.fetusData.get(i)[`${stat}`];
      }

      return sumOfFetalStats;
    }

    // Accepts any value from the enum BellyState but will only work with members that have `FULL_TERM` appended. Returns the minimum number of full grown, non-overdue fetuses that can achieve the inputted size
    getMinimumNumOfFullTermFetusesAtBellyState(bellyState: BellyState) {
      if (bellyState < BellyState.FULL_TERM) return 0;

      return Math.floor(bellyState / BellyState.FULL_TERM);
    }
  }
  // @ts-expect-error
  window[Womb1.name] = Womb1;

  // NOTE - Creating a new fetus instance doesn't add it to any womb unless the womb itself directly adds it
  export class Fetus1 {
    id: number; // decides the gender, growthRate, weight, and height
    hp: number; // scales with the womb's health. don't let it get to zero
    gender: Gender;
    dateOfConception: Date; // Just here :p
    lastPregUpdate: Date; // Tells the last time the pregnancy progress was calculated. Is the same as `date of conception` upon impregnation
    developmentRatio: DevelopmentRatio; // e.g 50%, 23%, 87%, 100%
    growthRate: number; // e.g 1.5, 0.5, 2.0
    weight: number; // in grams e.g 360, 501, 600
    height: number; // in cm e.g 11.38, 10.94
    amnioticFluidVolume: number; // The amount of fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
    shouldBirth = false; // whether or not the fetus should be expunged when birth happens (only applies for superfetation)
    species = FetusSpecies.HUMAN; // In the off-chance that I add non-human preg, this will store values from an enum containing the possible species to be impregnated with
    creatorWomb: Womb1; // The womb used to spawn the fetus

    constructor(womb: Womb1, classProp: typeof Fetus1 = null) {
      const generateFetusId = (womb: Womb1) => {
        // Check all fetuses in the womb (if any) and generate a random 16-bit number that isn't shared with any other existing fetus
        let newFetusId = random(0, 65535);

        for (let i = 0; i < womb.fetusData.size; i++) {
          const existingFetusId = womb.fetusData.get(i).id;

          if (newFetusId == existingFetusId) {
            // Restart the function
            generateFetusId(womb);
            break;
          }
        }

        return newFetusId;
      };
      this.id = generateFetusId(womb);

      this.hp = WombHealth.FULL_VITALITY;

      const id = this.id;
      const randNum = random(id);
      if (randNum < 0.05 * id) this.gender = "I";
      else if (randNum >= 0.05 * id && randNum < 0.5 * id) this.gender = "F";
      else this.gender = "M";

      // A value of 1 produces "normal" growth
      const growthRateValues = [
        0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1, 1, 1, 1, 1.005, 1.01,
        1.015, 1.02, 1.025, 1.03, 1.035,
      ];
      this.growthRate = growthRateValues[id % growthRateValues.length];

      this.developmentRatio = gMinDevelopmentState;
      // Just trying to get an arbitrarily small number
      this.height = id / Math.pow(10, 9);
      this.weight = id / Math.pow(10, 9);
      this.amnioticFluidVolume = id / Math.pow(10, 9);
      this.dateOfConception = variables().gameDateAndTime;
      this.lastPregUpdate = variables().gameDateAndTime;

      this.creatorWomb = womb;

      //
      if (classProp != null) {
        Object.keys(classProp).forEach((prop) => {
          //@ts-expect-error
          this[prop] = clone(classProperties[prop]);
        }, this);
      }
    }

    clone() {
      //@ts-expect-error
      return new (this.constructor as typeof Fetus1)(this.creatorWomb, this);
    }
    toJSON() {
      const ownData: unknown = {};
      Object.keys(this).forEach((prop) => {
        //@ts-expect-error
        ownData[prop] = clone(this[prop]);
      }, this);

      return JSON.reviveWrapper(
        `new ${(this.constructor as typeof Fetus1).name}(${
          this.creatorWomb
        }, $ReviveData$)`,
        ownData
      );
    }

    get pregnancyLengthModifier() {
      // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
      let modifier = 1;

      // Account for the fetus's growth rate
      modifier /= this.growthRate;

      //  Account for the womb health. Lower hp make pregnancies slightly longer
      modifier *= Math.clamp(
        Math.sqrt(this.creatorWomb.maxHp / this.creatorWomb.hp),
        1,
        1.2
      );

      // SECTION - Determine the actual pregnancy duration by factoring genetic conditions, drugs, growthRate, etc
      // if (womb) {
      // TODO

      // x10 faster pregnancies for the player since the player's own is 10
      modifier /= this.creatorWomb.naturalGrowthMod;

      return modifier;
    }

    get totalGestationDuration() {
      return this.pregnancyLengthModifier * gDefaultPregnancyLength;
    }

    get gestationalWeek() {
      return Math.floor(
        (this.developmentRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks
      );
    }

    static #getStatForGestationalWeekInOverduePregnancy = (
      overdueGestWeek: GestationalWeek,
      stat: FetalGrowthStatsEnum
    ) => {
      // Use the average stat difference (and a bit of variation) to get a result for overdue pregnancies that don't have an entry in gFetalGrowthOverGestationalWeeks[]

      let averageStatDiffInLastFourWeeksOfPregnancy = 0;
      let overdueStatDiffToAdd = 0;
      const numOfWeeksToGetAverageFor = 4;

      if (overdueGestWeek <= GestationalWeek.MAX)
        overdueGestWeek = GestationalWeek.MAX + 1;

      // Get the average weight gain over the last 4~5 weeks
      for (let i = 0; i <= numOfWeeksToGetAverageFor; i++) {
        const gestationalWeekArrayIndex: GestationalWeek =
          GestationalWeek.MAX - i;
        const precedingGestationalWeekArrayIndex: GestationalWeek =
          GestationalWeek.MAX - (i + 1);

        averageStatDiffInLastFourWeeksOfPregnancy +=
          gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex][
            `${stat}`
          ] -
          gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex][
            `${stat}`
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
        gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX][`${stat}`] +
        overdueStatDiffToAdd
      );
    };

    getAccurateFetalStatForDevelopmentStage(stat: FetalGrowthStatsEnum) {
      let devRatio = this.developmentRatio;
      let fetalStat = 0;

      const gestationalWeek: GestationalWeek =
        (devRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks;

      const gestationalWeekFloor: GestationalWeek = Math.floor(gestationalWeek);

      // Need a better name for this
      const extraWeekDuration = gestationalWeek - gestationalWeekFloor;

      if (gestationalWeek < GestationalWeek.One) {
        return 0;
      } else if (
        gestationalWeek < gNumOfGestationalWeeks &&
        gestationalWeek + 1 < gNumOfGestationalWeeks
      ) {
        fetalStat =
          gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`] +
          (gFetalGrowthOverGestationalWeeks[
            (gestationalWeekFloor + 1) as GestationalWeek
          ][`${stat}`] -
            gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`]) *
            extraWeekDuration;
      } else if (
        gestationalWeek <= gNumOfGestationalWeeks &&
        gestationalWeek + 1 > gNumOfGestationalWeeks
      ) {
        fetalStat =
          gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`] +
          ((
            this.constructor as typeof Fetus1
          ).#getStatForGestationalWeekInOverduePregnancy(
            gestationalWeekFloor + 1,
            stat
          ) -
            gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`]) *
            extraWeekDuration;
      } else {
        fetalStat =
          (
            this.constructor as typeof Fetus1
          ).#getStatForGestationalWeekInOverduePregnancy(
            gestationalWeekFloor,
            stat
          ) +
          (
            this.constructor as typeof Fetus1
          ).#getStatForGestationalWeekInOverduePregnancy(
            gestationalWeekFloor + 1,
            stat
          ) -
          (
            this.constructor as typeof Fetus1
          ).#getStatForGestationalWeekInOverduePregnancy(
            gestationalWeekFloor,
            stat
          ) *
            extraWeekDuration;
      }
      console.log(
        `devRatio: ${devRatio}, gestationalWeek: ${gestationalWeekFloor}, fetalStat: ${fetalStat}`
      );

      return fetalStat;
    }
  }
  // @ts-expect-error
  window[Fetus1.name] = Fetus1;
}
