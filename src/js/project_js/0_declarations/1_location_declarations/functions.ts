namespace NSLocation {
  // Only here to avoid repetition since it's used in `setup.locationData`
  export function getSubLocationCoords(
    locationId: MapLocation,
    subLocationId: MapSubLocation
  ): LocationCoords {
    const coords =
      setup.locationData[locationId].subLocations[subLocationId].coords;
    return coords != undefined ? coords : [0, 0, 0];
  }

  // Same case with the above function. Use zeroes for x/y/z if you're not using them
  export function getCoordsRelativeToOtherSubLocation(
    locationId: MapLocation,
    subLocationId: MapSubLocation,
    xIncrement: number,
    yIncrement: number,
    zIncrement: number
  ): LocationCoords {
    const otherSubLocationCoords = getSubLocationCoords(
      locationId,
      subLocationId
    );

    // Prevent undefined values
    if (otherSubLocationCoords[LocationCoordIndex.Z] == undefined)
      otherSubLocationCoords[LocationCoordIndex.Z] = 0;

    let newCoords: LocationCoords = [
      otherSubLocationCoords[LocationCoordIndex.X] + xIncrement,
      otherSubLocationCoords[LocationCoordIndex.Y] + yIncrement,
      otherSubLocationCoords[LocationCoordIndex.Z] + zIncrement,
    ];

    if (newCoords[LocationCoordIndex.Z] == 0) {
      // No use of keeping it
      delete newCoords[LocationCoordIndex.Z];
    }

    return newCoords;
  }
}
