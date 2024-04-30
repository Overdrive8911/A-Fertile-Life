const invalidLocation: number = -999;
const invalidSubLocation: number = invalidLocation;

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

  return invalidLocation;
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

  if (locationId != invalidLocation) {
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

  return invalidSubLocation;
};

setup.initializeLocationDataArray = function () {
  // Create setup.locations if it doesn't exist
  if (setup.locations === undefined) {
    setup.locations = [];
  }

  let location_coords: [x: number, y: number, z?: number];
  let subLocation_coords: [x: number, y: number, z?: number];

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
        // console.log(storyPassage.attr("tags"));

        // Match characters with "location_"
        const location = tags.match(/location_[^\s]*/) as RegExpMatchArray;
        // console.log(location);

        // TODO - Deal with the coordinates using a switch case
        // SECTION - Location switch case
        switch (location[0]) {
          case "location_playerHouse":
            location_coords = [500, 500];
            break;
          case "location_fertiloInc":
            location_coords = [45000, 45000];
            break;
          case "location_bus":
          case "location_dream":
            location_coords = [0, 0];
          default:
            // This should never happen lol
            // Enter the void
            location_coords = [-100, -100];
            break;
        }

        // Create a new location data object for the location and push it into setup.locations if not already present
        let locationDataExists = doesLocationDataExist(location[0]);
        if (locationDataExists === invalidLocation) {
          // console.log(location[0]);
          setup.locations?.push({
            name: location[0],
            coords: location_coords,
          });
        }

        // Deal with the sub locations
        if (tags.includes("subLocation")) {
          // Match characters with "subLocation_"
          const subLocation = tags.match(
            /subLocation_[^\s]*/
          ) as RegExpMatchArray;
          // console.log(subLocation);

          let subLocationDataExists = doesSubLocationDataExist(
            subLocation[0],
            location[0]
          );
          if (
            subLocationDataExists === invalidSubLocation &&
            locationDataExists !== invalidLocation
          ) {
            // Initialize the subLocation sub-array if it doesn't exist
            if (
              setup.locations[locationDataExists].subLocations === undefined
            ) {
              setup.locations[locationDataExists].subLocations = [];
            }

            // TODO - Deal with the coordinates using a switch case
            // SECTION - Sub location switch case
            switch (location[0]) {
              case "location_playerHouse":
                switch (subLocation[0]) {
                  case "subLocation_bathroom":
                    subLocation_coords = [3, 2];
                    break;
                  case "subLocation_porch":
                    subLocation_coords = [5, 3];
                    break;
                  default:
                    subLocation_coords = [0, 0];
                    break;
                }
                break;
              case "location_fertiloInc":
                switch (subLocation[0]) {
                  case "subLocation_reception":
                    subLocation_coords = [2, 7];
                    break;
                  case "subLocation_measurementCloset":
                    subLocation_coords = [5, 10];
                    break;
                  case "subLocation_mrFertiloOffice":
                    subLocation_coords = [8, 6, 10];
                    break;

                  // Player Rooms
                  case "subLocation_playerRoom":
                    subLocation_coords = [11, 9];
                    break;

                  // Hallways

                  default:
                    subLocation_coords = [0, 0];
                    break;
                }
                break;
              default:
                break;
            }

            setup.locations[locationDataExists]?.subLocations?.push({
              name: subLocation[0],
              coords: subLocation_coords,
            });
          }
        }
      }
    }
  }
};
