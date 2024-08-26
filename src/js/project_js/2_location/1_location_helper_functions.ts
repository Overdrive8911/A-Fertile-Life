// Determines the distance between the location/subLocation of the the previous and current passage using their tags
setup.getDistanceToTravelFromLocation = (
  prevPassageTitle: string,
  currPassageTitle: string
) => {
  // const prevPassageTitle = previous();
  // const currPassageTitle = State.active.title;

  // Get the prev passage's location and sub location if any
  let prevPassageLocation: string = "",
    prevPassageSubLocation: string = "",
    currPassageLocation: string = "",
    currPassageSubLocation: string = "";

  for (let i = 0; i < tags(prevPassageTitle).length; i++) {
    let locationRegexArrResult =
      tags(prevPassageTitle)[i].match(/location_[^\s]*/);
    if (locationRegexArrResult) {
      prevPassageLocation = locationRegexArrResult[0];
    }

    let subLocationRegexArrResult =
      tags(prevPassageTitle)[i].match(/subLocation_[^\s]*/);
    if (subLocationRegexArrResult) {
      prevPassageSubLocation = subLocationRegexArrResult[0];
    }
  }

  // Get the curr passage's location and sub location if any
  for (let i = 0; i < tags(currPassageTitle).length; i++) {
    let locationRegexArrResult =
      tags(currPassageTitle)[i].match(/location_[^\s]*/);
    if (locationRegexArrResult) {
      currPassageLocation = locationRegexArrResult[0];
    }

    let subLocationRegexArrResult =
      tags(currPassageTitle)[i].match(/subLocation_[^\s]*/);
    if (subLocationRegexArrResult) {
      currPassageSubLocation = subLocationRegexArrResult[0];
    }
  }

  // console.log(`${prevPassageLocation} and ${prevPassageSubLocation}`);
  // console.log(`${currPassageLocation} and ${currPassageSubLocation}`);

  if (!prevPassageLocation || !currPassageLocation) {
    // Either the prev or curr passage isn't a location so no need to calculate any distance
    return 0;
  }

  // // Get location indexes in setup.locations
  // const prevPassageLocationIndex = getLocationDataIndex(prevPassageLocation);
  // const prevPassageSubLocationIndex = getSubLocationDataIndex(
  //   prevPassageSubLocation,
  //   prevPassageLocation
  // );
  // const currPassageLocationIndex = getLocationDataIndex(currPassageLocation);
  // const currPassageSubLocationIndex = getSubLocationDataIndex(
  //   currPassageSubLocation,
  //   currPassageLocation
  // );

  // Access the coords using the indexes
  let prevPassageLocationCoords: LocationCoords;
  let prevPassageSubLocationCoords: LocationCoords;
  let currPassageLocationCoords: LocationCoords;
  let currPassageSubLocationCoords: LocationCoords;

  prevPassageLocationCoords =
    setup.locationData[getMapLocationIdFromLocation(prevPassageLocation)]
      .coords;

  if (
    setup.locationData[getMapLocationIdFromLocation(prevPassageLocation)]
      .subLocations !== undefined &&
    prevPassageSubLocation
  ) {
    prevPassageSubLocationCoords =
      setup.locationData[getMapLocationIdFromLocation(prevPassageLocation)]
        .subLocations[
        getMapSubLocationIdFromSubLocation(prevPassageSubLocation)
      ].coords;
  } else {
    // no sub location exists so default the coords to [0, 0, 0]
    prevPassageSubLocationCoords = [0, 0, 0];
  }

  currPassageLocationCoords =
    setup.locationData[getMapLocationIdFromLocation(currPassageLocation)]
      .coords;

  if (
    setup.locationData[getMapLocationIdFromLocation(currPassageLocation)]
      .subLocations !== undefined &&
    currPassageSubLocation
  ) {
    currPassageSubLocationCoords =
      setup.locationData[getMapLocationIdFromLocation(currPassageLocation)]
        .subLocations[
        getMapSubLocationIdFromSubLocation(currPassageSubLocation)
      ].coords;
  } else {
    // no sub location exists so default the coords to [0, 0, 0]
    currPassageSubLocationCoords = [0, 0, 0];
  }

  // Just to make sure nothing is undefined/null
  if (!prevPassageSubLocationCoords) {
    prevPassageSubLocationCoords = [0, 0, 0];
  }
  if (!currPassageSubLocationCoords) {
    currPassageSubLocationCoords = [0, 0, 0];
  }
  // Set the z-coordinate as 0 if it doesn't exist
  const x_coord = 0,
    y_coord = 1,
    z_coord = 2;
  if (!prevPassageLocationCoords[z_coord]) {
    prevPassageLocationCoords[z_coord] = 0;
  }
  if (!prevPassageSubLocationCoords[z_coord]) {
    prevPassageSubLocationCoords[z_coord] = 0;
  }
  if (!currPassageLocationCoords[z_coord]) {
    currPassageLocationCoords[z_coord] = 0;
  }
  if (!currPassageSubLocationCoords[z_coord]) {
    currPassageSubLocationCoords[z_coord] = 0;
  }

  // Assuming we are looking for the shortest distance between location A & subLocation A and location B & subLocation B, it would be the combined sum of the shortest distance between location A & subLocation A, location B & subLocation B, and location A & Location B. If location A & location B are the same, then find the shortest distance between subLocation A and subLocation B
  // Assume that when comparing a subLocation to its own location, the coordinates on the location are [0, 0, 0]
  const defaultLocationCoords: [x: number, y: number, z: number] = [0, 0, 0];

  let distBetweenPrevPassageLocationAndSubLocation: number;
  let distBetweenCurrPassageLocationAndSubLocation: number;
  let distBetweenPrevPassageLocationAndCurrPassageLocation: number;
  let distBetweenPrevPassageSubLocationAndCurrPassageSubLocation: number;
  let totalDistanceBetweenLocationsInMetres: number;

  const getDistanceBetweenTwoPoints = (
    x1: number,
    y1: number,
    z1: number = 0,
    x2: number,
    y2: number,
    z2: number = 0
  ) => {
    return Math.sqrt(
      Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
    );
  };

  distBetweenPrevPassageLocationAndSubLocation = getDistanceBetweenTwoPoints(
    defaultLocationCoords[x_coord],
    defaultLocationCoords[y_coord],
    defaultLocationCoords[z_coord],
    prevPassageSubLocationCoords[x_coord],
    prevPassageSubLocationCoords[y_coord],
    prevPassageSubLocationCoords[z_coord]
  );

  distBetweenCurrPassageLocationAndSubLocation = getDistanceBetweenTwoPoints(
    defaultLocationCoords[x_coord],
    defaultLocationCoords[y_coord],
    defaultLocationCoords[z_coord],
    currPassageSubLocationCoords[x_coord],
    currPassageSubLocationCoords[y_coord],
    currPassageSubLocationCoords[z_coord]
  );

  distBetweenPrevPassageLocationAndCurrPassageLocation =
    getDistanceBetweenTwoPoints(
      prevPassageLocationCoords[x_coord],
      prevPassageLocationCoords[y_coord],
      prevPassageLocationCoords[z_coord],
      currPassageLocationCoords[x_coord],
      currPassageLocationCoords[y_coord],
      currPassageLocationCoords[z_coord]
    );

  distBetweenPrevPassageSubLocationAndCurrPassageSubLocation =
    getDistanceBetweenTwoPoints(
      prevPassageSubLocationCoords[x_coord],
      prevPassageSubLocationCoords[y_coord],
      prevPassageSubLocationCoords[z_coord],
      currPassageSubLocationCoords[x_coord],
      currPassageSubLocationCoords[y_coord],
      currPassageSubLocationCoords[z_coord]
    );

  const min = 0,
    max = 1;

  if (prevPassageLocation !== currPassageLocation) {
    totalDistanceBetweenLocationsInMetres =
      (distBetweenPrevPassageLocationAndSubLocation +
        distBetweenCurrPassageLocationAndSubLocation +
        distBetweenPrevPassageLocationAndCurrPassageLocation) *
      randomFloat(
        distanceToMetresConversionRange[min],
        distanceToMetresConversionRange[max]
      );
  } else {
    // Just use the distance between subLocations
    totalDistanceBetweenLocationsInMetres =
      distBetweenPrevPassageSubLocationAndCurrPassageSubLocation *
      randomFloat(
        distanceToMetresConversionRange[min],
        distanceToMetresConversionRange[max]
      );
  }

  // Return a floating point number with 2 decimal places
  return parseFloat(totalDistanceBetweenLocationsInMetres.toFixed(2));
};

function getLocationFromPassageTitle(passageTitle: string) {
  const passageTags = tags(passageTitle);

  for (const tag of passageTags) {
    let locationArr = tag.match(/location_[^\s]*/);

    // There should only be 1 location tag
    if (locationArr) {
      return locationArr[0];
    }
  }

  // Location tag was not found
  return undefined;
}

function getSubLocationFromPassageTitle(passageTitle: string) {
  const passageTags = tags(passageTitle);

  for (const tag of passageTags) {
    let subLocationArr = tag.match(/subLocation_[^\s]*/);

    // There should only be 1 location tag
    if (subLocationArr) {
      return subLocationArr[0];
    }
  }

  // Location tag was not found
  return undefined;
}

function getLocationFromMapLocationId(input: MapLocation) {
  // Assume we're using MapLocation.FERTILO_INC as the input

  // The result here would be "FERTILO_INC"
  const rawLocationString = MapLocation[input];

  // The result here would be ["FERTILO", "INC"]
  const rawLocationStringArray = rawLocationString.split("_");

  // The result here would be ["fertilo", "Inc"]
  const convertedLocationStringArray = rawLocationStringArray.map(
    (string, index) => {
      if (index == 0) {
        // Convert the first word to lowercase
        return string.toLocaleLowerCase();
      } else {
        // Convert every other word to capital case (e.g "ROOM" to "Room")
        return string.charAt(0) + string.slice(1).toLocaleLowerCase();
      }
    }
  );

  // Concatenate the words in the array and add "location_" to the beginning
  let location = "location_";
  convertedLocationStringArray.forEach((string) => {
    location += string;
  });

  // We should have Location_fertiloInc here
  return location;
}

function getSubLocationFromMapSubLocationId(input: MapSubLocation) {
  // Assume we're using MapSubLocation.LIVING_ROOM as the input

  // The result here would be "LIVING_ROOM"
  const rawSubLocationString = MapSubLocation[input];

  // The result here would be ["LIVING", "ROOM"]
  const rawSubLocationStringArray = rawSubLocationString.split("_");

  // The result here would be ["living", "Room"]
  const convertedSubLocationStringArray = rawSubLocationStringArray.map(
    (string, index) => {
      if (index == 0) {
        // Convert the first word to lowercase
        return string.toLocaleLowerCase();
      } else {
        // Convert every other word to capital case (e.g "ROOM" to "Room")
        return string.charAt(0) + string.slice(1).toLocaleLowerCase();
      }
    }
  );

  // Concatenate the words in the array and add "subLocation_" to the beginning
  let subLocation = "subLocation_";
  convertedSubLocationStringArray.forEach((string) => {
    subLocation += string;
  });

  // We should have subLocation_livingRoom here
  return subLocation;
}

function getMapLocationIdFromLocation(input: string): MapLocation | undefined {
  // Assume we are working with Location_fertiloInc

  // Remove "location_". We should have "fertiloInc" here
  const cleanInput = input.split("location_")[1];

  // Split the input at points wherever it finds a capital letter (e.g ["fertilo", "nc"])
  const regexp = /(?<=[a-z])([A-Z0-9])/;
  let splitInput = cleanInput.split(regexp);

  // Aside from index[0], combine every remaining 2 pairs of elements (so [..., "R", "oom"] becomes [..., "Room"])
  let processedInput: string[] = [];
  for (let i = 0; i < (splitInput.length - 1) / 2 + 1; i++) {
    // const element = array[i];
    if (i == 0) {
      // Add the first string
      processedInput[i] = splitInput[i];
    } else {
      /* Use the formula `processedInput[i] = splitInput[(i*2) - 1] + splitInput[i * 2]` since it matches up well with
      index 0 = 0
      index 1 = 1 + 2;
      index 2 = 3 + 4;
      index 3 = 5 + 6;
      index 4 = 7 + 8;
      index 5 = 9 + 10;
      and so on
      */
      processedInput[i] = splitInput[i * 2 - 1] + splitInput[i * 2];
    }
  }
  // We should have ["fertilo", "Inc"] now

  // Convert the substrings to upper case and combine them with "_"
  // We should have "FERTILO_INC"
  let combinedUpperCaseString = "";
  processedInput.forEach((value, index) => {
    if (index == 0) {
      // Just convert the first one to uppercase and append it
      combinedUpperCaseString += value.toLocaleUpperCase();
    } else {
      // Do the same but append an underscore before the string itself
      combinedUpperCaseString += `_${value.toLocaleUpperCase()}`;
    }
  });

  if (
    (MapLocation[combinedUpperCaseString as any] as any as number) == undefined
  ) {
    console.error(
      `MapLocation entry: ${
        MapLocation[combinedUpperCaseString as any] as any as number
      }, index String: ${combinedUpperCaseString}\n\nMapLocation.${combinedUpperCaseString} does not exist`
    );
  }

  if (
    setup.locationData[
      MapLocation[combinedUpperCaseString as any] as any as MapLocation
    ] == undefined
  ) {
    console.error(
      `MapLocation entry: ${
        MapLocation[combinedUpperCaseString as any] as any as number
      }, index String: ${combinedUpperCaseString}\n\nMapLocation.${combinedUpperCaseString} does not have its entry in setup.locationData`
    );
  }
  return MapLocation[combinedUpperCaseString as any] as any as number;
}

function getMapSubLocationIdFromSubLocation(
  input: string
): MapSubLocation | undefined {
  // Assume we are working with subLocation_playerRoom

  // Remove "subLocation_". We should have "playerRoom" here
  const cleanInput = input.split("subLocation_")[1];

  // Split the input at points wherever it finds a capital letter (or a number; which would be situated at the end) (e.g ["player", "R", "oom"])
  const regexp = /(?<=[a-z])([A-Z0-9])/;
  let splitInput = cleanInput.split(regexp);

  // Aside from index[0], combine every remaining 2 pairs of elements (so [..., "R", "oom"] becomes [..., "Room"])
  let processedInput: string[] = [];
  for (let i = 0; i < (splitInput.length - 1) / 2 + 1; i++) {
    // const element = array[i];
    if (i == 0) {
      // Add the first string
      processedInput[i] = splitInput[i];
    } else {
      /* Use the formula `processedInput[i] = splitInput[(i*2) - 1] + splitInput[i * 2]` since it matches up well with
      index 0 = 0
      index 1 = 1 + 2;
      index 2 = 3 + 4;
      index 3 = 5 + 6;
      index 4 = 7 + 8;
      index 5 = 9 + 10;
      and so on
      */
      processedInput[i] = splitInput[i * 2 - 1] + splitInput[i * 2];
    }
  }
  // We should have ["player", "Room"] here

  // Convert the substrings to upper case and combine them with "_"
  // We should have "PLAYER_ROOM"
  let combinedUpperCaseString = "";
  processedInput.forEach((value, index) => {
    if (index == 0) {
      // Just convert the first one to uppercase and append it
      combinedUpperCaseString += value.toLocaleUpperCase();
    } else {
      // Do the same but append an underscore before the string itself
      combinedUpperCaseString += `_${value.toLocaleUpperCase()}`;
    }
  });

  if (
    (MapSubLocation[combinedUpperCaseString as any] as any as number) ==
    undefined
  ) {
    console.error(
      `MapSubLocation entry: ${
        MapSubLocation[combinedUpperCaseString as any] as any as number
      }, index String: ${combinedUpperCaseString}\n\nMapSubLocation.${combinedUpperCaseString} does not exist.`
    );
  }

  // TODO - Make stuff like Buses have a location and sub location with the same name
  if (
    setup.locationData[
      variables().player.locationData.location as any as MapLocation
    ].subLocations
  ) {
    if (
      setup.locationData[
        variables().player.locationData.location as any as MapLocation
      ].subLocations[
        MapSubLocation[combinedUpperCaseString as any] as any as MapSubLocation
      ] == undefined
    ) {
      console.error(
        `MapSubLocation entry: ${
          MapSubLocation[combinedUpperCaseString as any] as any as number
        }, index String: ${combinedUpperCaseString}\n\nMapSubLocation.${combinedUpperCaseString} does not have its entry in setup.locationData`
      );
    }
  }

  return MapSubLocation[combinedUpperCaseString as any] as any as number;
}

function getDefaultNameOfSubLocation(
  locationId: MapLocation,
  subLocationId: MapSubLocation
) {
  // Check if there's an entry in `gLocationData`
  if (setup.locationData[locationId].subLocations[subLocationId]) {
    const subLocation =
      setup.locationData[locationId].subLocations[subLocationId];

    // If there's already a name set, return it
    if (subLocation.name) return subLocation.name;

    // If the name is not supplied, default it to the name of the id in capital case, i.e MapSubLocation.HALLWAY_4 will have a default name of "Hallway", MapSubLocation.CORRIDOR will have a default name of "Corridor"
    const rawName = MapSubLocation[subLocationId].split(/(?<=[A-Z])_\d+$/)[0];
    return rawName.charAt(0) + rawName.slice(1).toLocaleLowerCase();
  }
}

function getEffectiveCoordInGameMap(
  coord: number | LocationCoords,
  mapArraySize: number
) {
  const coordinates = typeof coord == "number" ? [coord] : [...coord];

  let adjustedCoords: typeof coordinates = [];
  coordinates.forEach((coordinate) => {
    if (
      coordinate < (mapArraySize / 2) * -1 /* Below lower bounds */ ||
      coordinate > mapArraySize / 2 - 1 /* Above upper bounds */
    ) {
      console.error(
        `The location/sub location coordinate, ${coord}, is too small to have a valid (without truncating) relative value in a map ${mapArraySize} elements long. Increase the map's size to a higher even number OR ensure that the coordinate is not below ${
          (mapArraySize / 2) * -1
        } and not above ${
          mapArraySize / 2 - 1
        } OTHERWISE the location/sub location position may have unintended values`
      );
    }

    adjustedCoords.push(Math.abs(coordinate + mapArraySize / 2) % mapArraySize);
  });

  return adjustedCoords.length == 1
    ? adjustedCoords[0]
    : (adjustedCoords as LocationCoords);
}

function getActualCoordFromGameMapCoord(
  gameMapCoord: number,
  mapArraySize: number
) {
  return gameMapCoord - mapArraySize / 2;
}
