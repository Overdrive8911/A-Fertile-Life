namespace NSPregnancy {
  // `updatePregnancyGrowth` is run here
  $(document).on(":passagerender", (incomingPassage) => {
    // THis just basically means that the following should run if both the current and incoming passage have the word "location_" in their tags and at least the number of hours in `gHoursBetweenPregUpdate` have been passed since the last update
    if (
      NSLocation.getLocationFromPassageTitle(State.active.title) &&
      NSLocation.getLocationFromPassageTitle(incomingPassage.passage.title) &&
      variables().gameDateAndTime.getTime() -
        variables().lastPregUpdateFunctionCall.getTime() >=
        gHoursBetweenPregUpdate * 3600 * 1000
    ) {
      const playerWomb = variables().player.womb;

      playerWomb.updatePregnancyGrowth();
      playerWomb.gradualWombHealthIncreaser();

      if (playerWomb.isLiableForBirth) playerWomb.triggerBirth();
    }
  });
}
