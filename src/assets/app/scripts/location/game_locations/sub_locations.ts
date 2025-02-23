/* NOTE: When adding areas, do it in this order:
    - USE COMMENTS TO SECTION OUT RELATED AREAS FOR READABILITY
    - Create instances of every child area.
    - Connect them together.
    - Create the instance of the container area. 
    - Add all the child areas to the container area. */

import { SubLocation } from '../classes'
import { SubLocationId, Direction } from '../enums'

export const subLocation_fertiloIncPorch = new SubLocation(
  SubLocationId.PORCH,
  'Porch'
)
export const subLocation_fertiloIncReception = new SubLocation(
  SubLocationId.RECEPTION,
  'Reception',
  'The Entry Point of Fertilo Inc'
)
export const subLocation_fertiloIncMeasurementCloset = new SubLocation(
  SubLocationId.MEASUREMENT_CLOSET,
  'Measurement Closet'
)
export const subLocation_fertiloIncPharmacy1 = new SubLocation(
  SubLocationId.PHARMACY_1,
  'Pharmacy 1'
)
export const subLocation_fertiloIncPharmacy2 = new SubLocation(
  SubLocationId.PHARMACY_2,
  'Pharmacy 2'
)
export const subLocation_fertiloIncCorridor1 = new SubLocation(
  SubLocationId.CORRIDOR_1,
  'Corridor 1'
)
export const subLocation_fertiloIncHallway1 = new SubLocation(
  SubLocationId.HALLWAY_1,
  'Hallway 1'
)
export const subLocation_fertiloIncHallway2 = new SubLocation(
  SubLocationId.HALLWAY_2,
  'Hallway 2'
)
export const subLocation_fertiloIncHallway3 = new SubLocation(
  SubLocationId.HALLWAY_3,
  'Hallway 3'
)
export const subLocation_fertiloIncHallway4 = new SubLocation(
  SubLocationId.HALLWAY_4,
  'Hallway 4'
)
export const subLocation_fertiloIncHallway5 = new SubLocation(
  SubLocationId.HALLWAY_5,
  'Hallway 5'
)
export const subLocation_fertiloIncHallway6 = new SubLocation(
  SubLocationId.HALLWAY_6,
  'Hallway 6'
)
export const subLocation_fertiloIncHallway7 = new SubLocation(
  SubLocationId.HALLWAY_7,
  'Hallway 7'
)
export const subLocation_fertiloIncLab = new SubLocation(
  SubLocationId.LAB,
  'Laboratory'
)
export const subLocation_fertiloIncConsultation = new SubLocation(
  SubLocationId.CONSULTATION,
  'Consultation Office'
)
export const subLocation_fertiloIncOfficeWork = new SubLocation(
  SubLocationId.OFFICE_WORK,
  'Office'
)

subLocation_fertiloIncPorch.connectTo({
  area: subLocation_fertiloIncReception,
  dir: Direction.NORTH,
  dist: 2,
})

subLocation_fertiloIncReception.connectTo(
  {
    area: subLocation_fertiloIncMeasurementCloset,
    dir: Direction.EAST,
    dist: 1,
  },
  { area: subLocation_fertiloIncPharmacy1, dir: Direction.WEST, dist: 1 },
  { area: subLocation_fertiloIncCorridor1, dir: Direction.NORTH, dist: 2 }
)

subLocation_fertiloIncCorridor1.connectTo({
  area: subLocation_fertiloIncHallway4,
  dir: Direction.NORTH,
  dist: 3,
})

subLocation_fertiloIncHallway4.connectTo(
  // { area: fertiloIncHallway1Floor1, dir: Direction.WEST, dist: 6 },
  // { area: fertiloIncHallway2Floor1, dir: Direction.WEST, dist: 4 },
  { area: subLocation_fertiloIncHallway3, dir: Direction.WEST, dist: 2 },
  { area: subLocation_fertiloIncHallway5, dir: Direction.EAST, dist: 2 }
  // { area: fertiloIncHallway6Floor1, dir: Direction.EAST, dist: 4 },
  // { area: fertiloIncHallway7Floor1, dir: Direction.EAST, dist: 6 }
)

subLocation_fertiloIncHallway3.connectTo(
  {
    area: subLocation_fertiloIncLab,
    dir: Direction.SOUTH,
    dist: 2,
  },
  { area: subLocation_fertiloIncHallway2, dir: Direction.WEST, dist: 2 }
)

subLocation_fertiloIncHallway2.connectTo({
  area: subLocation_fertiloIncHallway1,
  dir: Direction.WEST,
  dist: 2,
})

subLocation_fertiloIncHallway5.connectTo(
  {
    area: subLocation_fertiloIncPharmacy2,
    dir: Direction.SOUTH,
    dist: 2,
  },
  {
    area: subLocation_fertiloIncConsultation,
    dir: Direction.NORTH,
    dist: 2,
  },
  { area: subLocation_fertiloIncHallway6, dir: Direction.EAST, dist: 2 }
)

subLocation_fertiloIncHallway6.connectTo({
  area: subLocation_fertiloIncHallway7,
  dir: Direction.EAST,
  dist: 2,
})

subLocation_fertiloIncHallway7.connectTo({
  area: subLocation_fertiloIncOfficeWork,
  dir: Direction.NORTH,
  dist: 2,
})
