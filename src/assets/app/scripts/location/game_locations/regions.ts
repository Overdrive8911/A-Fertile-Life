import { Region } from '../classes'
import { RegionId, Direction, Distance } from '../enums'

export const northHirtheford = new Region(
  RegionId.NORTH_HIRTHEFORD,
  'North Hirtheford'
)
export const eastHirtheford = new Region(
  RegionId.EAST_HIRTHEFORD,
  'East Hirtheford'
)
export const southHirtheford = new Region(
  RegionId.SOUTH_HIRTHEFORD,
  'South Hirtheford'
)
export const westHirtheford = new Region(
  RegionId.WEST_HIRTHEFORD,
  'West Hirtheford'
)
export const centralHirtheford = new Region(
  RegionId.CENTRAL_HIRTHEFORD,
  'West Hirtheford'
)

centralHirtheford.connectTo(
  { area: northHirtheford, dir: Direction.NORTH, dist: Distance.LONG },
  { area: eastHirtheford, dir: Direction.EAST, dist: Distance.LONG },
  { area: southHirtheford, dir: Direction.SOUTH, dist: Distance.LONG },
  { area: westHirtheford, dir: Direction.WEST, dist: Distance.LONG }
)

// REVIEW: Would stuff like `Direction.NORTH_EAST` be better?
northHirtheford.connectTo(
  {
    area: eastHirtheford,
    dir: Direction.EAST,
    dist: Distance.VERY_LONG,
  },
  {
    area: westHirtheford,
    dir: Direction.WEST,
    dist: Distance.VERY_LONG,
  }
)
southHirtheford.connectTo(
  {
    area: eastHirtheford,
    dir: Direction.EAST,
    dist: Distance.VERY_LONG,
  },
  {
    area: westHirtheford,
    dir: Direction.WEST,
    dist: Distance.VERY_LONG,
  }
)
