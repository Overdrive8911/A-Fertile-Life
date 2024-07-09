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

const isPregnant = (womb: Womb) => {
  // There is at least one fetus
  if (womb.fetusData.size > 0) return PregnancyState.PREGNANT;
  else return PregnancyState.NOT_PREGNANT;
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
  } else {
    // Overdue
    return Trimesters.Overdue;
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
    case Trimesters.Overdue:
      // Overdue pregnancies don't have a fixed duration
      return gOverduePregnancyLength;
    default:
      return null;
      break;
  }
};

// Give it the fetus and any trimester and it'll return the completed time in seconds.
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

    case Trimesters.Overdue:
      // fetus.developmentRatio will be at least 100%
      trimesterProgress =
        ((fetus.developmentRatio - gMaxDevelopmentState) /
          gMaxDevelopmentState) *
        getTotalGestationDuration(fetus, womb);

    default:
      break;
  }

  return trimesterProgress;
};

// Returns in seconds(s). If the `womb` parameter is provided, check for genetic conditions
const getTotalGestationDuration = (fetus: FetusData, womb: Womb) => {
  // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
  const normalGestationDuration = gDefaultPregnancyLength / fetus.growthRate;
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
      gestationTimeConsumed =
        trimesterDurationConsumed +
        getTrimesterDuration(fetus, Trimesters.First, womb);
      break;

    case Trimesters.Third:
      // Add back the the time it took to complete the first and second trimester
      gestationTimeConsumed =
        trimesterDurationConsumed +
        getTrimesterDuration(fetus, Trimesters.First, womb) +
        getTrimesterDuration(fetus, Trimesters.Second, womb);
      break;

    case Trimesters.Overdue:
      // Add back the the time it took to complete the first, second and third trimester
      gestationTimeConsumed =
        trimesterDurationConsumed +
        getTrimesterDuration(fetus, Trimesters.First, womb) +
        getTrimesterDuration(fetus, Trimesters.Second, womb) +
        getTrimesterDuration(fetus, Trimesters.Third, womb);
    default:
      break;
  }

  // This might not be completely accurate but I think it'll do for now
  return gestationTimeConsumed;
};

const getGestationalWeek = (fetus: FetusData, womb: Womb): GestationalWeek => {
  const gestationalRange =
    getGestationDurationElapsed(fetus, womb) /
    getTotalGestationDuration(fetus, womb);

  for (const value of Object.values(GestationalWeek)) {
    if (typeof value == "number" && value < gestationalRange) {
      continue;
    } else if (typeof value == "number") {
      // It just found the gestational week. the result will be one of the members of GestationalWeek
      return value;
    }
  }

  // Character is overdue
  const extraGestationalWeeks = getNumberOfGestationalWeeksAfterDueDate(
    fetus,
    womb
  );

  // To get a ratio similar to the ones in the enum GestationalWeek
  return (
    (gNumOfGestationalWeeks + extraGestationalWeeks) / gNumOfGestationalWeeks
  );
};

const getStatForGestationalWeekInOverduePregnancy = (
  overdueGestWeek: GestationalWeek,
  stat: FetalGrowthStatsEnum
) => {
  // Use the average stat difference (and a bit of variation) to get a result for overdue pregnancies that don't have an entry in gFetalGrowthOverGestationalWeeks[]
  // PLEASE, DON'T PASS IN A GESTATIONAL WEEK THAT ISN'T OVERDUE

  let averageStatDiffInLastFourWeeksOfPregnancy = 0;
  let overdueStatDiffToAdd = 0;
  const numOfWeeksToGetAverageFor = 4;

  // Get the average weight gain over the last 4~5 weeks
  for (let i = 0; i <= numOfWeeksToGetAverageFor; i++) {
    const gestationalWeekArrayIndex: GestationalWeek =
      GestationalWeek.MAX - i / gNumOfGestationalWeeks;
    const precedingGestationalWeekArrayIndex: GestationalWeek =
      GestationalWeek.MAX - (i + 1) / gNumOfGestationalWeeks;

    switch (stat) {
      case FetalGrowthStatsEnum.WEIGHT:
        averageStatDiffInLastFourWeeksOfPregnancy +=
          gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex].weight -
          gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex]
            .weight;

        break;

      case FetalGrowthStatsEnum.HEIGHT:
        averageStatDiffInLastFourWeeksOfPregnancy +=
          gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex].height -
          gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex]
            .height;

        break;

      case FetalGrowthStatsEnum.AMNIOTIC_FLUID:
        averageStatDiffInLastFourWeeksOfPregnancy +=
          gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex]
            .amnioticFluidProduced -
          gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex]
            .amnioticFluidProduced;

        break;

      default:
        break;
    }
  }
  averageStatDiffInLastFourWeeksOfPregnancy /= numOfWeeksToGetAverageFor;

  // Reduce it by around 66% since growth now would be much slower. This deduction is just to make things more believable
  averageStatDiffInLastFourWeeksOfPregnancy *= gOverdueStatMultiplier;

  // Multiply the average with the extra weeks that have passed while overdue
  overdueStatDiffToAdd =
    averageStatDiffInLastFourWeeksOfPregnancy *
    ((overdueGestWeek - GestationalWeek.MAX) * gNumOfGestationalWeeks);

  // Add some variation
  overdueStatDiffToAdd = random(
    overdueStatDiffToAdd - overdueStatDiffToAdd * 0.15,
    overdueStatDiffToAdd + overdueStatDiffToAdd * 0.15
  );

  switch (stat) {
    case FetalGrowthStatsEnum.WEIGHT:
      return (
        gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].weight +
        overdueStatDiffToAdd
      );

    case FetalGrowthStatsEnum.HEIGHT:
      return (
        gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX].height +
        overdueStatDiffToAdd
      );

    case FetalGrowthStatsEnum.AMNIOTIC_FLUID:
      return (
        gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX]
          .amnioticFluidProduced + overdueStatDiffToAdd
      );

    default:
      return 0;
  }
};

// Pass 2 gestational weeks and the stat required (e.g height, weight, amnioticFluidProduced) and it will return the difference with the stat of the gestational weeks
const getStatDiffBetweenTwoGestationalWeeks = (
  previousGestationalWeek: GestationalWeek,
  newGestationalWeek: GestationalWeek,
  stat: FetalGrowthStatsEnum
) => {
  let currentStat: number = null;
  let previousWeekStat: number = null;

  switch (stat) {
    case FetalGrowthStatsEnum.WEIGHT:
      if (newGestationalWeek <= GestationalWeek.MAX) {
        currentStat =
          gFetalGrowthOverGestationalWeeks[newGestationalWeek].weight;
      } else {
        // Is Overdue
        currentStat = getStatForGestationalWeekInOverduePregnancy(
          newGestationalWeek,
          FetalGrowthStatsEnum.WEIGHT
        );
      }

      if (
        previousGestationalWeek > GestationalWeek.One &&
        previousGestationalWeek <= GestationalWeek.MAX
      ) {
        previousWeekStat =
          gFetalGrowthOverGestationalWeeks[previousGestationalWeek].weight;
      } else if (previousGestationalWeek <= GestationalWeek.One) {
        // Its the first week of preg so assume the previous stat is zero
        previousWeekStat = 0;
      } else {
        // Is Overdue
        previousWeekStat = getStatForGestationalWeekInOverduePregnancy(
          previousGestationalWeek,
          FetalGrowthStatsEnum.WEIGHT
        );
      }

      break;

    case FetalGrowthStatsEnum.HEIGHT:
      if (newGestationalWeek <= GestationalWeek.MAX) {
        currentStat =
          gFetalGrowthOverGestationalWeeks[newGestationalWeek].height;
      } else {
        // Is Overdue
        currentStat = getStatForGestationalWeekInOverduePregnancy(
          newGestationalWeek,
          FetalGrowthStatsEnum.HEIGHT
        );
      }

      if (
        previousGestationalWeek > GestationalWeek.One &&
        previousGestationalWeek <= GestationalWeek.MAX
      ) {
        previousWeekStat =
          gFetalGrowthOverGestationalWeeks[previousGestationalWeek].height;
      } else if (previousGestationalWeek <= GestationalWeek.One) {
        // Its the first week of preg so assume the previous stat is zero
        previousWeekStat = 0;
      } else {
        // Is Overdue
        previousWeekStat = getStatForGestationalWeekInOverduePregnancy(
          previousGestationalWeek,
          FetalGrowthStatsEnum.HEIGHT
        );
      }

      break;

    case FetalGrowthStatsEnum.AMNIOTIC_FLUID:
      if (newGestationalWeek <= GestationalWeek.MAX) {
        currentStat =
          gFetalGrowthOverGestationalWeeks[newGestationalWeek]
            .amnioticFluidProduced;
      } else {
        // Is Overdue
        currentStat = getStatForGestationalWeekInOverduePregnancy(
          newGestationalWeek,
          FetalGrowthStatsEnum.AMNIOTIC_FLUID
        );
      }

      if (
        previousGestationalWeek > GestationalWeek.One &&
        previousGestationalWeek <= GestationalWeek.MAX
      ) {
        previousWeekStat =
          gFetalGrowthOverGestationalWeeks[previousGestationalWeek]
            .amnioticFluidProduced;
      } else if (previousGestationalWeek <= GestationalWeek.One) {
        // Its the first week of preg so assume the previous stat is zero
        previousWeekStat = 0;
      } else {
        // Is Overdue
        previousWeekStat = getStatForGestationalWeekInOverduePregnancy(
          previousGestationalWeek,
          FetalGrowthStatsEnum.AMNIOTIC_FLUID
        );
      }

      break;

    default:
      // Don't get here >~<
      break;
  }

  return currentStat - previousWeekStat;
};

const getNumberOfGestationalWeeksAfterDueDate = (
  fetus: FetusData,
  womb: Womb
) => {
  if (fetus.developmentRatio > gMaxDevelopmentState) {
    // Character is overdue
    const overdueGestationPeriod = getProgressInGivenTrimester(
      fetus,
      Trimesters.Overdue,
      womb
    );

    // Round it up
    const gestationalWeeks = Math.ceil(
      (overdueGestationPeriod / getTotalGestationDuration(fetus, womb)) *
        gNumOfGestationalWeeks
    );

    return gestationalWeeks;
  } else {
    // Not overdue
    return 0;
  }
};

// Gets the sum of either the height, weight and amniotic volume of the fetuses in the womb. Returns 0 if it can't find any offspring
const getTotalOfFetalStats = (womb: Womb, stat: FetalGrowthStatsEnum) => {
  let sumOfFetalStats = 0;

  for (let i = 0; i < womb.fetusData.size; i++) {
    switch (stat) {
      case FetalGrowthStatsEnum.WEIGHT:
        sumOfFetalStats += womb.fetusData.get(i).weight;
        break;

      case FetalGrowthStatsEnum.HEIGHT:
        sumOfFetalStats += womb.fetusData.get(i).height;
        break;

      case FetalGrowthStatsEnum.AMNIOTIC_FLUID:
        sumOfFetalStats += womb.fetusData.get(i).amnioticFluidVolume;
        break;

      default:
        break;
    }
  }

  return sumOfFetalStats;
};

// Accepts any value from the enum BellyState but will only work with members that have `FULL_TERM` appended. Returns the minimum number of full grown, non-overdue fetuses that can achieve the inputted size
const getMinimumNumOfFullTermFetusesAtBellyState = (bellyState: BellyState) => {
  if (bellyState < BellyState.FULL_TERM) return 0;

  return Math.floor(bellyState / BellyState.FULL_TERM);
};
