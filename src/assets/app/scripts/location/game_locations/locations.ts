import { LocationId } from '../enums'
import {
  fertiloIncPorchFloor1,
  fertiloIncReceptionFloor1,
  fertiloIncMeasurementClosetFloor1,
  fertiloIncPharmacy1Floor1,
  fertiloIncPharmacy2Floor1,
  fertiloIncCorridor1Floor1,
  fertiloIncHallway1Floor1,
  fertiloIncHallway2Floor1,
  fertiloIncHallway3Floor1,
  fertiloIncHallway4Floor1,
  fertiloIncHallway5Floor1,
  fertiloIncHallway6Floor1,
  fertiloIncHallway7Floor1,
  fertiloIncLabFloor1,
  fertiloIncConsultationFloor1,
  fertiloIncOfficeWorkFloor1,
} from './sub_locations'
import { Location } from '../classes'

const fertiloIncGroundFloor = new Location(
  LocationId.FERTILO_INC_GROUND_FLOOR,
  'Fertilo Inc (Ground Floor)'
).addArea(
  fertiloIncPorchFloor1,
  fertiloIncReceptionFloor1,
  fertiloIncMeasurementClosetFloor1,
  fertiloIncPharmacy1Floor1,
  fertiloIncPharmacy2Floor1,
  fertiloIncCorridor1Floor1,
  fertiloIncHallway1Floor1,
  fertiloIncHallway2Floor1,
  fertiloIncHallway3Floor1,
  fertiloIncHallway4Floor1,
  fertiloIncHallway5Floor1,
  fertiloIncHallway6Floor1,
  fertiloIncHallway7Floor1,
  fertiloIncLabFloor1,
  fertiloIncConsultationFloor1,
  fertiloIncOfficeWorkFloor1
)

//@ts-ignore
window.t = fertiloIncGroundFloor
console.log(fertiloIncGroundFloor)
