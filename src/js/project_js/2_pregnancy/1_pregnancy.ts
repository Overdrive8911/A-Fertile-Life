// `updatePregnancyGrowth` is run here
$("html").on(":passageend", () => {
  updatePregnancyGrowth(variables().player.womb);
});

// This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
// REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidProduced by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
const updatePregnancyGrowth = (targetWomb: Womb) => {
  // The target is pregnant so do everything required under here
  if (isPregnant(targetWomb) == PregnancyState.PREGNANT) {
    const currentTime = variables().gameDateAndTime;

    for (let i = 0; i < targetWomb.fetusData.size; i++) {
      // Determine how much to progress the fetus since the last update

      // Copy over the fetus data to avoid repetition
      const targetFetus = targetWomb.fetusData.get(i);

      // Get the total gestation time
      gActualPregnancyLength = getTotalGestationDuration(
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

      // Get the amount of time already completed in the trimester
      const trimesterProgress = getProgressInGivenTrimester(
        targetFetus,
        currTrimester,
        targetWomb
      );

      // Get the amount of time remaining in the trimester (in seconds)
      const remainingTrimesterTime = trimesterGestationTime - trimesterProgress;

      // Get the time elapsed in seconds since the pregnancy was updated
      const timeElapsedSinceLastPregUpdate =
        currentTime.getTime() / 1000 -
        targetFetus.lastPregUpdate.getTime() / 1000;

      // NOTE - The growth progress in between the trimesters will be shared in a 3:5:4 ratio. Each trimester will have 1/3 of the total gestation duration for that particular growth

      // SECTION - Determine how much to increase the `developmentRatio` of the fetus
      let additionalDevelopmentProgress = 0; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage

      //   `Actual Preg Length: ${gActualPregnancyLength}, Current Trimester: ${currTrimester}, Trimester Gest. Time: ${trimesterGestationTime}, Trim. Progress: ${trimesterProgress}, remaining trim. time: ${remainingTrimesterTime}, Add. dev progress: ${additionalDevelopmentProgress}, time elapsed since last preg update: ${timeElapsedSinceLastPregUpdate}`
      // );

      if (timeElapsedSinceLastPregUpdate <= remainingTrimesterTime) {
        // Since the elapsed time isn't going to bleed over into another trimester, can can turn it into a percentage and add it directly to the fetus's data

        switch (currTrimester) {
          case Trimesters.First:
            additionalDevelopmentProgress =
              (timeElapsedSinceLastPregUpdate / trimesterGestationTime) *
              gFirstTrimesterState;
            break;

          case Trimesters.Second:
            additionalDevelopmentProgress =
              (timeElapsedSinceLastPregUpdate / trimesterGestationTime) *
              (gSecondTrimesterState - gFirstTrimesterState);
            break;

          case Trimesters.Third:
            additionalDevelopmentProgress =
              (timeElapsedSinceLastPregUpdate / trimesterGestationTime) *
              (gThirdTrimesterState - gSecondTrimesterState);
            break;

          default:
            break;
        }
      } else {
        // It's going to enter a new trimester so split `timeElapsedSinceLastPregUpdate` into separate parts and deal with the extra time as if it was a new trimester.
        // NOTE - It may be possible that `timeElapsedSinceLastPregUpdate` will cause a first trimester pregnancy to jump into the third trimester. I'll use an extra variable to check that
        let extraTime: number = null;
        let extraTime2: number = null;
        let newTrimester: Trimesters = null;
        let newTrimester2: Trimesters = null;
        let newTrimesterDuration: number = null;

        switch (currTrimester) {
          case Trimesters.First:
            // Get the extra time that bleeds over into a new (second) trimester
            extraTime = timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
            newTrimester = Trimesters.Second;

            // Check if the extraTime is still large enough to bleed over into the third trimester
            newTrimesterDuration = getTrimesterDuration(
              targetFetus,
              newTrimester,
              targetWomb
            );
            if (extraTime > newTrimesterDuration) {
              extraTime2 = extraTime - newTrimesterDuration;
              newTrimester2 = Trimesters.Third;
            }

            // Deal with the additional progress for the current trimester that would be ending before moving over to the new one
            additionalDevelopmentProgress =
              (remainingTrimesterTime / trimesterGestationTime) *
              gFirstTrimesterState;

            // Now deal with the new (second) trimester
            additionalDevelopmentProgress += Math.clamp(
              (extraTime / newTrimesterDuration) *
                (gSecondTrimesterState - gFirstTrimesterState),
              gMinDevelopmentState,
              gSecondTrimesterState - gFirstTrimesterState
            );

            // Now deal with the third trimester if it actually bleeds over into it
            if (extraTime > newTrimesterDuration) {
              additionalDevelopmentProgress += Math.clamp(
                (extraTime2 /
                  getTrimesterDuration(
                    targetFetus,
                    newTrimester2,
                    targetWomb
                  )) *
                  (gThirdTrimesterState - gSecondTrimesterState),
                gMinDevelopmentState,
                gThirdTrimesterState - gSecondTrimesterState
              );
            }
            break;

          case Trimesters.Second:
            // Get the extra time that bleeds over into the third trimester
            extraTime = timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
            newTrimester = Trimesters.Third;

            // Deal with the additional progress for the current trimester that would be ending before moving over to the new one
            additionalDevelopmentProgress =
              (remainingTrimesterTime / trimesterGestationTime) *
              gFirstTrimesterState;

            // Check if the extraTime is still large enough to bleed over into the third trimester
            newTrimesterDuration = getTrimesterDuration(
              targetFetus,
              newTrimester,
              targetWomb
            );

            // Now deal with the third trimester
            additionalDevelopmentProgress += Math.clamp(
              (extraTime / newTrimesterDuration) *
                (gThirdTrimesterState - gSecondTrimesterState),
              gMinDevelopmentState,
              gThirdTrimesterState - gSecondTrimesterState
            );

          case Trimesters.Third:
            // Since this one can't bleed over into any other trimester so just clamp the result
            additionalDevelopmentProgress = Math.clamp(
              (remainingTrimesterTime / trimesterGestationTime) *
                gThirdTrimesterState,
              gMinDevelopmentState,
              gThirdTrimesterState
            );
            break;
          default:
            break;
        }
      }

      // Add the additional progress into the fetus's data and make sure it doesn't exceed the limit
      const newDevelopmentRatio = Math.clamp(
        targetFetus.developmentRatio + additionalDevelopmentProgress,
        gMinDevelopmentState,
        gMaxDevelopmentState
      );

      // Get the initial gestation week for the fetus, before having important data overwritten
      const initialFetalGestationalWeek = getGestationalWeek(
        targetFetus,
        targetWomb
      );

      // Update the data
      targetFetus.developmentRatio =
        targetFetus.developmentRatio < newDevelopmentRatio
          ? newDevelopmentRatio
          : targetFetus.developmentRatio;

      // SECTION - Determine the newHeight, newWeight, and newFluidVolume (and also the belly size) using newDevelopmentRatio
      // NOTE - These values are only calculated per gestational week, and will not change for any other smaller time measurement
      // TODO - Add drugs, eating habits and conditions that can also affect these.

      // Get the new gestation week after having the developmentRatio updated
      const newFetalGestationalWeek = getGestationalWeek(
        targetFetus,
        targetWomb
      );

      let newWeight = targetFetus.weight;
      let newHeight = targetFetus.height;
      let newFluidVolume = targetFetus.amnioticFluidVolume;

      let weightWeeklyDiff: number = null;
      let heightWeeklyDiff: number = null;
      let fluidWeeklyDiff: number = null;

      // TODO - Add little variations to newWeight and newHeight based off the fetus's id
      if (
        initialFetalGestationalWeek !== PregnancyState.OVERDUE &&
        newFetalGestationalWeek !== PregnancyState.OVERDUE
      ) {
        // I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id
        weightWeeklyDiff = getStatDiffBetweenTwoGestationalWeeks(
          initialFetalGestationalWeek,
          newFetalGestationalWeek,
          FetalGrowthStatsEnum.WEIGHT
        );
        heightWeeklyDiff = getStatDiffBetweenTwoGestationalWeeks(
          initialFetalGestationalWeek,
          newFetalGestationalWeek,
          FetalGrowthStatsEnum.HEIGHT
        );
        fluidWeeklyDiff = getStatDiffBetweenTwoGestationalWeeks(
          initialFetalGestationalWeek,
          newFetalGestationalWeek,
          FetalGrowthStatsEnum.AMNIOTIC_FLUID
        );
      } else if (initialFetalGestationalWeek == PregnancyState.OVERDUE) {
        // Handle the growth of overdue pregnancies when the character is currently overdue
      } else if (newFetalGestationalWeek == PregnancyState.OVERDUE) {
        // Handle the growth of overdue pregnancies when the character will become overdue
      }
      // SECTION - Using the fetus's id to alter the gained a bit
      const bitCheck = (targetFetus.id & (1 << random(0, 15))) !== 0; // Randomly pick the index of a bit and check if it's true
      const bitCheck2 = (targetFetus.id & (1 << random(0, 15))) !== 0; // Do it again :3
      const bitCheck3 = (targetFetus.id & (1 << random(0, 15))) !== 0; // And again :D

      // WEIGHT
      const minWeightBonusOrReduction = 0;
      const maxWeightBonusOrReduction = random(2.5, 5.5);
      let randomWeightBonusOrReduction = Math.clamp(
        0.1 * weightWeeklyDiff,
        minWeightBonusOrReduction,
        maxWeightBonusOrReduction
      );

      // HEIGHT
      const minHeightBonusOrReduction = 0;
      const maxHeightBonusOrReduction = parseFloat(
        Math.clamp(Math.random(), 0.15, 0.55).toFixed(2)
      );
      let randomHeightBonusOrReduction = Math.clamp(
        0.05 * heightWeeklyDiff,
        minHeightBonusOrReduction,
        maxHeightBonusOrReduction
      );

      // FLUID. For fluid, there will be no deductions, only additions/no change
      const minFluidBonus = 0;
      const maxFluidBonus = random(1, 15);
      let randomFluidBonus = Math.clamp(
        0.1 * fluidWeeklyDiff,
        minFluidBonus,
        maxFluidBonus
      );

      // Add the regular weekly diffs before the bonus/reductions
      newWeight += weightWeeklyDiff;
      newHeight += heightWeeklyDiff;
      // TODO - Make this amount fluctuate depending on the amount of fetuses in the womb
      newFluidVolume += fluidWeeklyDiff;

      if (bitCheck) newWeight += randomWeightBonusOrReduction;
      else newWeight -= randomWeightBonusOrReduction;

      if (bitCheck2) newHeight += randomHeightBonusOrReduction;
      else newHeight -= randomHeightBonusOrReduction;

      if (bitCheck3) newFluidVolume += randomFluidBonus;

      // SECTION - Update relevant values abt the fetus. Make sure that the values don't reduce
      targetFetus.weight =
        targetFetus.weight < newWeight ? newWeight : targetFetus.weight;
      targetFetus.height =
        targetFetus.height < newHeight ? newHeight : targetFetus.height;
      targetFetus.amnioticFluidVolume =
        targetFetus.amnioticFluidVolume < newFluidVolume
          ? newFluidVolume
          : targetFetus.amnioticFluidVolume;
      targetFetus.lastPregUpdate = variables().gameDateAndTime;

      targetWomb.fetusData.set(i, {
        height: targetFetus.height,
        weight: targetFetus.weight,
        amnioticFluidVolume: targetFetus.amnioticFluidVolume,
        developmentRatio: targetFetus.developmentRatio,
        lastPregUpdate: targetFetus.lastPregUpdate,

        id: targetFetus.id,
        gender: targetFetus.gender,
        dateOfConception: targetFetus.dateOfConception,
        growthRate: targetFetus.growthRate,
      });
    }
  }
};
