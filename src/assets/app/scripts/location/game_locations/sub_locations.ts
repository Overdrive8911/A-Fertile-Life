/* NOTE: When adding areas, do it in this order:
    - USE COMMENTS TO SECTION OUT RELATED AREAS FOR READABILITY
    - Create instances of every child area.
    - Connect them together.
    - Create the instance of the container area. 
    - Add all the child areas to the container area. */

import { SubLocation } from '../classes'
import { MapEntityFlags, SubLocationId } from '../enums'

export const subLocation_Porch = new SubLocation(
  'Fertilo_Inc_Ground_Floor_Porch',
  SubLocationId.PORCH,
  'Porch',
  'Get Porched',
  MapEntityFlags.IS_ENTRY_OR_EXIT_POINT
)
export const subLocation_Reception = new SubLocation(
  '',
  SubLocationId.RECEPTION,
  'Reception',
  'The Entry Point of Fertilo Inc'
)
export const subLocation_MeasurementCloset = new SubLocation(
  '',
  SubLocationId.MEASUREMENT_CLOSET,
  'Measurement Closet'
)
export const subLocation_Pharmacy1 = new SubLocation(
  '',
  SubLocationId.PHARMACY_1,
  'Pharmacy 1'
)
export const subLocation_Pharmacy2 = new SubLocation(
  '',
  SubLocationId.PHARMACY_2,
  'Pharmacy 2'
)
export const subLocation_Corridor1 = new SubLocation(
  '',
  SubLocationId.CORRIDOR_1,
  'Corridor 1'
)
export const subLocation_Hallway1 = new SubLocation(
  '',
  SubLocationId.HALLWAY_1,
  'Hallway 1'
)
export const subLocation_Hallway2 = new SubLocation(
  '',
  SubLocationId.HALLWAY_2,
  'Hallway 2'
)
export const subLocation_Hallway3 = new SubLocation(
  '',
  SubLocationId.HALLWAY_3,
  'Hallway 3'
)
export const subLocation_Hallway4 = new SubLocation(
  '',
  SubLocationId.HALLWAY_4,
  'Hallway 4'
)
export const subLocation_Hallway5 = new SubLocation(
  '',
  SubLocationId.HALLWAY_5,
  'Hallway 5'
)
export const subLocation_Hallway6 = new SubLocation(
  '',
  SubLocationId.HALLWAY_6,
  'Hallway 6'
)
export const subLocation_Hallway7 = new SubLocation(
  '',
  SubLocationId.HALLWAY_7,
  'Hallway 7'
)
export const subLocation_Lab = new SubLocation(
  '',
  SubLocationId.LAB,
  'Laboratory'
)
export const subLocation_Consultation = new SubLocation(
  '',
  SubLocationId.CONSULTATION,
  'Consultation Office'
)
export const subLocation_OfficeWork = new SubLocation(
  '',
  SubLocationId.OFFICE_WORK,
  'Office'
)
