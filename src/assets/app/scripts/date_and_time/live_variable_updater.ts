import { listenToCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";

const updateGameTimeDisplay = () => {
  const vars = variables();
  if (!vars.gameDateAndTime) {
    vars.gameDateAndTime = new Date(Date.UTC(2021, 1, 3, 20));
  }

  const gameDateAndTime = vars.gameDateAndTime;

  // Update game date display
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
  vars.gameDateDisplay = `${
    days[gameDateAndTime.getUTCDay()]
  }, ${gameDateAndTime.getUTCDate()} ${months[gameDateAndTime.getUTCMonth()]}`;

  // Update game time display
  const hours = gameDateAndTime.getUTCHours();
  const minutes = gameDateAndTime.getUTCMinutes();
  const isAM = hours < 12;

  const formattedHours = (hours % 12 || 12).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const formattedMinutes = minutes.toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  vars.gameTimeDisplay = `${formattedHours}:${formattedMinutes} ${
    isAM ? "AM" : "PM"
  }`;
};

// Update whenever time changes
listenToCustomEvent(CustomEventName.TIME_UPDATE, updateGameTimeDisplay);
