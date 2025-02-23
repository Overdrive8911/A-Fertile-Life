import { Region } from '../classes'
import { RegionId, Direction, Distance } from '../enums'

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
  'West Hirtheford'
)

region_centralHirtheford.connectTo(
  { area: region_northHirtheford, dir: Direction.NORTH, dist: Distance.LONG },
  { area: region_eastHirtheford, dir: Direction.EAST, dist: Distance.LONG },
  { area: region_southHirtheford, dir: Direction.SOUTH, dist: Distance.LONG },
  { area: region_westHirtheford, dir: Direction.WEST, dist: Distance.LONG }
)

// REVIEW: Would stuff like `Direction.NORTH_EAST` be better?
region_northHirtheford.connectTo(
  {
    area: region_eastHirtheford,
    dir: Direction.EAST,
    dist: Distance.VERY_LONG,
  },
  {
    area: region_westHirtheford,
    dir: Direction.WEST,
    dist: Distance.VERY_LONG,
  }
)
region_southHirtheford.connectTo(
  {
    area: region_eastHirtheford,
    dir: Direction.EAST,
    dist: Distance.VERY_LONG,
  },
  {
    area: region_westHirtheford,
    dir: Direction.WEST,
    dist: Distance.VERY_LONG,
  }
)
