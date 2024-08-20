// This will try to move the player in a particular direction from an initial location (and an optional sub location) in the 2d/3d location/sub location map array. If the direction is unblocked and another location/sub location is found, then "warp" to that map
function navigateInDirectionOnMap(
  direction: GameMapDirection,
  initialLocationId: MapLocation,
  initialSubLocationId?: MapSubLocation
) {
  // TODO - Add proper support for location maps later
  let mapArray: GameMap<typeof gGameMapSubLocationArraySize>;
  let position: LocationCoords; // Stores a copy for use in a loop

  const locationData = setup.locationData[initialLocationId];

  if (initialSubLocationId != undefined) {
    if (
      canMoveInDirectionOnMap(
        direction,
        initialLocationId,
        initialSubLocationId
      )
    ) {
      // Use the sub location map over the location map if an appropriate id is given
      mapArray = locationData.subLocationMap;

      // initialPosition = locationData.subLocations[initialSubLocationId].coords;
      position = [
        getEffectiveCoordInGameMap(
          locationData.subLocations[initialSubLocationId].coords[
            LocationCoordIndex.X
          ],
          gGameMapSubLocationArraySize
        ),
        getEffectiveCoordInGameMap(
          locationData.subLocations[initialSubLocationId].coords[
            LocationCoordIndex.Y
          ],
          gGameMapSubLocationArraySize
        ),
      ];

      const possibleSubLocationToWarpTo = findClosestSubLocationInDirection(
        direction,
        position,
        mapArray
      );

      if (
        possibleSubLocationToWarpTo != GameMapCoordinate.BLOCKED &&
        possibleSubLocationToWarpTo != GameMapCoordinate.EMPTY
      ) {
        // Warp to the sub location
        warpToArea(initialLocationId, possibleSubLocationToWarpTo);
        return true;
      }

      // Either nothing was found or the direction was blocked
      return false;
    }
  } else {
    // Use the location map instead if the location id is the only id given
    // TODO
  }
}

// "Warp" to an area by loading the default passage for it and updating the location and sub location ids in the save data
function warpToArea(
  locationIdToWarpTo: MapLocation,
  subLocationIdToWarpTo?: MapSubLocation
) {
  const locationTag = getLocationFromMapLocationId(locationIdToWarpTo);
  let subLocationTag = "";
  if (subLocationIdToWarpTo != undefined) {
    subLocationTag = getSubLocationFromMapSubLocationId(subLocationIdToWarpTo);
  }
  const defaultTag = "default"; // To denote whether a passage is the default one to load under non-story circumstances (i.e through normal player interaction)

  const defaultPassageToLoad = Story.lookup("tags", locationTag).filter(
    (passage) => {
      if (subLocationIdToWarpTo != undefined) {
        return (
          passage.tags.includes(defaultTag) &&
          passage.tags.includes(subLocationTag)
        );
      } else {
        // Pick the passage that has no sub location tag of any kind but also has the default tag
        return (
          passage.tags.includes(defaultTag) &&
          !passage.tags.includes("subLocation_")
        );
      }
    }
  )[0];

  if (!defaultPassageToLoad) {
    // Undefined. It didn't find any passage matching the tags
    console.error(
      `Did not find any passage with tags matching ${locationTag}, ${subLocationTag}, and ${defaultTag}`
    );
  } else {
    // load the passage
    console.log(defaultPassageToLoad.title);
    Engine.play(defaultPassageToLoad.title);
  }
}
// MapLocation.FERTILO_INC_GROUND_FLOOR;
// MapSubLocation.CORRIDOR_1;
// window.test = warpToArea;

function canMoveInDirectionOnMap(
  direction: GameMapDirection,
  initialLocationId: MapLocation,
  initialSubLocationId?: MapSubLocation
) {
  // TODO - Add support for location maps
  if (initialSubLocationId != undefined) {
    const subLocationData =
      setup.locationData[initialLocationId].subLocations[initialSubLocationId];

    // If `subLocationData.extraDirectionInfo` is undefined (which means that none of the directions can be blocked so default to empty/passable), `subLocationData.extraDirectionInfo` exists but the related direction data is undefined (so default to empty/passable), or `subLocationData.extraDirectionInfo` exists and the related direction data exists but it isn't `GameMapCoordinate.BLOCKED`, then the player can move in that direction else return false
    if (
      !subLocationData.extraDirectionInfo ||
      !subLocationData.extraDirectionInfo[
        GameMapDirection[
          direction
        ].toLocaleLowerCase() as keyof typeof subLocationData.extraDirectionInfo
      ] ||
      subLocationData.extraDirectionInfo[
        GameMapDirection[
          direction
        ].toLocaleLowerCase() as keyof typeof subLocationData.extraDirectionInfo
      ] != GameMapCoordinate.BLOCKED
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function findClosestSubLocationInDirection(
  direction: GameMapDirection,
  currentCoordsInMapArray: LocationCoords,
  mapArray: GameMapForSubLocations<typeof gGameMapSubLocationArraySize>
) {
  let axisToSearch: LocationCoordIndex;
  let checkForward: boolean; // If true, follow the move towards positive values on an axis else move closer towards negatives (e.g if the current axis index is 6, checkForward = true means that it will look at 7,8,9,10... else it will look at 5,4,3,2...)
  let position = currentCoordsInMapArray;

  const subLocationId: MapSubLocation =
    mapArray[currentCoordsInMapArray[LocationCoordIndex.X]][
      currentCoordsInMapArray[LocationCoordIndex.Y]
    ];

  // Set the variables to be used in the loop below
  switch (direction) {
    case GameMapDirection.NORTH:
      axisToSearch = LocationCoordIndex.Y;
      checkForward = true;
      break;
    case GameMapDirection.SOUTH:
      axisToSearch = LocationCoordIndex.Y;
      checkForward = false;
      break;
    case GameMapDirection.EAST:
      axisToSearch = LocationCoordIndex.X;
      checkForward = true;
      break;
    case GameMapDirection.WEST:
      axisToSearch = LocationCoordIndex.X;
      checkForward = false;
      break;
  }

  console.log(`axisToSearch: ${axisToSearch}`);

  const arrayOfSubLocations = Object.values(MapSubLocation).filter(
    (subLocation) => {
      return typeof subLocation == "number";
    }
  ) as MapSubLocation[];

  // Loop towards the end of the axis (gGameMapSubLocationArraySize - 1 or 0) while checking if another sub location persists with each axis increment/decrement e.g (assuming the direction is east and the initial position is [52, 56], it will search elements [53, 56], [54, 56], [55, 56],... till the end of the axis's array. If a valid id to another sub location is found before then, stop the loop and warp to that sub location's default passage)
  while (
    position[axisToSearch] < gGameMapSubLocationArraySize - 1 &&
    position[axisToSearch] > 0
  ) {
    console.log(position);
    console.log(
      mapArray[position[LocationCoordIndex.X]][position[LocationCoordIndex.Y]]
    );

    const indexOfSubLocationToWarpTo = arrayOfSubLocations.indexOf(
      mapArray[position[LocationCoordIndex.X]][position[LocationCoordIndex.Y]]
    );

    if (
      mapArray[position[LocationCoordIndex.X]][
        position[LocationCoordIndex.Y]
      ] != subLocationId &&
      // Check whether the value at the position in `mapArray` exists in MapSubLocation
      indexOfSubLocationToWarpTo != -1
    ) {
      // Return the id of the new sub location to warp to
      return arrayOfSubLocations[indexOfSubLocationToWarpTo];
    }

    // Hit an impassable area on the map so return
    if (
      mapArray[position[LocationCoordIndex.X]][
        position[LocationCoordIndex.Y]
      ] == GameMapCoordinate.BLOCKED
    ) {
      return GameMapCoordinate.BLOCKED;
    }

    position[axisToSearch] += checkForward ? 1 : -1;
  }

  // Didn't find anything
  return GameMapCoordinate.EMPTY;
}
