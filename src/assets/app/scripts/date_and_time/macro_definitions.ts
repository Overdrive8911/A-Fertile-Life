// Add a macro to deal with time changing

import { updateGameTimeVariable } from "./date_and_time_declarations";
import {
  skipSomeDaysToSpecificTime,
  skipToNextDayWithSpecificTime,
} from "./game_date_and_time_updater";

// E.g <<updateGameTime "nextDay" 7 30>> to skip to 7:30 on the next day, <<updateGameTime 21 15 21>> to skip to 3:21 pm 21 days forwards
Macro.add("updateGameTime", {
  skipArgs: false,
  handler: function () {
    const days: number | string = this.args[0];
    const hours: number = this.args[1];
    const minutes: number = this.args[2];

    if (days === "nextDay") {
      skipToNextDayWithSpecificTime(hours, minutes);
    } else if (typeof days === "number") {
      skipSomeDaysToSpecificTime(days, hours, minutes);
    }
    // Deal with errors
    else if (typeof days === "string" && days !== "nextDay") {
      return this.error("Incorrect `days` value Do you mean 'nextDay'?");
    } else if (typeof hours !== "number") {
      return this.error("Incorrect data type for `hours`");
    } else if (typeof minutes !== "number") {
      return this.error("Incorrect data type for `minutes`");
    }
  },
});

// To skip a couple of minutes/days/hours forwards or backwards instead of jumping towards a static TIME like in `updateGameTime`
// e.g <<skipTime 0 5 2>> will skip 5 hours and 2 minutes into the future, <<skipTime 0 -5 2>> will skip 5 hours backwards and then, 2 minutes forwards, <<skipTime 1 3 5>> will skip 1 day, 3 hours and 5 minutes forwards.
Macro.add("skipTime", {
  skipArgs: false,
  handler: function () {
    let days: number = this.args[0];
    let hours: number = this.args[1];
    let minutes: number = this.args[2];

    // Deal with errors
    if (typeof days !== "number") {
      return this.error("Incorrect data type for `days`");
    } else if (typeof hours !== "number") {
      return this.error("Incorrect data type for `hours`");
    } else if (typeof minutes !== "number") {
      return this.error("Incorrect data type for `minutes`");
    }

    hours++;

    hours = hours % 24;
    minutes = minutes % 60;

    // Check if the new time is okay
    let newHours = 0,
      newMinutes = 0;
    const gameDateAndTime = variables().gameDateAndTime,
      utcHours = gameDateAndTime.getUTCHours(),
      utcMinutes = gameDateAndTime.getUTCMinutes(),
      utcMonth = gameDateAndTime.getUTCMonth(),
      fullYear = gameDateAndTime.getFullYear(),
      utcDate = gameDateAndTime.getUTCDate();
    if (utcHours + hours > 23) {
      newHours += (utcHours + hours) % 24;
      days += parseInt(((utcHours + hours) / 24).toFixed(0));
    } else {
      newHours = utcHours + hours;
    }

    if (utcMinutes + minutes > 59) {
      newMinutes += (utcMinutes + minutes) % 60;
      newHours += parseInt(((utcMinutes + minutes) / 60).toFixed(0));
    } else {
      newMinutes = utcMinutes + minutes;
    }

    updateGameTimeVariable(
      new Date(fullYear, utcMonth, utcDate + days, newHours, newMinutes)
    );
  },
});
