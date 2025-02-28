import {
  GlobalMapId,
  LocationId,
  RegionId,
  SubLocationId,
  SubRegionId,
} from './enums'
import type { AreaUniqueId } from './types_and_interfaces'

export const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
]

// I used 3.02 mph as the average and scaled it down to metres per second
// NOTE - It should take, on average, 10 seconds to leave a room for the immediate one close by (e.g a room with coords [2,6] to another with coords [2,7]) so every single value difference in coordinates (or the result of `getDistanceBetweenTwoPoints` times 10) is worth 10 seconds at the `averageWalkingSpeed` i.e (1/ averageWalkingSpeed * (INSERT EXTRA VALUES HERE) = 10 on average).
export const averageWalkingSpeed: [
  value: number,
  distanceUnit: string,
  timeUnit: string
] = [1.35, 'metres', 'second']

export const gPlayerMapSpriteId = 'player-map-sprite' // The id for the image serving as the player sprite on the map

export const gLeftShiftValue = 8

export let gMapPopoutZoomLvl = 1 // May be updated in `loadGameMap()` but will always be updated when the zoom buttons are clicked
export const setMapPopoutZoomLvl = (lvl: number) => {
  gMapPopoutZoomLvl = lvl
}

export const gPlayerMapSpriteSrc = '/media/img/map/icons/player_map_sprite.webp'

export const defaultWarpDestination: AreaUniqueId = `${GlobalMapId.GLOBAL}_${RegionId.WEST_HIRTHEFORD}_${SubRegionId.TEST_NEIGHBOURHOOD}_${LocationId.PLAYER_HOUSE}_${SubLocationId.PLAYER_ROOM}`

export let lastWarpDestination: AreaUniqueId = defaultWarpDestination // When the function `warpToArea()` is called, this value is updated if the warp is possible or has happened. When called by `navigateInDirectionOnMap()`, it is set to null instead
export const setLastWarpDestination = (arg: typeof lastWarpDestination) => {
  lastWarpDestination = arg
}

// console.log(NSLocation.gLeftShiftValue);
