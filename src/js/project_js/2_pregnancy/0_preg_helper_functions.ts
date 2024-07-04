const getCurrentTrimester = (fetus: FetusData) => {
  // Since the growth progress for the trimesters are in a ratio 3:5:4, we can use the `developmentRatio` to determine the current trimester since it has a max of 100 (%)

  const growthProgress = fetus.developmentRatio;

  if (growthProgress <= gFirstTrimesterState) {
    return Trimesters.First;
  } else if (
    growthProgress > gFirstTrimesterState &&
    growthProgress <= gSecondTrimesterState
  ) {
    return Trimesters.Second;
  } else if (
    growthProgress > gSecondTrimesterState &&
    growthProgress <= gThirdTrimesterState
  ) {
    return Trimesters.Third;
  }
};

const getTotalGestationDuration = (fetus: FetusData) => {
  // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8/26,300,000 seconds) of gestation while one of ~10 would mean roughly 1 (26,280,02.88/2,630,000) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
  return 26280028.8 / fetus.growthRate;
};

const getRemainingGestationDuration = (fetus: FetusData) => {
  // Since the different trimesters have different rates at which fetal development will progress, I can't calculate straight off the bat

  // Find out the current trimester
  const trimester = getCurrentTrimester(fetus);

  // While each trimester has different rates of growth, they all consume 33% of the total gestation time (except the 2nd, its 34%)
  // Then, compare the current development progress with the current trimester
  let trimesterDuration = 0;
  let trimesterDurationConsumed = 0; // This is the time that has actually been spent in the trimester
  let gestationTimeConsumed = 0; // This is the sum of `trimesterDurationConsumed` and the time from the other trimesters (if any)
  switch (trimester) {
    case Trimesters.First:
      trimesterDuration = getTotalGestationDuration(fetus) * 0.33;

      trimesterDurationConsumed =
        (fetus.developmentRatio / gFirstTrimesterState) * trimesterDuration;

      gestationTimeConsumed = trimesterDurationConsumed;
      break;

    case Trimesters.Second:
      trimesterDuration = getTotalGestationDuration(fetus) * 0.34;

      // Remove the progress from the first trimester to not affect the calculation
      trimesterDurationConsumed =
        ((fetus.developmentRatio - gFirstTrimesterState) /
          (gSecondTrimesterState - gFirstTrimesterState)) *
        trimesterDuration;

      // Add back the the time it took to complete the first trimester
      gestationTimeConsumed = trimesterDurationConsumed + trimesterDuration;
      break;

    case Trimesters.Third:
      trimesterDuration = getTotalGestationDuration(fetus) * 0.33;

      // Remove the progress from the first and second trimester to not affect the calculation
      trimesterDurationConsumed =
        ((fetus.developmentRatio - gSecondTrimesterState) /
          (gThirdTrimesterState - gSecondTrimesterState)) *
        trimesterDuration;

      // Add back the the time it took to complete the first and second trimester
      gestationTimeConsumed =
        trimesterDurationConsumed +
        trimesterDuration +
        getTotalGestationDuration(fetus) * 0.34;
      break;

    default:
      break;
  }

  // This might not be completely accurate but I think it'll do for now
  return getTotalGestationDuration(fetus) - gestationTimeConsumed;
};
