// Called at startup by StoryInit.
// Initializes setup.locations with all the possible locations, subLocations and nav_locations gotten from tags on passages
setup.initializeLocationDataArray = function () {
  // Create setup.locations if it doesn't exist
  if (setup.locations === undefined) {
    setup.locations = new Map();
  }

  let location_coords: [x: number, y: number, z?: number];
  let subLocation_coords: [x: number, y: number, z?: number];
  let location_navigations: {
    north?: string;
    east?: string;
    south?: string;
    west?: string;
  };
  let subLocation_navigations: {
    north?: string;
    east?: string;
    south?: string;
    west?: string;
  };

  // Loop over each story passage
  for (const i of $("tw-storydata").children()) {
    const storyPassage: JQuery<HTMLElement> = $(i);

    // Get the location and subLocation tags
    if (storyPassage.attr("tags")) {
      const tags: string = storyPassage.attr("tags") as string;

      if (tags.includes("location")) {
        // Reset them with every iteration.
        location_coords = [0, 0];
        subLocation_coords = [0, 0];
        location_navigations = {};
        subLocation_navigations = {};
        // console.log(storyPassage.attr("tags"));

        // Match characters with "location_"
        const location = tags.match(/location_[^\s]*/) as RegExpMatchArray;
        // console.log(location);

        location_coords = locationDataObject[location[0]]?.coords;
        location_navigations = locationDataObject[location[0]]?.nav_locations;

        // Create a new location data object for the location and append it into setup.locations if not already present
        let locationDataExists = setup.locations.has(location[0]);
        if (!locationDataExists) {
          setup.locations?.set(location[0], {
            name: location[0],
            coords: location_coords,
            nav_locations: location_navigations,
          });
        }

        // Deal with the sub locations
        if (tags.includes("subLocation")) {
          // Match characters with "subLocation_"
          const subLocation = tags.match(
            /subLocation_[^\s]*/
          ) as RegExpMatchArray;
          // console.log(subLocation);

          let subLocationDataExists = setup.locations
            .get(location[0])
            ?.subLocations?.has(subLocation[0]);
          if (!subLocationDataExists) {
            // Initialize the subLocation sub-map if it doesn't exist
            if (setup.locations.get(location[0])!.subLocations === undefined) {
              setup.locations.get(location[0])!.subLocations = new Map();
            }

            subLocation_coords =
              locationDataObject[location[0]]?.subLocations[subLocation[0]]
                ?.coords;
            subLocation_navigations =
              locationDataObject[location[0]]?.subLocations[subLocation[0]]
                ?.nav_locations;

            setup.locations.get(location[0])!.subLocations.set(subLocation[0], {
              name: subLocation[0],
              coords: subLocation_coords,
              nav_locations: subLocation_navigations,
            });
          }
        }
      }
    }
  }
};

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

  // Appease typescript. This should never happen
  if (setup.locations === undefined) {
    setup.locations = new Map();
  }

  // Access the coords using the indexes
  let prevPassageLocationCoords: [x: number, y: number, z?: number];
  let prevPassageSubLocationCoords: [x: number, y: number, z?: number];
  let currPassageLocationCoords: [x: number, y: number, z?: number];
  let currPassageSubLocationCoords: [x: number, y: number, z?: number];

  prevPassageLocationCoords = setup.locations.get(prevPassageLocation)!.coords;

  if (
    setup.locations.get(prevPassageLocation).subLocations !== undefined &&
    prevPassageSubLocation
  ) {
    prevPassageSubLocationCoords = setup.locations
      .get(prevPassageLocation)
      .subLocations.get(prevPassageSubLocation).coords;
  } else {
    // no sub location exists so default the coords to [0, 0, 0]
    prevPassageSubLocationCoords = [0, 0, 0];
  }

  currPassageLocationCoords = setup.locations.get(currPassageLocation).coords;

  if (
    setup.locations.get(currPassageLocation).subLocations !== undefined &&
    currPassageSubLocation
  ) {
    currPassageSubLocationCoords = setup.locations
      .get(currPassageLocation)
      .subLocations.get(currPassageSubLocation).coords;
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
      getRandomNumberFromRangeInclusive(
        distanceToMetresConversionRange[min],
        distanceToMetresConversionRange[max]
      );
  } else {
    // Just use the distance between subLocations
    totalDistanceBetweenLocationsInMetres =
      distBetweenPrevPassageSubLocationAndCurrPassageSubLocation *
      getRandomNumberFromRangeInclusive(
        distanceToMetresConversionRange[min],
        distanceToMetresConversionRange[max]
      );
  }

  // Return a floating point number with 2 decimal places
  return parseFloat(totalDistanceBetweenLocationsInMetres.toFixed(2));
};
