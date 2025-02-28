import { SubRegion } from '../classes'
import { SubRegionId } from '../enums'
import {
  location_fertiloIncGroundFloor,
  location_playerHouse,
} from './locations'

export const subRegion_fertiloInc = new SubRegion(
  SubRegionId.FERTILO_INC,
  'Fertilo Inc',
  undefined,
  'Test description'
).addArea(location_fertiloIncGroundFloor)

export const subRegion_testNeighbourhood = new SubRegion(
  SubRegionId.TEST_NEIGHBOURHOOD,
  'Neighbourhood',
  undefined,
  'Test Description'
).addArea(location_playerHouse)
