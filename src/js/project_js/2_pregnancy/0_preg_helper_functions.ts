const generateFetusId = (womb: Womb) => {
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

const getTrimesterDuration = (
  fetus: FetusData,
  trimester: Trimesters,
  womb: Womb
) => {
  switch (trimester) {
    case Trimesters.First:
    case Trimesters.Third:
      return getTotalGestationDuration(fetus, womb) * 0.33;
    case Trimesters.Second:
      return getTotalGestationDuration(fetus, womb) * 0.34;
    default:
      break;
  }
};

// Give it the fetus and any trimester and it'll return the completed time in seconds
const getProgressInGivenTrimester = (
  fetus: FetusData,
  trimester: Trimesters,
  womb: Womb
) => {
  let trimesterProgress = 0;
  const trimesterDuration = getTrimesterDuration(fetus, trimester, womb);
  const minimumDuration = 0; // 0 seconds

  switch (trimester) {
    case Trimesters.First:
      // If the first trimester has already been completed, I don't want a result greater than the trimester's duration

      trimesterProgress = Math.clamp(
        (fetus.developmentRatio / gFirstTrimesterState) * trimesterDuration,
        minimumDuration,
        trimesterDuration
      );

      break;

    case Trimesters.Second:
      // Remove the progress from the first trimester to not affect the calculation
      trimesterProgress = Math.clamp(
        ((fetus.developmentRatio - gFirstTrimesterState) /
          (gSecondTrimesterState - gFirstTrimesterState)) *
          trimesterDuration,
        minimumDuration,
        trimesterDuration
      );

      break;

    case Trimesters.Third:
      // Remove the progress from the first and second trimester to not affect the calculation
      trimesterProgress = Math.clamp(
        ((fetus.developmentRatio - gSecondTrimesterState) /
          (gThirdTrimesterState - gSecondTrimesterState)) *
          trimesterDuration,
        minimumDuration,
        trimesterDuration
      );

      break;

    default:
      break;
  }

  return trimesterProgress;
};

// Returns in seconds(s). If the `womb` parameter is provided, check for genetic conditions
const getTotalGestationDuration = (fetus: FetusData, womb: Womb) => {
  // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
  const normalGestationDuration = 26280028.8 / fetus.growthRate;
  let effectiveGestationDuration = normalGestationDuration;

  // SECTION - Determine the actual pregnancy duration by factoring genetic conditions, drugs, growthRate, etc
  // if (womb) {
  // TODO

  if (womb.belongToPlayer) {
    // x10 faster pregnancies for the player
    effectiveGestationDuration /= 10;
  }
  // }

  return effectiveGestationDuration;
};

// Gets the time in seconds that have elapsed since gestation began
const getGestationDurationElapsed = (fetus: FetusData, womb: Womb) => {
  // Since the different trimesters have different rates at which fetal development will progress, I can't calculate straight off the bat

  // Find out the current trimester
  const trimester = getCurrentTrimester(fetus);

  // While each trimester has different rates of growth, they all consume 33% of the total gestation time (except the 2nd, its 34%)
  // Then, compare the current development progress with the current trimester
  let trimesterDuration = getTrimesterDuration(fetus, trimester, womb);
  let trimesterDurationConsumed = getProgressInGivenTrimester(
    fetus,
    trimester,
    womb
  ); // This is the time that has actually been spent in the trimester
  let gestationTimeConsumed = 0; // This is the sum of `trimesterDurationConsumed` and the time from the other trimesters (if any)

  switch (trimester) {
    case Trimesters.First:
      gestationTimeConsumed = trimesterDurationConsumed;
      break;

    case Trimesters.Second:
      // Add back the the time it took to complete the first trimester
      gestationTimeConsumed = trimesterDurationConsumed + trimesterDuration;
      break;

    case Trimesters.Third:
      // Add back the the time it took to complete the first and second trimester
      gestationTimeConsumed =
        trimesterDurationConsumed +
        trimesterDuration +
        getTrimesterDuration(fetus, Trimesters.Second, womb);
      break;

    default:
      break;
  }

  // This might not be completely accurate but I think it'll do for now
  return gestationTimeConsumed;
};

const getGestationalWeek = (fetus: FetusData, womb: Womb) => {
  const gestationalRange =
    getGestationDurationElapsed(fetus, womb) /
    getTotalGestationDuration(fetus, womb);

  for (const value of Object.values(GestationalWeek)) {
    if (parseInt(value as string) < gestationalRange) {
      continue;
    } else {
      // It just found the gestational week
      return parseInt(value as string);
    }
  }

  // Character is overdue

  return PregnancyState.OVERDUE;
};
