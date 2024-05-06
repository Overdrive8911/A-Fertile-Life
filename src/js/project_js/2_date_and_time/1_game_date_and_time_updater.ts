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

  variables().gameTime = new Date(
    variables().gameTime.getFullYear(),
    variables().gameTime.getUTCMonth(),
    variables().gameTime.getUTCDate() + days,
    hours,
    minutes
  );
};

// Skip to the next day and stop at the particular hour(0 till 23) and minutes(0 till 59)
setup.skipToNextDayWithSpecificTime = (hours: number, minutes: number) => {
  skipSomeDaysToSpecificTime(1, hours, minutes);
};
