import { SubRegion } from "../../../classes";
import { SubRegionId, Direction, Distance } from "../../../enums";
import { location_fertiloIncGroundFloor } from "./locations/ground_floor";
import { location_fertiloIncTopFloor } from "./locations/top_floor";
import { location_fertiloIncUnderground } from "./locations/underground";

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
