import { Location, SubLocation } from "../../../../classes";
import { LocationId, SubLocationId } from "../../../../enums";

const playerRoom = new SubLocation(
  SubLocationId.ROOM,
  "Your Room",
  "Fertilo_Inc_Player_Room",
  "Your New Room"
);
export const location_fertiloIncUnderground = new Location(
  LocationId.FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
  "Underground"
).addArea(playerRoom);
