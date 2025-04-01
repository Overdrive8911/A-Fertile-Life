import { Region } from "../../classes";
import { RegionId } from "../../enums";
import { subRegion_testNeighbourhood } from "./your_neighbourhood/neighbourhood";

export const region_westHirtheford = new Region(
  RegionId.WEST_HIRTHEFORD,
  "West Hirtheford"
).addArea(subRegion_testNeighbourhood);
