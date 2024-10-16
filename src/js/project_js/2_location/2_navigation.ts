namespace NSLocation {
  // This will try to move the player in a particular direction from an initial location (and an optional sub location) in the 2d/3d location/sub location map array. If the direction is unblocked and another location/sub location is found, then "warp" to that map and return true else return false. If the parameter, "doNotWarp", is set to true, no navigation actually happens and the function can be used to check if a path is navigable
  export function navigateInDirectionOnMap(
    direction: GameMapDirection,
    initialLocationId: MapLocation,
    initialSubLocationId?: MapSubLocation,
    doNotWarp = false
  ) {
    // Don't do anything if a dialog is open
    if (Dialog.isOpen()) return false;

    // Set the last warp destination to null. If this function returns true, then this variable will be re-updated with a proper value
    lastWarpDestination = { location: null, subLocation: null };

    // TODO - Add proper support for location maps later
    let mapArray: GameMapForSubLocations<number>;
    let position: LocationCoords; // Stores a copy for use in a loop

    const locationData = gLocationData[initialLocationId];

    if (initialSubLocationId != undefined || initialSubLocationId != null) {
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
        position = getEffectiveCoordInGameMap(
          locationData.subLocations[initialSubLocationId].coords,
          locationData.minSubLocationCoords
        ) as LocationCoords;

        const possibleSubLocationToWarpTo = findClosestSubLocationInDirection(
          direction,
          position,
          mapArray
        );

        if (
          possibleSubLocationToWarpTo != GameMapCoordinate.BLOCKED &&
          possibleSubLocationToWarpTo != GameMapCoordinate.EMPTY
        ) {
          // Warp to the sub location if "doNotWarp" is false
          return warpToArea(
            initialLocationId,
            possibleSubLocationToWarpTo,
            doNotWarp
          );
        }

        // Either nothing was found or the direction was blocked
        return false;
      }
    } else {
      // Use the location map instead if the location id is the only id given
      // TODO
    }
  }

  // "Warp" to an area by loading the default passage for it and updating the location and sub location ids in the save data. If `doNotWarp` is true, then this just checks if the passage to warp to exists
  export function warpToArea(
    locationIdToWarpTo: MapLocation,
    subLocationIdToWarpTo?: MapSubLocation,
    doNotWarp = false
  ) {
    const locationTag = getLocationFromMapLocationId(locationIdToWarpTo);
    let subLocationTag = "";
    if (subLocationIdToWarpTo != undefined) {
      subLocationTag = getSubLocationFromMapSubLocationId(
        subLocationIdToWarpTo
      );
    }
    const defaultTag = "default"; // To denote whether a passage is the default one to load under non-story circumstances (i.e through normal player interaction)

    const defaultPassageToLoad = Story.lookup("tags", locationTag).filter(
      (passage) => {
        const tags = passage.tags;
        const hasDefaultTag = tags.includes(defaultTag);

        if (!hasDefaultTag) return false;

        if (subLocationIdToWarpTo != undefined) {
          const hasSubLocationTag = tags.includes(subLocationTag);

          // Check for a passage with the specific location and sub location tag
          if (hasSubLocationTag) return true;

          // // Else look for a "common" passage e.g HALLWAY_1 and HALLWAY_2 have a "common" passage of HALLWAY and will load that if they don't have more specific ones. "Common" passages only apply to sub locations with numbers appended to the end but otherwise have the same text.
          // const hasCommonSubLocationTag = tags.includes(
          //   subLocationTag.split(/[0-9]/)[0]
          // );
          // if (hasCommonSubLocationTag) return true;
        } else {
          // Pick the passage that has no sub location tag of any kind but also has the default tag. For areas without sub locations
          return !tags.includes("subLocation_");
        }
      }
    )[0];

    if (!defaultPassageToLoad) {
      // Undefined. It didn't find any passage matching the tags
      console.warn(
        `Did not find any passage with tags matching "${locationTag}", "${subLocationTag}", and "${defaultTag}". \n\nThe navigation button(s), if any, that warp to the passage in question may be disabled.`
      );
      return false;
    } else {
      // Update the last warp destination
      lastWarpDestination = {
        location: locationIdToWarpTo,
        subLocation:
          subLocationIdToWarpTo != undefined && subLocationIdToWarpTo != null
            ? subLocationIdToWarpTo
            : null,
      };

      // load the passage
      if (!doNotWarp) Engine.play(defaultPassageToLoad.title);
      return true;
    }
  }
  // MapLocation.FERTILO_INC_GROUND_FLOOR;
  // MapSubLocation.CORRIDOR_1;
  // window.test = warpToArea;

  export function canMoveInDirectionOnMap(
    direction: GameMapDirection,
    initialLocationId: MapLocation,
    initialSubLocationId?: MapSubLocation
  ) {
    // TODO - Add support for location maps
    if (initialSubLocationId != undefined) {
      const subLocationData =
        gLocationData[initialLocationId].subLocations[initialSubLocationId];

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

  // TODO - Make this more performant
  export function findClosestSubLocationInDirection(
    direction: GameMapDirection,
    currentCoordsInMapArray: LocationCoords,
    mapArray: GameMapForSubLocations<number>
  ) {
    let axisToSearch: LocationCoordIndex;
    let checkForward: boolean; // If true, follow the move towards positive values on an axis else move closer towards negatives (e.g if the current axis index is 6, checkForward = true means that it will look at 7,8,9,10... else it will look at 5,4,3,2...)
    let position: LocationCoords = [...currentCoordsInMapArray]; // Don't pass by reference

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

    const arrayOfSubLocations = Object.values(MapSubLocation).filter(
      (subLocation) => {
        return (
          typeof subLocation == "number" && subLocation != MapSubLocation.DUMMY
        );
      }
    ) as MapSubLocation[];

    // Loop towards the end of the axis (gGameMapSubLocationArraySize - 1 or 0) while checking if another sub location persists with each axis increment/decrement e.g (assuming the direction is east and the initial position is [52, 56], it will search elements [53, 56], [54, 56], [55, 56],... till the end of the axis's array. If a valid id to another sub location is found before then, stop the loop and warp to that sub location's default passage)
    while (
      position[axisToSearch] <
        (axisToSearch == LocationCoordIndex.X
          ? mapArray.length
          : mapArray[0].length) &&
      position[axisToSearch] >= 0
    ) {
      const valueInCurrentPosition =
        mapArray[position[LocationCoordIndex.X]][
          position[LocationCoordIndex.Y]
        ];
      const indexOfSubLocationToWarpTo = arrayOfSubLocations.indexOf(
        valueInCurrentPosition
      );

      if (
        valueInCurrentPosition != subLocationId &&
        // Check whether the value at the position in `mapArray` exists in MapSubLocation
        indexOfSubLocationToWarpTo != -1
      ) {
        // Return the id of the new sub location to warp to
        return arrayOfSubLocations[indexOfSubLocationToWarpTo];
      }

      // Hit an impassable area on the map so return
      if (valueInCurrentPosition == GameMapCoordinate.BLOCKED) {
        return GameMapCoordinate.BLOCKED;
      }

      position[axisToSearch] += checkForward ? 1 : -1;
    }

    // Didn't find anything
    return GameMapCoordinate.EMPTY;
  }

  export function isNavigationButtonUsable(direction: GameMapDirection) {
    const currLocation: MapLocation = variables().player.locationData.location;
    const currSubLocation: MapSubLocation =
      variables().player.locationData.subLocation;

    // Check if the current passage has the "defaultTag" and if `navigateInDirectionOnMap()` is true. It will also consider whether the passage to warp to exists
    return (
      Story.get(passage()).tags.includes("default") &&
      navigateInDirectionOnMap(direction, currLocation, currSubLocation, true)
    );
  }
}
