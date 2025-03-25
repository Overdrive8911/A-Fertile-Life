import { listenToCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";

const updateGameTimeDisplay = () => {
  if (variables().gameDateAndTime == undefined)
    variables().gameDateAndTime = new Date(Date.UTC(2021, 1, 3, 20));

  // Update game date variable
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const gameDateAndTime = variables().gameDateAndTime;
  // Get the day (e.g Monday)
  const gameDateAndTime_Day = days[gameDateAndTime.getUTCDay()];

  // Get the date (e.g 1st)
  const gameDateAndTime_Date = gameDateAndTime.getUTCDate();

  // Get the month
  const gameDateAndTime_Month = months[gameDateAndTime.getUTCMonth()];

  // Put the string in the variable
  variables().gameDateDisplay = `${gameDateAndTime_Day}, ${gameDateAndTime_Date} ${gameDateAndTime_Month}`;

  // Update game Time variable
  // Get the time in hours for the day
  const gameDateAndTime_DayHours: number = gameDateAndTime.getUTCHours();
  // Get the time in minutes for the hour
  const gameDateAndTime_DayMinutes: number = gameDateAndTime.getUTCMinutes();

  if (gameDateAndTime_DayHours < 12) {
    // AM
    const gameDateAndTime_DayHoursFormatted: string =
      gameDateAndTime_DayHours === 0
        ? (12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : gameDateAndTime_DayHours.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
    const gameDateAndTime_DayMinutesFormatted: string =
      gameDateAndTime_DayMinutes.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

    variables().gameTimeDisplay = `${gameDateAndTime_DayHoursFormatted}:${gameDateAndTime_DayMinutesFormatted} AM`;
  } else {
    // PM
    const gameDateAndTime_DayHoursFormatted: string =
      gameDateAndTime_DayHours === 12
        ? (12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : (gameDateAndTime_DayHours - 12).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
    const gameDateAndTime_DayMinutesFormatted: string =
      gameDateAndTime_DayMinutes.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

    variables().gameTimeDisplay = `${gameDateAndTime_DayHoursFormatted}:${gameDateAndTime_DayMinutesFormatted} PM`;
  }
};

// Update whenever time changes
listenToCustomEvent(CustomEventName.TIME_UPDATE, updateGameTimeDisplay);
