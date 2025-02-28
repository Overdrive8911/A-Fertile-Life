import { SubRegion } from '../classes'
import { SubRegionId } from '../enums'
import { location_fertiloIncGroundFloor } from './locations'

export const subRegion_fertiloInc = new SubRegion(
  SubRegionId.FERTILO_INC,
  'Fertilo Inc',
  undefined,
  'Test description'
).addArea(location_fertiloIncGroundFloor)
