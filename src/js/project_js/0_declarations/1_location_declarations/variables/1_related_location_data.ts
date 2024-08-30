namespace NSLocation {
  const getRelatedLocationsUsingLocationContainerValue = (
    locationContainer: MapLocationContainer
  ) => {
    const locations = Object.values(MapLocation).filter((value) => {
      return typeof value == "number";
    }) as MapLocation[];
    return locations.filter((value) => {
      return value >> gLeftShiftValue == locationContainer;
    });
  };
  // Pass "this" as the parameter
  const getRelatedLocations = (gRelatedLocationsEntry: any) => {
    let locContainer = MapLocationContainer.OTHER;

    for (const key in gRelatedLocations) {
      if (Object.prototype.hasOwnProperty.call(gRelatedLocations, key)) {
        if (
          gRelatedLocations[parseInt(key) as MapLocationContainer] ==
          gRelatedLocationsEntry
        ) {
          locContainer = parseInt(key);
        }
      }
    }
    return getRelatedLocationsUsingLocationContainerValue(locContainer);
  };

  // A bunch of locations represent single floors of a total structure/building. This should help with grouping them
  // NOTE - Just copypaste the getter function in each entry
  export const gRelatedLocations: RelatedMapLocations = {
    [MapLocationContainer.FERTILO_INC]: {
      name: "Fertilo Inc",
      generalCoords: [45000, 45000],
      get relatedLocations() {
        return getRelatedLocations(this);
      },
    },
    [MapLocationContainer.PLAYER_HOUSE]: {
      name: "Your House",
      generalCoords: [1, 1],
      get relatedLocations() {
        return getRelatedLocations(this);
      },
    },
    [MapLocationContainer.OTHER]: {
      name: "???",
      generalCoords: [1, 1],
      get relatedLocations() {
        return getRelatedLocations(this);
      },
    },
  };
}
