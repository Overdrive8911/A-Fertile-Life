import { SubRegion } from "../classes";
import { Direction, Distance, SubRegionId } from "../enums";
import {
  location_fertiloIncGroundFloor,
  location_fertiloIncTopFloor,
  location_fertiloIncUnderground,
  location_playerHouse,
} from "./locations";

export const subRegion_fertiloInc = new SubRegion(
  SubRegionId.FERTILO_INC,
  "Fertilo Inc",
  undefined,
  "Test description"
)
  .addArea(
    location_fertiloIncGroundFloor,
    location_fertiloIncTopFloor,
    location_fertiloIncUnderground
  )
  .connect({
    from: location_fertiloIncGroundFloor,
    areas: [
      {
        to: location_fertiloIncUnderground,
        dir: Direction.DOWN,
        dist: Distance.SOMEWHAT_SHORT,
      },
    ],
  });

export const subRegion_testNeighbourhood = new SubRegion(
  SubRegionId.TEST_NEIGHBOURHOOD,
  "Neighbourhood",
  undefined,
  "Test Description"
).addArea(location_playerHouse);
