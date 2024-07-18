interface GameLocation {
  coords: [x: number, y: number, z?: number];
  nav_locations?: NavigationLocations;
  subLocations?: {
    [nameOfSubLocation: string]: GameSubLocation;
  };
}

interface GameSubLocation {
  coords: [x: number, y: number, z?: number];
  nav_locations?: NavigationLocations;
}

interface NavigationLocations {
  north?: string;
  east?: string;
  south?: string;
  west?: string;
}

const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
];
const averageWalkingSpeed: [
  value: number,
  distanceUnit: string,
  timeUnit: string
] = [1.42, "metres", "second"];

// This stores EVERY possible location while setup.locations stores every location that is AVAILABLE in-game
const locationDataObject: {
  [nameOfLocation: string]: GameLocation;
} =
  // TODO - Add the navigation locations
  {
    // North Hirtheford
    location_fertiloInc: {
      coords: [45000, 45000],
      subLocations: {
        subLocation_reception: { coords: [2, 7] },
        subLocation_measurementCloset: { coords: [5, 10] },
        subLocation_mrFertiloOffice: { coords: [8, 6, 10] },

        subLocation_playerRoom: { coords: [11, 9] },
      },
    },

    // East Hirtheford

    // South Hirtheford

    // West Hirtheford
    location_playerHouse: {
      coords: [500, 500],
      subLocations: {
        subLocation_livingRoom: { coords: [1, 30] },
        subLocation_bathroom: {
          coords: [15, 20],
          nav_locations: { east: "subLocation_bedroom" },
        },
        subLocation_porch: { coords: [0, -23] },
        subLocation_bedroom: {
          coords: [21, 36],
          nav_locations: { west: "subLocation_bathroom" },
        },
      },
    },

    // Central Hirtheford

    // Others
    location_bus: { coords: [0, 0] },
    location_dream: { coords: [0, 0] },
  };

const getLocationFromPassageTitle = (passageTitle: string) => {
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
};

const getSubLocationFromPassageTitle = (passageTitle: string) => {
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
};
