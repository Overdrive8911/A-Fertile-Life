import type { GameDateAndTime } from "./classes";

export interface TimeUpdateEventData {
  /**
   * The previous time before the time update event was fired
   */
  readonly prevTime: GameDateAndTime;
  /**
   * The present time
   */
  readonly currTime: GameDateAndTime;
  /**
   * Difference between previous time and current time in seconds
   */
  readonly timeDiff: number;
}
