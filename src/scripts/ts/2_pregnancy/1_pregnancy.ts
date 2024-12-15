namespace NSPregnancy {
  // `updatePregnancyGrowth` is run here
  $(document).on(":passagerender", (incomingPassage) => {
    // This just basically means that the following should run if both the current and incoming passage have the word "location_" (which mean's they're valid locations, not passages used for inventories and other game stuff) in their tags time has passed since the last update
    const playerWomb = variables().player.womb;
    const passedTimeAfterLastUpdate =
      variables().gameDateAndTime.getTime() -
      (playerWomb.lastPregUpdate
        ? playerWomb.lastPregUpdate.getTime()
        : playerWomb.lastFertilized
        ? playerWomb.lastFertilized.getTime()
        : variables().gameDateAndTime.getTime());
    if (
      getLocationFromPassageTitle(State.active.title) &&
      getLocationFromPassageTitle(incomingPassage.passage.title) &&
      passedTimeAfterLastUpdate
    ) {
      playerWomb.updatePregnancyGrowth();
      playerWomb.addHp(playerWomb.gradualWombHealthIncreaser());

      if (playerWomb.isLiableForBirth) playerWomb.triggerBirth();

      if (!playerWomb.isPregnant && playerWomb.isPostPartum) {
        playerWomb.postpartumCounter -= passedTimeAfterLastUpdate / 1000;
      }
    }
  });
}
