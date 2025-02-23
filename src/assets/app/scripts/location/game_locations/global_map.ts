import { GlobalMap } from '../classes'
import { GlobalMapId } from '../enums'
import {
  region_northHirtheford,
  region_eastHirtheford,
  region_southHirtheford,
  region_westHirtheford,
  region_centralHirtheford,
} from './regions'

const globalMap = new GlobalMap(GlobalMapId.GLOBAL, 'Global Map')
globalMap.addArea(
  region_northHirtheford,
  region_eastHirtheford,
  region_southHirtheford,
  region_westHirtheford,
  region_centralHirtheford
)
