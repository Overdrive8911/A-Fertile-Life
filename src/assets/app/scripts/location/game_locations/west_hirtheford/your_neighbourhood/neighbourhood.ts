import { SubRegion } from "../../../classes";
import { SubRegionId } from "../../../enums";
import { location_playerHouse } from "./locations/player_house";

export const subRegion_testNeighbourhood = new SubRegion(
  SubRegionId.TEST_NEIGHBOURHOOD,
  "Neighbourhood",
  undefined,
  "Test Description"
).addArea(location_playerHouse);
