// `updatePregnancyGrowth` is run here
$(document).on(":passageinit", (incomingPassage) => {
  // THis just basically means that the following should run if both the current and incoming passage have the word "location_" in their tags
  if (
    getLocationFromPassageTitle(State.active.title) &&
    getLocationFromPassageTitle(incomingPassage.passage.title)
  ) {
    const playerWomb = variables().player.womb;

    updatePregnancyGrowth(playerWomb);

    if (isLiableForBirth(playerWomb)) triggerBirth(playerWomb);
  }
});

// This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
// REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidProduced by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
// TODO - Add side effects to womb health
const updatePregnancyGrowth = (targetWomb: Womb) => {
  // The target is pregnant so do everything required under here
  if (isPregnant(targetWomb)) {
    const currentTime = variables().gameDateAndTime;

    for (let i = 0; i < targetWomb.fetusData.size; i++) {
      // Determine how much to progress the fetus since the last update

      // Copy over the fetus data to avoid unnecessary repetition
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
      let remainingTrimesterTime: number = null;
      if (currTrimester != Trimesters.Overdue) {
        remainingTrimesterTime = trimesterGestationTime - trimesterProgress;
      } else {
        remainingTrimesterTime = gOverduePregnancyLength;
      }

      // Get the time elapsed in seconds since the pregnancy was updated
      const timeElapsedSinceLastPregUpdate =
        currentTime.getTime() / 1000 -
        targetFetus.lastPregUpdate.getTime() / 1000;

      // If, for some reason, time moves backwards, just exit the function (for now at least)
      // TODO - Add a way to reverse growth
      if (timeElapsedSinceLastPregUpdate < 0) return;

      // NOTE - The growth progress in between the trimesters will be shared in a 3:5:4 ratio. Each trimester will have 1/3 of the total gestation duration for that particular growth

      // SECTION - Determine how much to increase the `developmentRatio` of the fetus
      let additionalDevelopmentProgress = 0; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage/ratio

      if (timeElapsedSinceLastPregUpdate <= remainingTrimesterTime) {
        // NOTE - If currTrimester is Trimesters.Overdue, then this will always be true
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

          case Trimesters.Overdue:
            additionalDevelopmentProgress =
              (timeElapsedSinceLastPregUpdate / gActualPregnancyLength) *
              gMaxDevelopmentState;

          default:
            break;
        }
      } else {
        // It's going to enter a new trimester so split `timeElapsedSinceLastPregUpdate` into separate parts and deal with the extra time as if it was a new trimester.
        // NOTE - It may be possible that `timeElapsedSinceLastPregUpdate` will cause a first trimester pregnancy to jump into the third trimester. I'll use an extra variable to check that
        let extraTime: number = null;
        let extraTime2: number = null;
        let extraTime3: number = null;
        let newTrimester: Trimesters = null;
        let newTrimester2: Trimesters = null;
        let newTrimester3: Trimesters = null;
        let newTrimesterDuration: number = null;
        let newTrimesterDuration2: number = null;
        let newTrimesterDuration3: number = null;
        // console.log(
        //   `timeElapsedSinceLastPregUpdate: ${timeElapsedSinceLastPregUpdate}, remainingTrimesterTime: ${remainingTrimesterTime}, gActualPregnancyLength: ${gActualPregnancyLength}`
        // );

        switch (currTrimester) {
          case Trimesters.First:
            // Deal with the additional progress for the current (first) trimester that would be ending before moving over to the new one
            additionalDevelopmentProgress =
              (remainingTrimesterTime / trimesterGestationTime) *
              gFirstTrimesterState;

            // Get the extra time that bleeds over into a new (second) trimester
            extraTime = timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
            newTrimester = Trimesters.Second;

            // Now deal with the new (second) trimester
            newTrimesterDuration = getTrimesterDuration(
              targetFetus,
              newTrimester,
              targetWomb
            );
            additionalDevelopmentProgress += Math.clamp(
              (extraTime / newTrimesterDuration) *
                (gSecondTrimesterState - gFirstTrimesterState),
              gMinDevelopmentState,
              gSecondTrimesterState - gFirstTrimesterState
            );

            // Check if the extraTime is still large enough to bleed over into the third trimester
            if (extraTime > newTrimesterDuration) {
              extraTime2 = extraTime - newTrimesterDuration;
              newTrimester2 = Trimesters.Third;
              newTrimesterDuration2 = getTrimesterDuration(
                targetFetus,
                newTrimester2,
                targetWomb
              );

              // Now deal with the third trimester if it actually bleeds over into it
              additionalDevelopmentProgress += Math.clamp(
                (extraTime2 / newTrimesterDuration2) *
                  (gThirdTrimesterState - gSecondTrimesterState),
                gMinDevelopmentState,
                gThirdTrimesterState - gSecondTrimesterState
              );

              // Check if the extraTime2 is STILL large enough to enter overdue territory
              if (extraTime2 > newTrimesterDuration2) {
                extraTime3 = extraTime2 - newTrimesterDuration2;
                newTrimester3 = Trimesters.Overdue;

                additionalDevelopmentProgress +=
                  (extraTime3 / gActualPregnancyLength) * gMaxDevelopmentState;
              }
            }

            break;

          case Trimesters.Second:
            // Deal with the additional progress for the current trimester that would be ending before moving over to the new one
            additionalDevelopmentProgress =
              (remainingTrimesterTime / trimesterGestationTime) *
              gFirstTrimesterState;

            // Get the extra time that bleeds over into the third trimester
            extraTime = timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
            newTrimester = Trimesters.Third;
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

            // Check if it still bleeds over into Overdue territory
            if (extraTime > newTrimesterDuration) {
              extraTime2 = extraTime - newTrimesterDuration;
              newTrimester2 = Trimesters.Overdue;

              additionalDevelopmentProgress +=
                (extraTime2 / gActualPregnancyLength) * gMaxDevelopmentState;
            }

          case Trimesters.Third:
            // Since this one can't bleed over into any other trimester (except when entering overdue territory) so just clamp the result
            additionalDevelopmentProgress += Math.clamp(
              (remainingTrimesterTime / trimesterGestationTime) *
                gThirdTrimesterState,
              gMinDevelopmentState,
              gThirdTrimesterState
            );

            if (timeElapsedSinceLastPregUpdate > remainingTrimesterTime) {
              // Get the extra time that bleeds over into being overdue
              extraTime =
                timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
              newTrimester = Trimesters.Overdue;

              additionalDevelopmentProgress +=
                (extraTime / gActualPregnancyLength) * gMaxDevelopmentState;
            }
            break;
          default:
            break;
        }
      }

      // Add the additional progress into the fetus's data and make sure it doesn't exceed the limit. It can go beyond 100, and that means the fetus is overdue
      const newDevelopmentRatio = Math.clamp(
        targetFetus.developmentRatio + additionalDevelopmentProgress,
        gMinDevelopmentState,
        targetFetus.developmentRatio + additionalDevelopmentProgress
      );

      // Get the initial gestation week for the fetus, before having important data overwritten
      let initialFetalGestationalWeek = getGestationalWeek(
        targetFetus,
        targetWomb
      );
      if (!initialFetalGestationalWeek)
        initialFetalGestationalWeek = GestationalWeek.One;

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

      let weightWeeklyDiff: number = null;
      let heightWeeklyDiff: number = null;
      let fluidWeeklyDiff: number = null;

      // TODO - Add little variations to newWeight and newHeight based off the fetus's id

      // I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id. This should allow for variation while still having similar values
      // TODO - Allow height and weight changes to occur with passage transition (or day if that's too much work)

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
      console.log(
        `initialFetalGestationalWeek: ${initialFetalGestationalWeek}, newFetalGestationalWeek: ${newFetalGestationalWeek}`
      );
      console.log(
        `weightWeeklyDiff: ${weightWeeklyDiff}, heightWeeklyDiff: ${heightWeeklyDiff}, fluidWeeklyDiff: ${fluidWeeklyDiff}`
      );

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
  }
};
