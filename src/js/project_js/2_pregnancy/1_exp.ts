/* How should the womb exp system work?
- The awarded exp increases depending on the fetal development and number
- Exp is only awarded every gHoursBetweenPregUpdate as long as the PC is expecting
- A huge chunk of the exp (40%) is awarded at birth depending on the size and number of fetuses (i think this implies that the exp gained during pregnancy would be relatively small)
- updateWombExp shouldn't grant more exp if it was called more often
- On average, it'd take (2*LVL + Math.floor(LVL/2)) full term singleton pregnancies to gain enough exp to reach the next level (i.e 2 from LVL_1 to LVL_2, 5 from LVL_2 to LVL_3, 7 from LVL_3 to LVL_4, 10 from LVL_4 to LVL_5)
- Each singleton full-term, non-overdue pregnancy gives about a 1000exp without bonuses
 */

// TODO - Remember to add exp in the birth function
// NOTE - If this isn't run as frequently as in `gHoursBetweenPregUpdate`, the gained exp may be smaller than expected
const updateWombExp = (womb: Womb) => {
  let expToAdd = 0;
  const wombLvl = getWombLvl(womb);

  if (wombLvl == gMaxWombLevel) {
    // At max lvl, return no exp
    return 0;
  }

  if (!womb.lastExpUpdate) {
    // Just set it to something that'll work
    womb.lastExpUpdate = womb.lastFertilized;
  }

  if (
    variables().gameDateAndTime.getTime() - womb.lastExpUpdate.getTime() <
    gHoursBetweenPregUpdate * 3600 * 1000
  ) {
    // Not enough time has passed before calling this function
    return 0;
  }

  // 1000 exp = 1 single pregnancy and 400 exp = birth
  // 600 exp = 10 gestational months or gDefaultPregnancyLength/gActualPregnancyLength
  // if 600/10 exp = 10/10 gest. months then
  // ??? exp = 600 * (gHoursBetweenPregUpdate * 3600)/gActualPregnancyLength
  // We're only getting a max of 92.05% >~<

  // SECTION - Actual exp stuff
  const averageExpGain =
    (gExpPerSingleFetusGestation * (gHoursBetweenPregUpdate * 3600)) /
    gActualPregnancyLength;

  for (let i = 0; i < womb.fetusData.size; i++) {
    // Calculate the exp for each fetus separately. Each fetus can produce up to 1000 exp in total at term (with 40% only give on birth so its actually 600 exp). Going overdue will add an extra 20% to the regular exp gain the fetus will provide
    const fetus = womb.fetusData.get(i);

    // Make it so that exp starts off really small (x0.1) and then is much more abundant(x10) with greater development
    expToAdd =
      fetus.developmentRatio * (10 / gMaxDevelopmentState) * averageExpGain;
  }

  console.log(
    `womb exp limit: ${getWombExpLimit(wombLvl)}, wombLvl: ${wombLvl}`
  );

  // Just let the player keep the exp
  // // If not pregnant, reduce the exp depending on how it has been since the character was last pregnant
  // if (!isPregnant(womb)) {
  //   expToAdd = 0;
  //   let timeSinceLastPregnancy = 0; // in seconds

  //   if (womb.lastBirth.getTime())
  //     timeSinceLastPregnancy = Math.floor(
  //       (variables().gameDateAndTime.getTime() - womb.lastBirth.getTime()) /
  //         1000
  //     );

  //   const timeSinceLastPregnancyInDays = timeSinceLastPregnancy / 86400;

  //   expToAdd -= timeSinceLastPregnancyInDays * getWombExpLimit(wombLvl) * 0.01;
  // }
  console.log(`expToAdd: ${expToAdd}`);

  womb.lastExpUpdate = variables().gameDateAndTime;

  return expToAdd;
};
