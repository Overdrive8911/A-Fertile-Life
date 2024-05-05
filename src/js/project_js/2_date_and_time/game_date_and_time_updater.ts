// Run this in a ":passagedisplay" event
const updateGameTimeAfterChangingPassage = (
  passageName1: string,
  passageName2: string,
  movementSpeed: number /* in metres per second*/
) => {
  // Get the distance in metres
  const distBetweenLocations = setup.getDistanceToTravelFromLocation(
    passageName1,
    passageName2
  );

  // Get the time to travel in seconds
  const timeToTravel = Math.floor(distBetweenLocations / movementSpeed);

  // Change the in-game time
  setup.updateGameTimeVariable(timeToTravel);
};

// Update the game time after changing location but not when the browser window is restarted/refreshed
$(document).one(":passageinit", () => {
  $(document).on(":passageinit", (incomingPassage) => {
    const currentPassageTitle = State.active.title;
    updateGameTimeAfterChangingPassage(
      currentPassageTitle,
      incomingPassage.passage.title,
      averageWalkingSpeed[0]
    );

    return 0;
  });
  // ev.preventDefault();
});
