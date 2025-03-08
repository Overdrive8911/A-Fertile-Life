import { Region } from '../classes'
import { RegionId } from '../enums'
import {
  subRegion_fertiloInc,
  subRegion_testNeighbourhood,
} from './sub_regions'

export const region_northHirtheford = new Region(
  RegionId.NORTH_HIRTHEFORD,
  'North Hirtheford'
).addArea(subRegion_fertiloInc)

export const region_eastHirtheford = new Region(
  RegionId.EAST_HIRTHEFORD,
  'East Hirtheford'
)

export const region_southHirtheford = new Region(
  RegionId.SOUTH_HIRTHEFORD,
  'South Hirtheford'
)

export const region_westHirtheford = new Region(
  RegionId.WEST_HIRTHEFORD,
  'West Hirtheford'
).addArea(subRegion_testNeighbourhood)

export const region_centralHirtheford = new Region(
  RegionId.CENTRAL_HIRTHEFORD,
  'Central Hirtheford'
)
