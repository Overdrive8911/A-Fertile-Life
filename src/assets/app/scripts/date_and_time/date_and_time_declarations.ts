import { CustomEventName } from "../declarations/enums";
import type { TimeUpdateEventData } from "./types";

export function updateGameTimeVariable(timeInSeconds: number) {
  // copy out the date
  const oldDate = new Date(variables().gameDateAndTime);

  // Convert to milliseconds and add to the old date
  variables().gameDateAndTime = new Date(
    oldDate.getTime() + 1000 * timeInSeconds
  );

  // Dispatch an event for other stuff that rely on time to work
  window.dispatchEvent(
    new CustomEvent(CustomEventName.TIME_UPDATE, {
      detail: {
        prevTime: oldDate,
        currTime: variables().gameDateAndTime,
      } as TimeUpdateEventData,
    })
  );
}

export function listenToTimeUpdateEvent(
  func: (data: TimeUpdateEventData) => void
) {
  $(window).on(CustomEventName.TIME_UPDATE, (e) => {
    func(e.detail as unknown as TimeUpdateEventData);
  });
}
