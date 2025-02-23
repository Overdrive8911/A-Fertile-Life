import { LocationId } from '../enums'
import {
  subLocation_fertiloIncPorch,
  subLocation_fertiloIncReception,
  subLocation_fertiloIncMeasurementCloset,
  subLocation_fertiloIncPharmacy1,
  subLocation_fertiloIncPharmacy2,
  subLocation_fertiloIncCorridor1,
  subLocation_fertiloIncHallway1,
  subLocation_fertiloIncHallway2,
  subLocation_fertiloIncHallway3,
  subLocation_fertiloIncHallway4,
  subLocation_fertiloIncHallway5,
  subLocation_fertiloIncHallway6,
  subLocation_fertiloIncHallway7,
  subLocation_fertiloIncLab,
  subLocation_fertiloIncConsultation,
  subLocation_fertiloIncOfficeWork,
} from './sub_locations'
import { Location } from '../classes'

export const location_fertiloIncGroundFloor = new Location(
  LocationId.FERTILO_INC_GROUND_FLOOR,
  'Fertilo Inc (Ground Floor)'
).addArea(
  subLocation_fertiloIncPorch,
  subLocation_fertiloIncReception,
  subLocation_fertiloIncMeasurementCloset,
  subLocation_fertiloIncPharmacy1,
  subLocation_fertiloIncPharmacy2,
  subLocation_fertiloIncCorridor1,
  subLocation_fertiloIncHallway1,
  subLocation_fertiloIncHallway2,
  subLocation_fertiloIncHallway3,
  subLocation_fertiloIncHallway4,
  subLocation_fertiloIncHallway5,
  subLocation_fertiloIncHallway6,
  subLocation_fertiloIncHallway7,
  subLocation_fertiloIncLab,
  subLocation_fertiloIncConsultation,
  subLocation_fertiloIncOfficeWork
)

//@ts-ignore
window.t = location_fertiloIncGroundFloor
console.log(location_fertiloIncGroundFloor)
