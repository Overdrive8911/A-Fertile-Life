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
      const newDevelopmentRatio = Math.clamp(
        targetFetus.developmentRatio + additionalDevelopmentProgress,
        gMinDevelopmentState,
        gMaxDevelopmentState
      );

      // SECTION - Determine the newHeight, newWeight, and amnioticFluidVolume (and also the belly size) using newDevelopmentRatio
      // NOTE - These first 3 are only calculated/updated after the 8th gestational week, while the last one begins to be noticeable at the 10th ~ 12th gestational week. These values are only calculated per gestational week, and will not change for any other smaller time measurement
      // REVIEW - There will be 3 stages of growth to note; from week 8 till week 13, week 13 till week 27 and week 27 till week 40. The first would be a simple formula, the second will average around ~60/61 (closer to 61) grams per week and from week 27, it enters overdrive (190~202 grams per week). For Height, it will be somewhat similar in the sense that the first stage will be very slow, but the second stage will be faster WHILE third stages would be a bit slower (but still faster than the first)
      // TODO - Add drugs and conditions that can also affect these.
      const gestationalWeekAfterWhichMeasurementsStart = 8;
      const fetalGestationalWeek = getGestationalWeek(targetFetus, targetWomb);
      let newWeight = targetFetus.weight;
      let newHeight = targetFetus.height;
      let amnioticFluidVolume = targetFetus.amnioticFluidVolume;

      // TODO - Add little variations to newWeight and newHeight based off the fetus's id
      if (fetalGestationalWeek > GestationalWeek.Eight) {
        // SECTION - 1st stage of growth
        if (fetalGestationalWeek <= GestationalWeek.Thirteen) {
          // WEIGHT. fetalGestationalWeek * gNumOfGestationalWeeks will give a whole integer that represents the week e.g 8, 1, 23, etc
          newWeight +=
            fetalGestationalWeek * gNumOfGestationalWeeks -
            gestationalWeekAfterWhichMeasurementsStart +
            1;

          // HEIGHT. Todo
          newHeight +=
            fetalGestationalWeek * gNumOfGestationalWeeks -
            gestationalWeekAfterWhichMeasurementsStart +
            either(-0.25, 0, 0.25);
        }
        // SECTION - 2nd stage of growth
        else if (fetalGestationalWeek <= GestationalWeek.TwentySeven) {
          // WEIGHT
          newWeight += either(
            60,
            60,
            60.5,
            60.5,
            60.5,
            61,
            61,
            61,
            61,
            61,
            61,
            61,
            61
          );

          // HEIGHT
          newHeight += either(
            2,
            2,
            2,
            2,
            2,
            2.05,
            2.075,
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.1
          );
        }
        // SECTION - 3rd stage of growth
        else if (fetalGestationalWeek <= GestationalWeek.Forty) {
          // WEIGHT
          newWeight += either(
            189,
            190,
            193,
            194,
            195,
            198,
            199,
            199,
            199,
            199,
            200,
            201,
            202
          );

          // HEIGHT
          newHeight += either(
            0.9,
            1,
            1,
            1,
            1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.1,
            1.15,
            1.15,
            1.15
          );
        }
        // SECTION - Overdue
        else {
          // NOTE - This is just extra, continue with the previous stage's growth although a tad smaller
          // WEIGHT
          newWeight += either(
            159,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171
          );

          // HEIGHT
          newHeight += either(
            0.3,
            0.3,
            0.3,
            0.3,
            0.35,
            0.35,
            0.35,
            0.4,
            0.4,
            0.45,
            0.45,
            0.5,
            0.55
          );
        }

        // SECTION - Using the fetus's id to alter the stats a bit
        const bitCheck = (targetFetus.id & (1 << random(0, 15))) !== 0; // Randomly pick the index of a bit and check if it's true
        const bitCheck2 = (targetFetus.id & (1 << random(0, 15))) !== 0; // Do it again :3

        // WEIGHT
        const minWeightBonusOrReduction = 0;
        const maxWeightBonusOrReduction = random(5, 10);
        let randomWeightBonusOrReduction = Math.clamp(
          0.1 * newWeight,
          minWeightBonusOrReduction,
          maxWeightBonusOrReduction
        );

        // HEIGHT
        const minHeightBonusOrReduction = 0;
        const maxHeightBonusOrReduction = parseFloat(
          Math.clamp(Math.random(), 0.15, 0.65).toFixed(2)
        );
        let randomHeightBonusOrReduction = Math.clamp(
          0.005 * newHeight,
          minHeightBonusOrReduction,
          maxHeightBonusOrReduction
        );

        if (bitCheck) newWeight += randomWeightBonusOrReduction;
        else newWeight -= randomWeightBonusOrReduction;

        if (bitCheck2) newHeight += randomHeightBonusOrReduction;
        else newHeight -= randomHeightBonusOrReduction;
      }

      // SECTION - Update relevant values abt the fetus. Make sure that the values don't reduce
      targetFetus.developmentRatio =
        targetFetus.developmentRatio < newDevelopmentRatio
          ? newDevelopmentRatio
          : targetFetus.developmentRatio;
      targetFetus.weight =
        targetFetus.weight < newWeight ? newWeight : targetFetus.weight;
      targetFetus.height =
        targetFetus.height < newHeight ? newHeight : targetFetus.height;
    }
  }
};
