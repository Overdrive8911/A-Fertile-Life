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
const getPregnancyLengthModifier = (fetus: FetusData, womb: Womb) => {
  // NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds
  let modifier = 1;

  // Account for the fetus's growth rate
  modifier /= fetus.growthRate;

  //  Account for the womb health. Lower hp make pregnancies slightly longer
  modifier *= Math.clamp(Math.sqrt(womb.maxHp / womb.hp), 1, 1.2);

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

  let averageStatDiffInLastFourWeeksOfPregnancy = 0;
  let overdueStatDiffToAdd = 0;
  const numOfWeeksToGetAverageFor = 4;

  if (overdueGestWeek <= GestationalWeek.MAX)
    overdueGestWeek = GestationalWeek.MAX + 1;

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

// Give it 2 development ratios (with the 2nd one always being larger) and the required stat, and then it'll return how much of that particular stat should be increased
const getStatToAddAfterDevelopmentProgress = (
  oldDevRatio: DevelopmentRatio,
  newDevRatio: DevelopmentRatio,
  stat: FetalGrowthStatsEnum
) => {
  if (oldDevRatio == newDevRatio) return 0;
  let oldStat = 0;
  let newStat = 0;

  // Get the gestational weeks of each development ratio
  const oldGestWeek: GestationalWeek = Math.floor(
    (oldDevRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks
  );
  const newGestWeek: GestationalWeek = Math.floor(
    (newDevRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks
  );

  const oldGestWeekNoFloor =
    (oldDevRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks;
  const newGestWeekNoFloor =
    (newDevRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks;

  // Determine the EXACT stats at each of the development ratios
  switch (stat) {
    case FetalGrowthStatsEnum.HEIGHT:
      // For the old one
      if (oldGestWeek < GestationalWeek.One) {
        oldStat = 0;
      } else if (
        oldGestWeek >= GestationalWeek.One &&
        oldGestWeek < gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].height +
          (gFetalGrowthOverGestationalWeeks[
            (oldGestWeek + 1) as GestationalWeek
          ].height -
            gFetalGrowthOverGestationalWeeks[oldGestWeek].height) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else if (
        oldGestWeek <= gNumOfGestationalWeeks &&
        oldGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].height +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[oldGestWeek].height) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else {
        oldStat =
          getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat)) *
            (oldGestWeekNoFloor - oldGestWeek);
      }

      // For the new one
      if (newGestWeek < GestationalWeek.One) {
        newStat = 0;
      } else if (
        newGestWeek >= GestationalWeek.One &&
        newGestWeek < gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].height +
          (gFetalGrowthOverGestationalWeeks[
            (newGestWeek + 1) as GestationalWeek
          ].height -
            gFetalGrowthOverGestationalWeeks[newGestWeek].height) *
            (newGestWeekNoFloor - newGestWeek);
      } else if (
        newGestWeek <= gNumOfGestationalWeeks &&
        newGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].height +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[newGestWeek].height) *
            (newGestWeekNoFloor - newGestWeek);
      } else {
        newStat =
          getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat)) *
            (newGestWeekNoFloor - newGestWeek);
      }
      break;

    case FetalGrowthStatsEnum.WEIGHT:
      // For the old one
      if (oldGestWeek < GestationalWeek.One) {
        oldStat = 0;
      } else if (
        oldGestWeek >= GestationalWeek.One &&
        oldGestWeek < gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].weight +
          (gFetalGrowthOverGestationalWeeks[
            (oldGestWeek + 1) as GestationalWeek
          ].weight -
            gFetalGrowthOverGestationalWeeks[oldGestWeek].weight) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else if (
        oldGestWeek <= gNumOfGestationalWeeks &&
        oldGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].weight +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[oldGestWeek].weight) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else {
        oldStat =
          getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat)) *
            (oldGestWeekNoFloor - oldGestWeek);
      }

      // For the new one
      if (newGestWeek < GestationalWeek.One) {
        newStat = 0;
      } else if (
        newGestWeek >= GestationalWeek.One &&
        newGestWeek < gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].weight +
          (gFetalGrowthOverGestationalWeeks[
            (newGestWeek + 1) as GestationalWeek
          ].weight -
            gFetalGrowthOverGestationalWeeks[newGestWeek].weight) *
            (newGestWeekNoFloor - newGestWeek);
      } else if (
        newGestWeek <= gNumOfGestationalWeeks &&
        newGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].weight +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[newGestWeek].weight) *
            (newGestWeekNoFloor - newGestWeek);
      } else {
        newStat =
          getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat)) *
            (newGestWeekNoFloor - newGestWeek);
      }

      break;

    case FetalGrowthStatsEnum.AMNIOTIC_FLUID:
      // For the old one
      if (oldGestWeek < GestationalWeek.One) {
        oldStat = 0;
      } else if (
        oldGestWeek >= GestationalWeek.One &&
        oldGestWeek < gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].amnioticFluidProduced +
          (gFetalGrowthOverGestationalWeeks[
            (oldGestWeek + 1) as GestationalWeek
          ].amnioticFluidProduced -
            gFetalGrowthOverGestationalWeeks[oldGestWeek]
              .amnioticFluidProduced) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else if (
        oldGestWeek <= gNumOfGestationalWeeks &&
        oldGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        oldStat =
          gFetalGrowthOverGestationalWeeks[oldGestWeek].amnioticFluidProduced +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[oldGestWeek]
              .amnioticFluidProduced) *
            (oldGestWeekNoFloor - oldGestWeek);
      } else {
        oldStat =
          getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(oldGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(oldGestWeek, stat)) *
            (oldGestWeekNoFloor - oldGestWeek);
      }

      // For the new one
      if (newGestWeek < GestationalWeek.One) {
        newStat = 0;
      } else if (
        newGestWeek >= GestationalWeek.One &&
        newGestWeek < gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].amnioticFluidProduced +
          (gFetalGrowthOverGestationalWeeks[
            (newGestWeek + 1) as GestationalWeek
          ].amnioticFluidProduced -
            gFetalGrowthOverGestationalWeeks[newGestWeek]
              .amnioticFluidProduced) *
            (newGestWeekNoFloor - newGestWeek);
      } else if (
        newGestWeek <= gNumOfGestationalWeeks &&
        newGestWeek + 1 > gNumOfGestationalWeeks
      ) {
        newStat =
          gFetalGrowthOverGestationalWeeks[newGestWeek].amnioticFluidProduced +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            gFetalGrowthOverGestationalWeeks[newGestWeek]
              .amnioticFluidProduced) *
            (newGestWeekNoFloor - newGestWeek);
      } else {
        newStat =
          getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat) +
          (getStatForGestationalWeekInOverduePregnancy(newGestWeek + 1, stat) -
            getStatForGestationalWeekInOverduePregnancy(newGestWeek, stat)) *
            (newGestWeekNoFloor - newGestWeek);
      }

      break;

    default:
      break;
  }
  return newStat - oldStat;
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

const calculateWombDamage = (womb: Womb) => {
  if (!gIsWombDamageEnabled) return 0;
  // TODO - Consider having the weight affect this. Also superfetation

  // Get the average developmentRatio of all fetuses
  let averageDevelopmentRatio = 0;
  for (let i = 0; i < womb.fetusData.size; i++) {
    averageDevelopmentRatio += womb.fetusData.get(i).developmentRatio;
  }
  averageDevelopmentRatio /= womb.fetusData.size;

  // Every 10% progress in pregnancy has a 15% chance to subtract 0.5 womb health. This number is increased by the number of fetuses the user is pregnant with
  let timesToRunDamageCheck = Math.floor(averageDevelopmentRatio / 10);

  let wombDamage = 0;
  while (timesToRunDamageCheck > 0) {
    if (random(100) < 15) {
      wombDamage += womb.fetusData.size * 0.5;
    }
    timesToRunDamageCheck--;
  }

  return wombDamage;
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
