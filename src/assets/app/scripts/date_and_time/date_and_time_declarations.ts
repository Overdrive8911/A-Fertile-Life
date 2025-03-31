import { dispatchCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import { GameDateAndTime } from "./classes";

export function updateGameTimeVariable(timeInSecondsOrNewDate: number | Date) {
  // copy out the date
  const oldDate = new GameDateAndTime(variables().gameDateAndTime);

  // Convert to milliseconds and add to the old date
  variables().gameDateAndTime.update(
    timeInSecondsOrNewDate instanceof Date
      ? timeInSecondsOrNewDate
      : new Date(oldDate.getTime() + 1000 * timeInSecondsOrNewDate)
  );

  // Dispatch an event for other stuff that rely on time to work
  dispatchCustomEvent(CustomEventName.TIME_UPDATE, {
    prevTime: oldDate,
    currTime: variables().gameDateAndTime,
    get timeDiff() {
      return (this.currTime.getTime() - this.prevTime.getTime()) / 1000;
    },
  });
}
