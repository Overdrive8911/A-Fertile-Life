import { Region } from "../../classes";
import { RegionId } from "../../enums";
import { subRegion_fertiloInc } from "./fertilo_inc/fertilo_inc";

export const region_northHirtheford = new Region(
  RegionId.NORTH_HIRTHEFORD,
  "North Hirtheford"
).addArea(subRegion_fertiloInc);
