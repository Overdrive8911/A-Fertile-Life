// Determines the distance between the location/subLocation of the the prev and curr passage using their tags
setup.getDistanceToTravelFromLocation = () => {
  const prevPassageTitle = previous();
  const currPassageTitle = State.active.title;

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

  // Get location indexes in setup.locations
  const prevPassageLocationIndex = getLocationDataIndex(prevPassageLocation);
  const prevPassageSubLocationIndex = getSubLocationDataIndex(
    prevPassageSubLocation,
    prevPassageLocation
  );
  const currPassageLocationIndex = getLocationDataIndex(currPassageLocation);
  const currPassageSubLocationIndex = getSubLocationDataIndex(
    currPassageSubLocation,
    currPassageLocation
  );

  // Appease typescript. This should never happen
  if (setup.locations === undefined) {
    setup.locations = [];
  }

  // Access the coords using the indexes
  let prevPassageLocationCoords: [x: number, y: number, z?: number];
  let prevPassageSubLocationCoords: [x: number, y: number, z?: number];
  let currPassageLocationCoords: [x: number, y: number, z?: number];
  let currPassageSubLocationCoords: [x: number, y: number, z?: number];

  prevPassageLocationCoords = setup.locations[prevPassageLocationIndex].coords;

  if (
    setup.locations[prevPassageLocationIndex].subLocations !== undefined &&
    prevPassageSubLocationIndex !== invalidSubLocation
  ) {
    prevPassageSubLocationCoords =
      setup.locations[prevPassageLocationIndex].subLocations[
        prevPassageSubLocationIndex
      ].coords;
  } else {
    // no sub location exists so default the coords to [0, 0, 0]
    prevPassageSubLocationCoords = [0, 0, 0];
  }

  currPassageLocationCoords = setup.locations[currPassageLocationIndex].coords;

  if (
    setup.locations[currPassageLocationIndex].subLocations !== undefined &&
    currPassageSubLocationIndex !== invalidSubLocation
  ) {
    currPassageSubLocationCoords =
      setup.locations[currPassageLocationIndex].subLocations[
        currPassageSubLocationIndex
      ].coords;
  } else {
    // no sub location exists so default the coords to [0, 0, 0]
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

  // Assuming we are looking for the shortest distance between location A & subLocation A and location B & subLocation B, it would be the combined sum of the shortest distance between location A & subLocation A, location B & subLocation B, and location A & Location B.
  // Assume that when comparing a subLocation to its own location, the coordinates on the location are [0, 0, 0]
  const defaultLocationCoords: [x: number, y: number, z: number] = [0, 0, 0];

  let distBetweenPrevPassageLocationAndSubLocation: number;
  let distBetweenCurrPassageLocationAndSubLocation: number;
  let distBetweenPrevPassageLocationAndCurrPassageLocation: number;
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
  const getRandomNumberFromRangeInclusive = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
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

  const min = 0,
    max = 1;
  totalDistanceBetweenLocationsInMetres =
    (distBetweenPrevPassageLocationAndSubLocation +
      distBetweenCurrPassageLocationAndSubLocation +
      distBetweenPrevPassageLocationAndCurrPassageLocation) *
    getRandomNumberFromRangeInclusive(
      distanceToMetresConversionRange[min],
      distanceToMetresConversionRange[max]
    );

  // Return a floating point number with 2 decimal places
  return parseFloat(totalDistanceBetweenLocationsInMetres.toFixed(2));
};
