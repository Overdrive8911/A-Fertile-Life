import { setLastWarpDestination } from "./other_data";
import { Direction, MapEntityFlags } from "./enums";
import type { SubAreas, AreaUUID } from "./types_and_interfaces";
import {
  GlobalMap,
  SubLocation,
  type Location,
  type Region,
  type SubRegion,
} from "./classes";
import { globalMap } from "./game_locations/global_map";
import { backupPassageName, oppositeDirection } from "./general_location_data";
import {
  activeArea,
  getAreaFromUUID,
} from "../declarations/general_declarations";
import { updateTimeWithDistance } from "../date_and_time/game_date_and_time_updater";

function getConnectedArea(
  area: SubLocation,
  direction: Direction
): SubLocation | null;
function getConnectedArea(
  area: Location,
  direction: Direction
): Location | null;
function getConnectedArea(
  area: SubRegion,
  direction: Direction
): SubRegion | null;
function getConnectedArea(area: Region, direction: Direction): Region | null;
function getConnectedArea(
  area: SubAreas,
  direction: Direction
): SubAreas | null;
function getConnectedArea(
  area: SubAreas,
  direction: Direction
): SubAreas | null {
  const parent = area.parent;
  const connectedAreas = parent.childrenData
    .get(area as any)
    ?.get(direction)?.area;
  let canEnterConnectedAreaFromDirection = true;

  const checkDirection = (
    flag:
      | MapEntityFlags.INACCESSIBLE_FROM_UP
      | MapEntityFlags.INACCESSIBLE_FROM_EAST
      | MapEntityFlags.INACCESSIBLE_FROM_SOUTH
      | MapEntityFlags.INACCESSIBLE_FROM_WEST
      | MapEntityFlags.INACCESSIBLE_FROM_NORTH
      | MapEntityFlags.INACCESSIBLE_FROM_DOWN
  ) => {
    return (connectedAreas?.flags ?? MapEntityFlags.NONE) & flag ? false : true;
  };
  switch (oppositeDirection[direction]) {
    case Direction.NORTH:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_NORTH
      );
      break;
    case Direction.EAST:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_EAST
      );
      break;
    case Direction.SOUTH:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_SOUTH
      );
      break;
    case Direction.WEST:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_WEST
      );
      break;
    case Direction.UP:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_UP
      );
      break;
    case Direction.DOWN:
      canEnterConnectedAreaFromDirection = checkDirection(
        MapEntityFlags.INACCESSIBLE_FROM_DOWN
      );
      break;
  }

  return canEnterConnectedAreaFromDirection ? connectedAreas ?? null : null;
}

export function warpToConnectedArea(direction: Direction) {
  const currArea = activeArea();
  if (currArea instanceof GlobalMap) {
    warpToArea(globalMap.uuid);
    return true;
  }

  const connectedArea = getConnectedArea(currArea, direction);

  if (connectedArea) {
    warpToArea(connectedArea.uuid);
    return true;
  }
  return false;
}

export function setPlayerLocation(destination: AreaUUID) {
  variables().player.areaId = destination;
}

/**
 * "Warp" to an area by loading the default passage for it and updating the location and sub location ids in the save data
 *
 * @param destination - Either a UUID or a passage name that is attached to any instance of a location, sub-location, etc
 * @param doNotLoadPassage - If true, then this doesn't load up the default passage of the new area. Useful if you want to change the player's area but don't want to load up the default passage associated with the area.
 * @returns
 */
export function warpToArea(
  destination: AreaUUID | string,
  doNotLoadPassage = false
) {
  const currentArea = activeArea();
  const possibleUUIDIfDestinationIsAPassageName =
    globalMap.uuidFromPassage(destination);
  const destinationArea = possibleUUIDIfDestinationIsAPassageName
    ? getAreaFromUUID(possibleUUIDIfDestinationIsAPassageName)
    : getAreaFromUUID(destination as AreaUUID);
  if (currentArea == destinationArea) return;

  let passageToLoad = destinationArea.passage ?? backupPassageName;
  // if (typeof destination == 'string') {

  //   passageToLoad =

  // } else {
  //   passageToLoad = destination.passage ?? backupPassageName
  // }

  if (passageToLoad == backupPassageName) {
    console.warn(
      `Destination passage not found. Falling back to backup passage. The destination uuid is:`
    );
    console.warn(destination);
  }

  setLastWarpDestination(currentArea.uuid);

  setPlayerLocation(
    possibleUUIDIfDestinationIsAPassageName ?? (destination as AreaUUID)
  );

  // Calculate the amount of time to travel between the areas
  globalMap.getDistance2(currentArea, destinationArea).then((dist) => {
    updateTimeWithDistance(dist);
  });

  // load the passage
  if (!doNotLoadPassage) {
    Engine.play(passageToLoad);
  }
}
export function isNavigationButtonUsable(direction: Direction) {
  const currArea = activeArea();

  return currArea instanceof GlobalMap
    ? false
    : getConnectedArea(currArea, direction)
    ? true
    : false;
}
