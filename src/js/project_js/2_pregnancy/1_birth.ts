const triggerBirth = (womb: Womb) => {
  // This is what will expunge the fetuses from the womb (except in the case for superfetation)
  // TODO - It's just bare-bones now
  if (womb.perks.superfet[PregPerkElements.CURRENT_LVL]) {
    // Deal with superfetation
  } else {
    // Handle postpartum, birth scenes, etc
    // Just clear out the womb
    womb.fetusData.clear;
  }
};
const isLiableForBirth = (womb: Womb) => {
  // This will check to see if an inputted womb is ready to giving birth, regardless of the actual chance of a successful delivery
  // NOTE - Drugs and conditions may affect this

  let chanceOfBirth = 0;

  // Include something to account for superfetation. Like a giant IF statement
  if (womb.perks.superfet[PregPerkElements.CURRENT_LVL]) {
    // Handle superfetation
  } else {
    // Regular Birth (mostly)

    // If the womb's current capacity is within 90% of the max capacity, force birth ASAP else check other conditions
    if (womb.curCapacity >= womb.maxCapacity * 0.9) return true;
    else {
      // Check whether if all the fetuses are in the development range for birthing. If false, prevent birth so long as the womb's max capacity has not been exceeded/near. If true, create a random choice that decides whether it's time to birth. Increase the chance as gestational weeks progress
      let sumOfDevelopmentRatio = 0;

      for (let i = 0; i < womb.fetusData.size; i++) {
        const fetus = womb.fetusData.get(i);

        // All fetuses must be at or above a particular threshold for birth to occur
        if (fetus.developmentRatio < gMinBirthThreshold) return false;

        //  Get the sum of the development of all fetuses. This will be used to determine the average which is what will be used to determine the chance of birth (if possible)
        sumOfDevelopmentRatio += fetus.developmentRatio;
      }

      const averageDevelopmentOfFetus =
        sumOfDevelopmentRatio / womb.fetusData.size;

      // Every 1% above gMaxDevelopmentState adds a 2.5% chance for the character's water to break
      chanceOfBirth += (averageDevelopmentOfFetus - gMaxDevelopmentState) * 2.5;
    }
  }

  // Unhealthy wombs are at higher risk of birthing, however, clamp the increased chance at 33%
  chanceOfBirth += Math.clamp(
    (womb.maxHp / womb.hp) * (womb.maxHp - womb.hp) * 0.75,
    0,
    33
  );

  // Using `chanceOfBirth`, check if the character should birth or not
  if (randomFloat(0, 100) <= chanceOfBirth) return true;
  else return false;
};
