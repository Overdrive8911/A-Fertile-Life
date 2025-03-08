import { GlobalMap } from '../classes'
import { Direction, Distance, GlobalMapId } from '../enums'
import {
  region_northHirtheford,
  region_eastHirtheford,
  region_southHirtheford,
  region_westHirtheford,
  region_centralHirtheford,
} from './regions'

/**
 * Anything to do with searching for a location should be done with this
 *
 * NOTE: **DO NOT INSTANTIATE ANOTHER INSTANCE OF `GlobalMap`**
 */
export const globalMap = new GlobalMap(GlobalMapId.GLOBAL, 'Global Map')

globalMap
  .addArea(
    region_northHirtheford,
    region_eastHirtheford,
    region_southHirtheford,
    region_westHirtheford,
    region_centralHirtheford
  )
  .connect(
    {
      from: region_centralHirtheford,
      areas: [
        {
          to: region_northHirtheford,
          dir: Direction.NORTH,
          dist: Distance.LONG,
        },
        { to: region_eastHirtheford, dir: Direction.EAST, dist: Distance.LONG },
        {
          to: region_southHirtheford,
          dir: Direction.SOUTH,
          dist: Distance.LONG,
        },
        { to: region_westHirtheford, dir: Direction.WEST, dist: Distance.LONG },
      ],
    }
    // REVIEW: Would stuff like `Direction.NORTH_EAST` be better?
    // {
    //   from: region_northHirtheford,
    //   to: region_eastHirtheford,
    //   dir: Direction.EAST,
    //   dist: Distance.VERY_LONG,
    // },
    // {
    //   from: region_northHirtheford,
    //   to: region_westHirtheford,
    //   dir: Direction.WEST,
    //   dist: Distance.VERY_LONG,
    // },
    // {
    //   from: region_southHirtheford,
    //   to: region_eastHirtheford,
    //   dir: Direction.EAST,
    //   dist: Distance.VERY_LONG,
    // },
    // {
    //   from: region_southHirtheford,
    //   to: region_westHirtheford,
    //   dir: Direction.WEST,
    //   dist: Distance.VERY_LONG,
    // }
  )

//@ts-ignore
window.tt = globalMap

;(async () => {
  await globalMap.initMapCache()
})()
