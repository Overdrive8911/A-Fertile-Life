// This will try to create a pregnancy and return a boolean
const tryCreatePregnancy = (
  virility: number,
  fertility: number,
  virilityBonus: number | undefined,
  fertilityBonus: number | undefined
): boolean => {
  // Both parameters have a range of 0 - 100 in most cases. Even when both sides have a 100, conception might still fail, although with a very minute chance. If for some reason, either value is above 100, conception is guaranteed (the PC can get a fertility above 100)

  // The respective bonuses are capped at 30 each and reduced to 30~50% of their original value , before being added to 'pregChance'

  // Having a virility or fertility above 100 makes one basically a fertility idol and guarantees pregnancies
  if (virility > 100 || fertility > 100) return true;

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
};

// The main function for making babies
const tryToImpregnate = (
  virility: number,
  virilityBonus: number | undefined,
  wombData: Womb
) => {
  if (!virilityBonus) virilityBonus = 0;
  let fertilityBonus = 0;
  // TODO - calculate all the fertility bonuses from the womb
  // const isPregnancySuccessful =

  if (
    tryCreatePregnancy(
      virility,
      wombData.fertility,
      virilityBonus,
      fertilityBonus
    )
  ) {
    let i = 0,
      j = 0;

    // TODO - Deal with the sperm stuff later
    // NOTE - The bonuses should be capped at 30 somewhere. They can be obtained from drugs, conditions, randomly, etc
    // Assume `virility` = 70, and `virilityBonus` = 30. A but on the high side but eh
    let totalVirility = virility + virilityBonus * 0.5;
    let totalFertility = wombData.fertility + fertilityBonus;

    // SECTION - Decide how many offspring to create
    let numOfFoetusToSpawn = 1;

    // The chance of more than 1 sperm fertilizing an egg. It's not really much :p
    while (i < gChanceOfNaturalMultipleOvaFertilization.length) {
      // Use the virility bonus to boost the chance a bit, like by ~0.3...
      let chance =
        gChanceOfNaturalMultipleOvaFertilization[i] +
        (totalVirility * 0.1) / virility +
        (virility * 0.25) / 100;

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
        (totalFertility * 0.1) / wombData.fertility +
        (wombData.fertility * 0.1) / 100 +
        (fertilityBonus * 0.75) / 100; // 0.455 is the extra bonus gotten with 100 fertility and 30 fertilityBonus

      // TODO - Add drugs that directly increase the chance for multiples, separate from the fertilityBonus stat. Also, these calculations need extra tweaking

      const perkLevel = 0;
      // The player has the hyper fertility perk
      if (wombData.perks.hyperFertility[perkLevel]) {
        // Give a large multiplier to the chance for multiples.
        chance *= 1.55;

        // Gently add a flat increase it with every extra level
        let k = 1;
        while (k < wombData.perks.hyperFertility[perkLevel]) {
          chance += 0.055;
          k++;
        }
      }
      if (isPregnant(wombData) == PregnancyState.PREGNANT) {
        if (wombData.perks.superfet) {
          // Applies to superfetation, lets make it difficult >:D
          chance *= 0.1;
        } else {
          // No chance to make more babies :p
          chance = 0;
        }
      }

      if (parseFloat(randomFloat(1).toFixed(2)) < chance) {
        // If the probability passes, add another fetus
        numOfFoetusToSpawn++;
      } else {
        // Once it fails, quit making more fetuses
        break;
      }

      j++;
    }

    // NOTE - For now, the max amount of offspring is limited to the max capacity of the womb so
    const maxFetusNumber = getMinimumNumOfFullTermFetusesAtBellyState(
      wombData.maxCapacity
    );
    if (numOfFoetusToSpawn > maxFetusNumber)
      numOfFoetusToSpawn = maxFetusNumber;

    // SECTION - Create the babies and push them into the womb. Not much data about them is needed since the player can't keep them anyway
    for (i = 0; i < numOfFoetusToSpawn; i++) {
      // NOTE - the ID is used to generate these stuff. I may add another random chance if I'm feeling like but for now, having the same ID will create the same stats
      let fId = generateFetusId(wombData);

      // Generate the gender. Even IDs are female while odd ids are male
      let fGender = fId % 2 ? "M" : "F";

      // Pick a random growth rate but be biased to values closer to 1
      // NOTE - This is the default rate. For the player, its different since their pregnancy initially takes around a month or so. It's around 10 times as fast
      let fGrowthRateArray = [
        0.97, 0.97, 0.97, 0.975, 0.975, 1, 1, 1, 1, 1, 1.03, 1.03, 1.03, 1.035,
        1.035,
      ];
      let fGrowthRate = fGrowthRateArray[fId % fGrowthRateArray.length];

      // These 4 will be dealt with later
      let fHeight =
        gFetalGrowthOverGestationalWeeks[GestationalWeek.One].height;
      let fWeight =
        gFetalGrowthOverGestationalWeeks[GestationalWeek.One].weight;
      let fDevelopmentRatio = 0;
      let fAmnioticFluidVolume =
        gFetalGrowthOverGestationalWeeks[GestationalWeek.One]
          .amnioticFluidProduced;

      // Push da foetus into the womb
      wombData.fetusData.set(i, {
        id: fId,
        gender: fGender,
        growthRate: fGrowthRate,
        height: fHeight,
        weight: fWeight,
        developmentRatio: fDevelopmentRatio,
        amnioticFluidVolume: fAmnioticFluidVolume,
        dateOfConception: variables().gameDateAndTime,
        lastPregUpdate: variables().gameDateAndTime,
      });

      // Also increase the capacity of the womb so it'll be known that the player is expecting
      wombData.curCapacity++;
    }
    return true;
  } else {
    return false;
  }
};
