import { NorthHirthefordPassageName } from "../../../../../story/enums";
import { Location, SubLocation } from "../../../../classes";
import { LocationId, SubLocationId } from "../../../../enums";

const ceoOffice = new SubLocation(
	SubLocationId.CEO_OFFICE,
	"CEO Office",
	NorthHirthefordPassageName.FERTILO_INC_OFFICE_CEO,
	"Fertilo's Domain"
);

export const location_fertiloIncTopFloor = new Location(
	LocationId.FERTILO_INC_TOP_FLOOR,
	"Top Floor"
).addArea(ceoOffice);

export { ceoOffice as fertiloIncTopFloorCeoOffice };
