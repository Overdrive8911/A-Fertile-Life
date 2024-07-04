// `updatePregnancyGrowth` is run here
$("html").on(":passageend", () => {
  updatePregnancyGrowth(variables().player.womb);
});

// This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
// REVIEW - We need to do 5 things; generating the appropriate height, weight, and amnioticFluidProduced by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
const updatePregnancyGrowth = (targetWomb: Womb) => {
  // The target is pregnant so do everything required under here
  if (targetWomb.curCapacity > 0) {
    const currentTime = variables().gameDateAndTime;

    for (let i = 0; i < targetWomb.fetusData.size; i++) {
      // Determine how much to progress the fetus since the last update

      // Get the time elapsed in seconds
      const timeElapsedSinceLastPregUpdate =
        currentTime.getTime() -
        targetWomb.fetusData.get(i).lastPregUpdate.getTime();

      // Use the growth rate to calculate the amount of `developmentRatio` to complete
      // NOTE - The growth progress in between the trimesters will be shared in a 3:5:4 ratio. Each trimester will have 1/3 of the total gestation duration for that particular growth
    }
  }
};
