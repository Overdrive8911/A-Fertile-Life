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
  const timeToTravel = Math.floor(
    (distBetweenLocations / movementSpeed) *
      randomFloat(
        NSLocation.averageWalkingSpeed[0] * 10 - 1,
        NSLocation.averageWalkingSpeed[0] * 10 + 1
      )
  );

  let extraTimeForRemainingInALocationInSeconds = 0;
  const passage1Location: string | undefined =
    NSLocation.getLocationFromPassageTitle(passageName1);
  const passage1SubLocation: string | undefined =
    NSLocation.getSubLocationFromPassageTitle(passageName1);
  const passage2Location: string | undefined =
    NSLocation.getLocationFromPassageTitle(passageName2);
  const passage2SubLocation: string | undefined =
    NSLocation.getSubLocationFromPassageTitle(passageName2);

  if (
    passage1Location &&
    passage2Location &&
    passage1Location === passage2Location &&
    (passage1SubLocation === passage2SubLocation ||
      !passage1SubLocation ||
      !passage2SubLocation)
  ) {
    // If the first and second location both exist and are the same, as well as their sub-locations regardless if either doesn't exist, then the player is still in the same location so calculate a random amount of time in seconds to spend
    extraTimeForRemainingInALocationInSeconds = random(15, 65);
  }

  // Change the in-game time
  setup.updateGameTimeVariable(
    timeToTravel + extraTimeForRemainingInALocationInSeconds
  );

  // Update the location data of the player
  if (passage2Location != undefined) {
    variables().player.locationData.location =
      NSLocation.getMapLocationIdFromLocation(passage2Location);

    if (passage2SubLocation != undefined) {
      variables().player.locationData.subLocation =
        NSLocation.getMapSubLocationIdFromSubLocation(passage2SubLocation);
    } else {
      variables().player.locationData.subLocation = null;
    }
  }
};

// Update the game time after changing location but not when the browser window is restarted/refreshed
$(document).one(":passageinit", () => {
  $(document).on(":passageinit", (incomingPassage) => {
    const currentPassageTitle = State.active.title;
    updateGameTimeAfterChangingPassage(
      currentPassageTitle,
      incomingPassage.passage.title,
      NSLocation.averageWalkingSpeed[0]
    );

    return 0;
  });
  // ev.preventDefault();
});

// Skip forward `day` times to the specified time (in hrs and minutes)
const skipSomeDaysToSpecificTime = (
  days: number,
  hours: number,
  minutes: number
) => {
  hours++;

  if (hours < 0) {
    hours = 0;
  }
  hours = hours % 24;

  if (minutes < 0) {
    minutes = 0;
  }
  minutes = minutes % 60;

  variables().gameDateAndTime = new Date(
    variables().gameDateAndTime.getFullYear(),
    variables().gameDateAndTime.getUTCMonth(),
    variables().gameDateAndTime.getUTCDate() + days,
    hours,
    minutes
  );
};

// Skip to the next day and stop at the particular hour(0 till 23) and minutes(0 till 59)
setup.skipToNextDayWithSpecificTime = (hours: number, minutes: number) => {
  skipSomeDaysToSpecificTime(1, hours, minutes);
};
