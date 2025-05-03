import { NorthHirthefordPassageName } from "../../../../../story/enums";
import { Location, SubLocation } from "../../../../classes";
import { LocationId, SubLocationId } from "../../../../enums";

const playerRoom = new SubLocation(
	SubLocationId.ROOM,
	"Your Room",
	NorthHirthefordPassageName.FERTILO_INC_PLAYER_ROOM,
	"Your New Room"
);

export const location_fertiloIncUnderground = new Location(
	LocationId.FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
	"Underground"
).addArea(playerRoom);

export { playerRoom as fertiloIncPlayerRoom };
