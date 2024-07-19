const updateWombExp = (womb: Womb) => {
  let expToAdd = 0;
  const wombLvl = getWombLvl(womb);

  console.log(
    `womb exp limit: ${getWombExpLimit(wombLvl)}, wombLvl: ${wombLvl}`
  );

  // TODO - Revise this ass formula. It's very wack
  expToAdd += Math.clamp(
    (womb.curCapacity / womb.comfortCapacity) * (womb.curCapacity * wombLvl),
    0,
    (getWombExpLimit(wombLvl) + 1) * (womb.curCapacity / womb.maxCapacity)
  );

  if (womb.curCapacity > womb.comfortCapacity) {
    // Since the current capacity is greater than the comfort capacity, provide a little more exp
    expToAdd +=
      ((womb.curCapacity - womb.comfortCapacity) / womb.maxCapacity) *
      (getWombExpLimit(wombLvl) + 1);
  }

  // If not pregnant, reduce the exp depending on how it has been since the character was last pregnant
  if (!isPregnant(womb)) {
    expToAdd = 0;
    let timeSinceLastPregnancy = 0; // in seconds

    if (womb.lastBirth.getTime())
      timeSinceLastPregnancy = Math.floor(
        (variables().gameDateAndTime.getTime() - womb.lastBirth.getTime()) /
          1000
      );

    const timeSinceLastPregnancyInDays = timeSinceLastPregnancy / 86400;

    expToAdd -= timeSinceLastPregnancyInDays * getWombExpLimit(wombLvl) * 0.01;
  }
  console.log(`expToAdd: ${expToAdd}`);

  return expToAdd;
};
