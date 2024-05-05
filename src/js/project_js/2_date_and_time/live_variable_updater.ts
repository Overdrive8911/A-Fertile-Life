// setup.locations is found in "location_data.twee"

setup.updateGameTimeDisplay = () => {
  if (variables().gameTime !== undefined) {
    // Get the time in hours for the day
    const gameTimeDayHours: number = variables().gameTime!.getUTCHours();
    // Get the time in minutes for the hour
    const gameTimeDayMinutes: number = variables().gameTime!.getUTCMinutes();

    if (gameTimeDayHours < 12) {
      // AM
      const gameTimeDayHoursFormatted: string = gameTimeDayHours.toLocaleString(
        undefined,
        { minimumIntegerDigits: 2, useGrouping: false }
      );
      const gameTimeDayMinutesFormatted: string =
        gameTimeDayMinutes.toLocaleString(undefined, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

      variables().gameTimeDisplay = `${gameTimeDayHoursFormatted}:${gameTimeDayMinutesFormatted} AM`;
    } else {
      // PM
      const gameTimeDayHoursFormatted: string = (
        gameTimeDayHours - 12
      ).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      const gameTimeDayMinutesFormatted: string =
        gameTimeDayMinutes.toLocaleString(undefined, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

      variables().gameTimeDisplay = `${gameTimeDayHoursFormatted}:${gameTimeDayMinutesFormatted} PM`;
    }

    // Update the time since its wrapped in a <<live>> macro
    $(document).trigger(":liveupdate");

    // console.log(variables().gameTimeDisplay);
    // console.log(variables().gameTime);
  }
};

// Update the time whenever the player moves to a another passage
$(document).on(":passagedisplay", () => {
  setup.updateGameTimeDisplay();
});

// Update the time every 30s irl (note that it's still using the game time)
setInterval(() => {
  setup.updateGameTimeDisplay();
}, 30000);
