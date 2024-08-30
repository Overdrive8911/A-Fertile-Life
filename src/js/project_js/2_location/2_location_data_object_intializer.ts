namespace NSLocation {
  // NOTE - The default name of the sub locations are the capital forms of the indexes of their names, e.g MapSubLocation.HALLWAY_4 has a default name of "Hallway", MapSubLocation.CORRIDOR has a default name of "Corridor". Use this for unimportant areas with duplicates

  const mapLocations = Object.values(MapLocation).filter((value) => {
    return typeof value == "number";
  }) as MapLocation[];

  mapLocations.forEach((location) => {
    // TODO - Populate all Location Maps

    // Proceed if an entry in `gLocationData` exists without a sub location map but has sub locations
    if (
      gLocationData[location] &&
      !gLocationData[location].subLocationMap &&
      gLocationData[location].subLocations
    ) {
      // Populate all Sub Location Maps
      populateSubLocationMap(location);

      // Set the names of all sub locations (since some rely on their defaults)
      if (gLocationData[location].subLocations) {
        Object.entries(gLocationData[location].subLocations).forEach(
          ([subLocationId]) => {
            gLocationData[location].subLocations[
              parseInt(subLocationId) as MapSubLocation
            ].name = getDefaultNameOfSubLocation(
              location,
              parseInt(subLocationId) as MapSubLocation
            );
          }
        );
      }
    }
  });
}
