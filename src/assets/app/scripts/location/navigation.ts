import { defaultWarpDestination, setLastWarpDestination } from './other_data'
import { Direction, MapEntityFlags } from './enums'
import type { AreaUniqueId, SubAreas } from './types_and_interfaces'
import type { Location, Region, SubLocation, SubRegion } from './classes'

function getConnectedArea(area: SubLocation, direction: Direction): SubLocation | null
function getConnectedArea(area: Location, direction: Direction): Location | null
function getConnectedArea(area: SubRegion, direction: Direction): SubRegion | null
function getConnectedArea(area: Region, direction: Direction): Region | null
function getConnectedArea(area: SubAreas, direction: Direction):SubAreas  | null {
  const parent = area.parent;
  const connectedArea = parent.childrenData.get(area as any)?.get(direction)?.area 
  let canEnterConnectedAreaFromDirection = (connectedArea?.flags ?? MapEntityFlags.NONE) & MapEntityFlags.INACCESSIBLE ? true:false

  return canEnterConnectedAreaFromDirection ? connectedArea ?? null : null
}

// "Warp" to an area by loading the default passage for it and updating the location and sub location ids in the save data. If `doNotWarp` is true, then this just checks if the passage to warp to exists
export function warpToArea(destination: AreaUniqueId, 
  doNotWarp = false
) {
  const currentArea = variables().player.areaId
  const mapEntitiesForCurrentArea = globalMap.areasFromUniqueId(currentArea)
  const mapEntitiesForDestination = globalMap.areasFromUniqueId(destination)

  const getPassageName = (mapEntities: ReturnType<typeof globalMap.areasFromUniqueId>) => {
      return mapEntities.subLocation?.passage ?? mapEntities.location?.passage ?? mapEntities.subRegion?.passage ?? mapEntities.region?.passage ?? backupPassageName
  }
  const passageToLoad = getPassageName(mapEntitiesForDestination)

  if (passageToLoad == backupPassageName) { 
    console.warn(`Destination passage not found. Falling back to backup passage. The destination data is:`);
    console.warn(mapEntitiesForDestination)
  }

  setLastWarpDestination(currentArea)
  
    // load the passage
    if (!doNotWarp) Engine.play(passageToLoad)
}
export function isNavigationButtonUsable(direction: Direction) {
  const areaId = variables().player.areaId
  const mapEntities = globalMap.areasFromUniqueId(areaId)

  try {
    return getConnectedArea(mapEntities.subLocation ?? mapEntities.location ?? mapEntities.subRegion ?? mapEntities.region as any, direction) ? true:false
  } catch (error) {
    return false
  }
}
