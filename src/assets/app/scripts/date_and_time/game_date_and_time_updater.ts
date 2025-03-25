import { averageWalkingSpeed } from "../location/other_data";
import { updateGameTimeVariable } from "./date_and_time_declarations";

export const updateTimeWithDistance = (
  dist: number,
  movementSpeed = averageWalkingSpeed[0] /* in metres per second*/
) => {
  // Get the time to travel in seconds
  const timeToTravel = Math.floor(
    (dist / movementSpeed) *
      randomFloat(
        averageWalkingSpeed[0] * 10 - 1,
        averageWalkingSpeed[0] * 10 + 1
      )
  );
  updateGameTimeVariable(timeToTravel);
};

// Skip forward `day` times to the specified time (in hrs and minutes)
export const skipSomeDaysToSpecificTime = (
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

  updateGameTimeVariable(
    new Date(
      variables().gameDateAndTime.getFullYear(),
      variables().gameDateAndTime.getUTCMonth(),
      variables().gameDateAndTime.getUTCDate() + days,
      hours,
      minutes
    )
  );
};

// Skip to the next day and stop at the particular hour(0 till 23) and minutes(0 till 59)
export function skipToNextDayWithSpecificTime(hours: number, minutes: number) {
  skipSomeDaysToSpecificTime(1, hours, minutes);
}
