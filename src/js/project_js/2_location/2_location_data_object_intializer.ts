// NOTE - The default name of the sub locations are the capital forms of the indexes of their names, e.g MapSubLocation.HALLWAY_4 has a default name of "Hallway", MapSubLocation.CORRIDOR has a default name of "Corridor". Use this for unimportant areas with duplicates
setup.initializeExtraLocationData = () => {
  const mapLocations = Object.values(MapLocation).filter((value) => {
    return typeof value == "number";
  }) as MapLocation[];

  mapLocations.forEach((location) => {
    // TODO - Populate all Location Maps

    // Proceed if an entry in `gLocationData` exists
    if (setup.locationData[location]) {
      // Populate all Sub Location Maps
      populateSubLocationMap(location);

      // Set the names of all sub locations (since some rely on their defaults)
      if (setup.locationData[location].subLocations) {
        Object.entries(setup.locationData[location].subLocations).forEach(
          ([subLocationId]) => {
            setup.locationData[location].subLocations[
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
};
