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

const generateFetus = (id: number) => {
  // A value of 1 produces "normal" growth
  const growthRateValues = [
    0.97, 0.97, 0.97, 0.975, 0.975, 1, 1, 1, 1, 1, 1.03, 1.03, 1.03, 1.035,
    1.035,
  ];

  const gender = id << id % 16 ? "M" : "F";
  const growthRate = growthRateValues[id % growthRateValues.length];
  const developmentRatio = gMinDevelopmentState;
  // Just trying to get an arbitrarily small number
  const height = id / Math.pow(10, 9);
  const weight = id / Math.pow(10, 9);
  const amnioticFluidVolume = id / Math.pow(10, 9);
  const dateOfConception = variables().gameDateAndTime;
  const lastPregUpdate = variables().gameDateAndTime;

  const shouldBirth = false;
  const species = FetusSpecies.HUMAN;

  // Create the fetus object
  let fetus = {
    id: id,
    gender: gender,
    growthRate: growthRate,
    developmentRatio: developmentRatio,
    height: height,
    weight: weight,
    amnioticFluidVolume: amnioticFluidVolume,
    dateOfConception: dateOfConception,
    lastPregUpdate: lastPregUpdate,
    shouldBirth: shouldBirth,
    species: species,
  };

  return fetus as FetusData;
};

const isPregnant = (womb: Womb) => {
  // There is at least one fetus
  if (womb.fetusData.size > 0) return true;
  else return false;
};

// Gets the time in seconds that have elapsed since gestation began. This should not be used to determine when a pregnancy is complete
const getGestationDurationElapsed = (fetus: FetusData) => {
  return (
    (variables().gameDateAndTime.getTime() - fetus.dateOfConception.getTime()) /
    1000
  );
};

const getCurrentTrimester = (fetus: FetusData) => {
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

// If the `womb` parameter is provided, check for genetic conditions
const getPregnancyLengthModifier = (fetus: FetusData, womb?: Womb) => {
  // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
  let modifier = 1;

  // Account for the fetus's growth rate
  modifier /= fetus.growthRate;

  // SECTION - Determine the actual pregnancy duration by factoring genetic conditions, drugs, growthRate, etc
  // if (womb) {
  // TODO

  if (womb.belongToPlayer) {
    // x10 faster pregnancies for the player
    modifier /= 10;
  }
  // }

  return modifier;
};

// Returns in seconds(s).
const getTotalGestationDuration = (fetus: FetusData, womb?: Womb) => {
  return getPregnancyLengthModifier(fetus, womb) * gDefaultPregnancyLength;
};

const getGestationalWeek = (fetus: FetusData, womb: Womb): GestationalWeek => {
  return Math.floor(
    (fetus.developmentRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks
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
    const gestationalWeekArrayIndex: GestationalWeek = GestationalWeek.MAX - i;
    const precedingGestationalWeekArrayIndex: GestationalWeek =
      GestationalWeek.MAX - (i + 1);

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
    (overdueGestWeek - GestationalWeek.MAX);

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

// Pass 2 gestational weeks and the stat required (e.g height, weight, amnioticFluidProduced) and it will return the difference with the stat of the gestational weeks (that is, per the number of hours specified in gHoursBetweenPregUpdate). If the optional parameter `timeDiff` (it's value is in seconds) is supplied, it will be used to calculate the number of times the result should be multiplied
const getStatDiffBetweenTwoGestationalWeeksDependingOnPregUpdatePeriod = (
  previousGestationalWeek: GestationalWeek,
  newGestationalWeek: GestationalWeek,
  stat: FetalGrowthStatsEnum,
  timeDiff: number,
  pregLengthModifier: number
) => {
  let currentStat: number = null;
  let previousWeekStat: number = null;
  if (timeDiff == undefined) timeDiff = 3600 * gHoursBetweenPregUpdate; // So it won't give me a NaN issue

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

  console.log(
    `currentStat: ${currentStat} previousStat: ${previousWeekStat}, statDiff: ${
      currentStat - previousWeekStat
    }, actualTimeDiff: ${timeDiff}, calculatedTimeDiff: ${Math.floor(
      timeDiff / (3600 * gHoursBetweenPregUpdate * pregLengthModifier)
    )}`
  );

  // If this is 0, the return formula will give us a NaN in some cases
  const weekDiff =
    newGestationalWeek - previousGestationalWeek > 0
      ? newGestationalWeek - previousGestationalWeek
      : 1;

  return (
    ((((currentStat - previousWeekStat) / gNumOfHoursInAWeek) *
      gHoursBetweenPregUpdate) /
      weekDiff) *
    Math.floor(timeDiff / (3600 * gHoursBetweenPregUpdate * pregLengthModifier)) // The 3600 here is to convert the `timeDiff` to hours
  );
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

    // Round it
    const gestationalWeeks = Math.round(
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

// Get's the lvl of the womb using its max exp limit. Returns a number between 1 and 15 inclusive
const getWombLvl = (womb: Womb) => {
  // Fill up an intermediary array with all the levels in WombExpLimit, while ignoring any member with a negative value
  let wombExpLimitArray = Object.values(WombExpLimit).filter(
    (value) =>
      typeof value == typeof WombExpLimit && (value as WombExpLimit) >= 0
  ) as WombExpLimit[];

  // Remove duplicates by converting to a Set and then back to an array
  wombExpLimitArray = [...new Set(wombExpLimitArray)];

  for (let i = 1; i < wombExpLimitArray.length; i++) {
    const expLimit = wombExpLimitArray[i];
    const previousExpLimit = wombExpLimitArray[i - 1];

    if (expLimit > womb.exp && previousExpLimit <= womb.exp) return i;
    else if (womb.exp >= WombExpLimit.LVL_MAX) {
      // The user's womb is at or above the max level and the iteration has ended on the highest possible level
      return wombExpLimitArray[i];
    }
  }

  // For some reason, the lvl is unavailable
  return WombExpLimit.LVL_NOT_AVAILABLE;
};

// Give it the level and it'll return the appropriate exp cap
const getWombExpLimit = (lvl: number) => {
  if (lvl < gMinWombLevel) lvl = gMinWombLevel;
  if (lvl > gMaxWombLevel) lvl = gMaxWombLevel;

  const lvlMember = `LVL_${lvl}` as any;

  // The members of WombExpLimit include LVL_1, LVL_2, LVL_3, etc
  return WombExpLimit[lvlMember] as unknown as WombExpLimit;
};
