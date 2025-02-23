import { Region } from '../classes'
import { RegionId, Direction, Distance } from '../enums'
import { subRegion_fertiloInc } from './sub_regions'

export const region_northHirtheford = new Region(
  RegionId.NORTH_HIRTHEFORD,
  'North Hirtheford'
)
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
)
export const region_centralHirtheford = new Region(
  RegionId.CENTRAL_HIRTHEFORD,
  'Central Hirtheford'
)

region_northHirtheford.addArea(subRegion_fertiloInc)
