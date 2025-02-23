/* NOTE: When adding areas, do it in this order:
    - USE COMMENTS TO SECTION OUT RELATED AREAS FOR READABILITY
    - Create instances of every child area.
    - Connect them together.
    - Create the instance of the container area. 
    - Add all the child areas to the container area. */

import { SubLocation } from '../classes'
import { SubLocationId, Direction } from '../enums'

export const fertiloIncPorchFloor1 = new SubLocation(
  SubLocationId.PORCH,
  'Porch'
)
export const fertiloIncReceptionFloor1 = new SubLocation(
  SubLocationId.RECEPTION,
  'Reception',
  'The Entry Point of Fertilo Inc'
)
export const fertiloIncMeasurementClosetFloor1 = new SubLocation(
  SubLocationId.MEASUREMENT_CLOSET,
  'Measurement Closet'
)
export const fertiloIncPharmacy1Floor1 = new SubLocation(
  SubLocationId.PHARMACY_1,
  'Pharmacy 1'
)
export const fertiloIncPharmacy2Floor1 = new SubLocation(
  SubLocationId.PHARMACY_2,
  'Pharmacy 2'
)
export const fertiloIncCorridor1Floor1 = new SubLocation(
  SubLocationId.CORRIDOR_1,
  'Corridor 1'
)
export const fertiloIncHallway1Floor1 = new SubLocation(
  SubLocationId.HALLWAY_1,
  'Hallway 1'
)
export const fertiloIncHallway2Floor1 = new SubLocation(
  SubLocationId.HALLWAY_2,
  'Hallway 2'
)
export const fertiloIncHallway3Floor1 = new SubLocation(
  SubLocationId.HALLWAY_3,
  'Hallway 3'
)
export const fertiloIncHallway4Floor1 = new SubLocation(
  SubLocationId.HALLWAY_4,
  'Hallway 4'
)
export const fertiloIncHallway5Floor1 = new SubLocation(
  SubLocationId.HALLWAY_5,
  'Hallway 5'
)
export const fertiloIncHallway6Floor1 = new SubLocation(
  SubLocationId.HALLWAY_6,
  'Hallway 6'
)
export const fertiloIncHallway7Floor1 = new SubLocation(
  SubLocationId.HALLWAY_7,
  'Hallway 7'
)
export const fertiloIncLabFloor1 = new SubLocation(
  SubLocationId.LAB,
  'Laboratory'
)
export const fertiloIncConsultationFloor1 = new SubLocation(
  SubLocationId.CONSULTATION,
  'Consultation Office'
)
export const fertiloIncOfficeWorkFloor1 = new SubLocation(
  SubLocationId.OFFICE_WORK,
  'Office'
)

fertiloIncPorchFloor1.connectTo({
  area: fertiloIncReceptionFloor1,
  dir: Direction.NORTH,
  dist: 2,
})

fertiloIncReceptionFloor1.connectTo(
  { area: fertiloIncMeasurementClosetFloor1, dir: Direction.EAST, dist: 1 },
  { area: fertiloIncPharmacy1Floor1, dir: Direction.WEST, dist: 1 },
  { area: fertiloIncCorridor1Floor1, dir: Direction.NORTH, dist: 2 }
)

fertiloIncCorridor1Floor1.connectTo({
  area: fertiloIncHallway4Floor1,
  dir: Direction.NORTH,
  dist: 3,
})

fertiloIncHallway4Floor1.connectTo(
  // { area: fertiloIncHallway1Floor1, dir: Direction.WEST, dist: 6 },
  // { area: fertiloIncHallway2Floor1, dir: Direction.WEST, dist: 4 },
  { area: fertiloIncHallway3Floor1, dir: Direction.WEST, dist: 2 },
  { area: fertiloIncHallway5Floor1, dir: Direction.EAST, dist: 2 }
  // { area: fertiloIncHallway6Floor1, dir: Direction.EAST, dist: 4 },
  // { area: fertiloIncHallway7Floor1, dir: Direction.EAST, dist: 6 }
)

fertiloIncHallway3Floor1.connectTo(
  {
    area: fertiloIncLabFloor1,
    dir: Direction.SOUTH,
    dist: 2,
  },
  { area: fertiloIncHallway2Floor1, dir: Direction.WEST, dist: 2 }
)

fertiloIncHallway2Floor1.connectTo({
  area: fertiloIncHallway1Floor1,
  dir: Direction.WEST,
  dist: 2,
})

fertiloIncHallway5Floor1.connectTo(
  {
    area: fertiloIncPharmacy2Floor1,
    dir: Direction.SOUTH,
    dist: 2,
  },
  {
    area: fertiloIncConsultationFloor1,
    dir: Direction.NORTH,
    dist: 2,
  },
  { area: fertiloIncHallway6Floor1, dir: Direction.EAST, dist: 2 }
)

fertiloIncHallway6Floor1.connectTo({
  area: fertiloIncHallway7Floor1,
  dir: Direction.EAST,
  dist: 2,
})

fertiloIncHallway7Floor1.connectTo({
  area: fertiloIncOfficeWorkFloor1,
  dir: Direction.NORTH,
  dist: 2,
})
