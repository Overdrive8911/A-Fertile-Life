// `updatePregnancyGrowth` is run here
$(document).on(":passagerender", (incomingPassage) => {
  // THis just basically means that the following should run if both the current and incoming passage have the word "location_" in their tags and at least the number of hours in `gHoursBetweenPregUpdate` have been passed since the last update
  if (
    getLocationFromPassageTitle(State.active.title) &&
    getLocationFromPassageTitle(incomingPassage.passage.title) &&
    variables().gameDateAndTime.getTime() -
      variables().lastPregUpdateFunctionCall.getTime() >=
      gHoursBetweenPregUpdate * 3600 * 1000
  ) {
    const playerWomb = variables().player.womb;

    updatePregnancyGrowth(playerWomb);

    if (isLiableForBirth(playerWomb)) triggerBirth(playerWomb);
  }
});

// This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
// REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidProduced by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
// TODO - Add side effects to womb health
// NOTE - Calling this function within the number of hours denoted by `gHoursBetweenPregUpdate` can lead to inaccurate values
const updatePregnancyGrowth = (targetWomb: Womb) => {
  // The target is pregnant so do everything required under here
  if (isPregnant(targetWomb)) {
    const currentTime = variables().gameDateAndTime;

    for (let i = 0; i < targetWomb.fetusData.size; i++) {
      // Determine how much to progress the fetus since the last update
      // Also get useful data

      // Copy over the fetus data to avoid unnecessary repetition
      const targetFetus = targetWomb.fetusData.get(i);

      // Get the total gestation time
      gActualPregnancyLength = getTotalGestationDuration(
        targetFetus,
        targetWomb
      );
      const pregDurationMod = getPregnancyLengthModifier(
        targetFetus,
        targetWomb
      );

      // Get the current trimester
      const currTrimester = getCurrentTrimester(targetFetus);

      // Get the total time needed to complete the current trimester
      const trimesterGestationTime = getTrimesterDuration(
        targetFetus,
        currTrimester,
        targetWomb
      );

      // Get the time elapsed in seconds since the pregnancy was updated
      const timeElapsedSinceLastPregUpdate =
        currentTime.getTime() / 1000 -
        targetFetus.lastPregUpdate.getTime() / 1000;

      // If, for some reason, time moves backwards, just exit the function (for now at least)
      // TODO - Add a way to reverse growth
      if (timeElapsedSinceLastPregUpdate < 0) return;

      // NOTE - The growth progress in between the trimesters will be shared in a 3:5:4 ratio. Each trimester will have 1/3 of the total gestation duration for that particular growth

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

      // SECTION - Determine the newHeight, newWeight, and newFluidVolume (and also the belly size) using newDevelopmentRatio
      // NOTE - These values are only calculated per gestational week, and will not change for any other smaller time measurement
      // TODO - Add drugs, eating habits and conditions that can also affect these.

      // Get the new gestation week after having the developmentRatio updated
      let newFetalGestationalWeek = getGestationalWeek(targetFetus, targetWomb);
      if (!newFetalGestationalWeek)
        newFetalGestationalWeek = GestationalWeek.One;

      let newWeight = targetFetus.weight;
      let newHeight = targetFetus.height;
      let newFluidVolume = targetFetus.amnioticFluidVolume;

      let weightDiff: number = null;
      let heightDiff: number = null;
      let fluidDiff: number = null;

      // TODO - Add little variations to newWeight and newHeight based off the fetus's id

      // I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id. This should allow for variation while still having similar values
      // TODO - Allow height and weight changes to occur with passage transition (or day if that's too much work)

      // To remove repetition
      const getStatDiff = (stat: FetalGrowthStatsEnum) => {
        return getStatToAddAfterDevelopmentProgress(
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

      // WEIGHT
      const weightBonusOrReduction = randomFloat(
        weightDiff * 0,
        weightDiff * 0.15
      );

      // HEIGHT
      const heightBonusOrReduction = randomFloat(
        heightDiff * 0.0,
        heightDiff * 0.15
      );

      // FLUID.
      const fluidBonus = randomFloat(fluidDiff * 0.0, fluidDiff * 0.15);

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
      targetFetus.lastPregUpdate = variables().gameDateAndTime;

      // Increase the womb's exp
      targetWomb.exp += updateWombExp(targetWomb);

      // Replace the data of the fetus with the updated one
      targetWomb.fetusData.set(i, targetFetus);
    }

    // Update belly size during pregnancy
    updatePregnantBellySize(targetWomb);

    // Update the last time this function was called
    variables().lastPregUpdateFunctionCall = variables().gameDateAndTime;
  }
};
