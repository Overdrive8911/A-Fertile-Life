const updatePregnantBellySize = (womb: Womb) => {
  const totalFetalWeight = getTotalOfFetalStats(
    womb,
    FetalGrowthStatsEnum.WEIGHT
  );
  const totalFetalHeight = getTotalOfFetalStats(
    womb,
    FetalGrowthStatsEnum.HEIGHT
  );
  const totalFetalFluid = getTotalOfFetalStats(
    womb,
    FetalGrowthStatsEnum.AMNIOTIC_FLUID
  );

  // Update the size of the womb
  womb.curCapacity = getWombVolumeFromFetusStats(
    totalFetalHeight,
    totalFetalWeight,
    totalFetalFluid
  );
};

// Returns the an index in BellyState to get a rough idea of the size range the character's belly is in
const getPregnantBellySize = (womb: Womb): BellyState => {
  // Copy over the actual numbers from the enum
  const bellySizeArray = Object.values(BellyState).filter(
    (value) => typeof value == typeof BellyState
  ) as BellyState[];

  // Loop 👍
  for (let index = 1; index < bellySizeArray.length; index++) {
    const size = bellySizeArray[index];
    const previousSize = bellySizeArray[index - 1];

    if (size > womb.curCapacity && previousSize <= womb.curCapacity) {
      // In the range for the previous size, so return that
      return previousSize;
    }
  }

  // Size is out of bounds so default to the largest belly state
  return BellyState.PREG_MAX;
};
