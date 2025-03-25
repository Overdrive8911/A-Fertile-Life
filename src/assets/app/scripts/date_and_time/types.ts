import type { GameDateAndTime } from "./classes";

export interface TimeUpdateEventData {
  prevTime: GameDateAndTime;
  currTime: GameDateAndTime;
}
