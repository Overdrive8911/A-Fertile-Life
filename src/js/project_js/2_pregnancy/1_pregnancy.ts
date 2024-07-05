// `updatePregnancyGrowth` is run here
$("html").on(":passageend", () => {
  updatePregnancyGrowth(variables().player.womb);
});

// This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
// REVIEW - We need to do 5 things; generating the appropriate height, weight, and amnioticFluidProduced by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
const updatePregnancyGrowth = (targetWomb: Womb) => {
  // The target is pregnant so do everything required under here
  if (targetWomb.curCapacity > 0) {
    const currentTime = variables().gameDateAndTime;

    for (let i = 0; i < targetWomb.fetusData.size; i++) {
      // Determine how much to progress the fetus since the last update

      // Copy over the fetus data to avoid repetition
      const targetFetus = targetWomb.fetusData.get(i);

      // Get the total gestation time
      const totalGestationTime = getTotalGestationDuration(
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
        currentTime.getTime() - targetFetus.lastPregUpdate.getTime();

      // NOTE - The growth progress in between the trimesters will be shared in a 3:5:4 ratio. Each trimester will have 1/3 of the total gestation duration for that particular growth

      // SECTION - Determine how much to increase the `developmentRatio` of the fetus
      let additionalDevelopmentProgress = 0; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage

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
        let extraTime = null;
        let extraTime2 = null;
        let newTrimester = null;
        let newTrimester2 = null;

        switch (currTrimester) {
          case Trimesters.First:
            // Get the extra time that bleeds over into a new (second) trimester
            extraTime = timeElapsedSinceLastPregUpdate - remainingTrimesterTime;
            newTrimester = Trimesters.Second;

            // Check if the extraTime is still large enough to bleed over into the third trimester
            const newTrimesterDuration = getTrimesterDuration(
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
      targetFetus.developmentRatio = Math.clamp(
        targetFetus.developmentRatio + additionalDevelopmentProgress,
        gMinDevelopmentState,
        gMaxDevelopmentState
      );

      // SECTION - Determine the height and weight using developmentRatio

      // Update relevant values abt the fetus
    }
  }
};
