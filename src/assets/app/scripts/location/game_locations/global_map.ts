import { GlobalMap } from '../classes'
import { GlobalMapId } from '../enums'
import {
  northHirtheford,
  eastHirtheford,
  southHirtheford,
  westHirtheford,
  centralHirtheford,
} from './regions'

const globalMap = new GlobalMap(GlobalMapId.GLOBAL, 'Global Map')
globalMap.addArea(
  northHirtheford,
  eastHirtheford,
  southHirtheford,
  westHirtheford,
  centralHirtheford
)
