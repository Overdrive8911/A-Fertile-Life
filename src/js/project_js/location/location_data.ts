// This checks whether a location exists and returns its array index location else returns -999
const doesLocationDataExist = (locationName: string) => {
  // Create setup.locations if it doesn't exist. Although this would never really happen, just to appease the typescript gods
  if (setup.locations === undefined) {
    setup.locations = [];
  }

  for (let i = 0; i < setup.locations?.length; i++) {
    const location = setup.locations[i];

    if (location.name === locationName) {
      console.log(`index and element: ${i} and ${location.name}`);
      // The location exists so exit this function
      return i;
    }
  }

  return -999;
};

const doesSubLocationDataExist = (
  subLocationName: string,
  locationName: string
) => {
  let locationId = doesLocationDataExist(locationName);

  // Create setup.locations and the subLocations if it doesn't exist. Although this would never really happen, just to appease the typescript gods
  if (setup.locations === undefined) {
    setup.locations = [];
  }
  if (setup.locations[locationId].subLocations === undefined) {
    setup.locations[locationId].subLocations = [];
  }

  if (locationId != -999) {
    // location exists
    for (
      let i = 0;
      i < setup.locations[locationId]?.subLocations?.length;
      i++
    ) {
      const subLocation = setup.locations[locationId]?.subLocations[i];

      if (subLocation.name === subLocationName) {
        return i;
      }
    }
  }

  return -999;
};

setup.initializeLocationDataArray = function () {
  // Create setup.locations if it doesn't exist
  if (setup.locations === undefined) {
    setup.locations = [];
  }

  // Loop over each story passage
  for (const i of $("tw-storydata").children()) {
    const storyPassage: JQuery<HTMLElement> = $(i);

    // Get the location and subLocation tags
    if (storyPassage.attr("tags")) {
      const tags: string = storyPassage.attr("tags") as string;

      if (tags.includes("location")) {
        // console.log(storyPassage.attr("tags"));

        // Match characters after "location_" and before any whitespace
        const location = tags.match(/(?<=location_)[^\s]*/) as RegExpMatchArray;
        // console.log(location);

        // TODO - Deal with the coordinates using a switch case

        // Create a new location data object for the location and push it into setup.locations if not already present
        let locationDataExists = doesLocationDataExist(location[0]);
        if (locationDataExists === -999) {
          // console.log(location[0]);
          setup.locations?.push({
            name: location[0],
            coords: [0, 0],
          });
        }

        // Deal with the sub locations
        if (tags.includes("subLocation")) {
          // Match characters after "subLocation_" and before any whitespace
          const subLocation = tags.match(
            /(?<=subLocation_)[^\s]*/
          ) as RegExpMatchArray;
          // console.log(subLocation);

          let subLocationDataExists = doesSubLocationDataExist(
            subLocation[0],
            location[0]
          );
          if (subLocationDataExists === -999 && locationDataExists !== -999) {
            // Initialize the subLocation sub-array if it doesn't exist
            if (
              setup.locations[locationDataExists].subLocations === undefined
            ) {
              setup.locations[locationDataExists].subLocations = [];
            }

            // TODO - Deal with the coordinates using a switch case

            setup.locations[locationDataExists]?.subLocations?.push({
              name: subLocation[0],
              coords: [0, 0],
              floor: 0,
            });
          }
        }
      }
    }
  }
};
