import { GameDateAndTime } from "../date_and_time/classes";

export const saveVar_gameDateAndTime = new GameDateAndTime(
  Date.UTC(2021, 1, 3, 20)
);

console.log(saveVar_gameDateAndTime.dateText);
console.log(saveVar_gameDateAndTime.constructor.name);
