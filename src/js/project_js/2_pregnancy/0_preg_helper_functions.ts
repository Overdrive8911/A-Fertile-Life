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
    0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1, 1, 1, 1, 1.005, 1.01, 1.015,
    1.02, 1.025, 1.03, 1.035,
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
  let fetus: FetusData = {
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

  return fetus;
};

const isPregnant = (womb: Womb) => {
  // There is at least one fetus
  if (womb.fetusData.size > 0) return true;
  else return false;
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

    averageStatDiffInLastFourWeeksOfPregnancy +=
      gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex][`${stat}`] -
      gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex][
        `${stat}`
      ];
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

  return (
    gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX][`${stat}`] +
    overdueStatDiffToAdd
  );
};

const getAccurateFetalStatForDevelopmentStage = (
  devRatio: DevelopmentRatio,
  stat: FetalGrowthStatsEnum
) => {
  let fetalStat = 0;

  const gestationalWeek: GestationalWeek =
    (devRatio / gMaxDevelopmentState) * gNumOfGestationalWeeks;

  const gestationalWeekFloor: GestationalWeek = Math.floor(gestationalWeek);

  // Need a better name for this
  const extraWeekDuration = gestationalWeek - gestationalWeekFloor;

  if (gestationalWeek < GestationalWeek.One) {
    return 0;
  } else if (
    gestationalWeek < gNumOfGestationalWeeks &&
    gestationalWeek + 1 < gNumOfGestationalWeeks
  ) {
    fetalStat =
      gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`] +
      (gFetalGrowthOverGestationalWeeks[
        (gestationalWeekFloor + 1) as GestationalWeek
      ][`${stat}`] -
        gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`]) *
        extraWeekDuration;
  } else if (
    gestationalWeek <= gNumOfGestationalWeeks &&
    gestationalWeek + 1 > gNumOfGestationalWeeks
  ) {
    fetalStat =
      gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`] +
      (getStatForGestationalWeekInOverduePregnancy(
        gestationalWeekFloor + 1,
        stat
      ) -
        gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][`${stat}`]) *
        extraWeekDuration;
  } else {
    fetalStat =
      getStatForGestationalWeekInOverduePregnancy(gestationalWeekFloor, stat) +
      (getStatForGestationalWeekInOverduePregnancy(
        gestationalWeekFloor + 1,
        stat
      ) -
        getStatForGestationalWeekInOverduePregnancy(
          gestationalWeekFloor,
          stat
        )) *
        extraWeekDuration;
  }
  console.log(
    `devRatio: ${devRatio}, gestationalWeek: ${gestationalWeekFloor}, fetalStat: ${fetalStat}`
  );

  return fetalStat;
};

// Give it 2 development ratios (with the 2nd one always being larger) and the required stat, and then it'll return how much of that particular stat should be increased
// NOTE - What this function basically does is (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) which will usually give non-integer values. When Math.floor()'d, it gives up the most recent gestational week and we can pick a stat from there (call this value X). However, in order to be truly accurate, we also consider the truncated non-integer component of (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) by having the truncated value be subtracted from the regular result of that expression (e.g 7.8673029 - 7) and multiply this result with the difference of the required stats for the gestational week in use and the next one (e.g gestational week 7 and gestational week 8. Also call this value Y). Now, adding X and Y should give something quite accurate, so do this for both development ratios and return the difference between their values.
const getStatToAddAfterDevelopmentProgress = (
  oldDevRatio: DevelopmentRatio,
  newDevRatio: DevelopmentRatio,
  stat: FetalGrowthStatsEnum
) => {
  if (oldDevRatio == newDevRatio) return 0;
  let oldStat = 0;
  let newStat = 0;

  oldStat = getAccurateFetalStatForDevelopmentStage(oldDevRatio, stat);
  newStat = getAccurateFetalStatForDevelopmentStage(newDevRatio, stat);

  return newStat - oldStat;
};

// Gets the sum of either the height, weight and amniotic volume of the fetuses in the womb. Returns 0 if it can't find any offspring
const getTotalOfFetalStats = (womb: Womb, stat: FetalGrowthStatsEnum) => {
  let sumOfFetalStats = 0;

  for (let i = 0; i < womb.fetusData.size; i++) {
    sumOfFetalStats += womb.fetusData.get(i)[`${stat}`];
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
  // Don't allow negative values
  if ((womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY < WombHealth.RIP) {
    womb.hp = WombHealth.RIP;
    return 0;
  }
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

// Every gHoursBetweenPregUpdate, the womb will heal by this much depending on how much hp it already had
const gradualWombHealthIncreaser = (womb: Womb) => {
  // Don't allow too large values
  if (womb.hp > womb.maxHp) {
    womb.hp = womb.maxHp;
    return 0;
  }

  const hpRatio = (womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY;
  if (hpRatio >= WombHealth.VERY_HEALTHY) {
    return 5;
  } else if (
    hpRatio > WombHealth.VERY_HEALTHY &&
    hpRatio >= WombHealth.HEALTHY
  ) {
    return 4;
  } else if (hpRatio > WombHealth.HEALTHY && hpRatio >= WombHealth.MEDIOCRE) {
    return 3;
  } else if (hpRatio > WombHealth.MEDIOCRE && hpRatio >= WombHealth.POOR) {
    return 2;
  } else if (hpRatio > WombHealth.POOR && hpRatio >= WombHealth.VERY_POOR) {
    return 1;
  }

  return 0.5;
};

// Get's the lvl of the womb using its max exp limit. Returns a number between 1 and 15 inclusive
const getWombLvl = (womb: Womb) => {
  // Fill up an intermediary array with all the levels in WombExpLimit, while ignoring any member with a negative value
  let wombExpLimitArray = Object.values(WombExpLimit).filter(
    (value) => typeof value == "number" && (value as number) >= 0
  ) as number[];
  console.log(WombExpLimit);

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
  return WombExpLimit.NOT_AVAILABLE;
};

// Give it the level and it'll return the appropriate exp cap
const getWombExpLimit = (lvl: number) => {
  if (lvl < gMinWombLevel) lvl = gMinWombLevel;
  if (lvl > gMaxWombLevel) lvl = gMaxWombLevel;

  if (lvl == gMaxWombLevel) {
    return WombExpLimit.NOT_AVAILABLE;
  }

  const lvlMember = `LVL_${lvl + 1}` as any;

  // The members of WombExpLimit include LVL_1, LVL_2, LVL_3, etc
  return WombExpLimit[lvlMember] as unknown as WombExpLimit;
};
