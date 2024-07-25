interface GameLocation {
  name: string;
  coords: LocationCoords;
  nav_locations?: NavigationLocations;
  subLocations?: {
    [nameOfSubLocation: string]: GameSubLocation;
  };
}

interface GameSubLocation {
  name: string;
  coords: LocationCoords;
  nav_locations?: NavigationLocations;
}

type LocationCoords = [x: number, y: number, z?: number];

interface NavigationLocations {
  north?: string;
  east?: string;
  south?: string;
  west?: string;
}

// An enum of all locations
enum MapLocation {
  FERTILO_INC = "location_fertiloInc",
  PLAYER_HOUSE = "location_playerHouse",
  GENERAL_BUS = "location_bus",
  DREAMSCAPE = "location_dream",
  UNKNOWN = "location_???",
}

// An enum of all sub locations. Multiple sub locations can share the same name as long as they're in different locations
enum MapSubLocation {
  RECEPTION = "subLocation_reception",
  CLOSET = "subLocation_closet",
  CEO_OFFICE = "subLocation_CEOOffice",
  ROOM = "subLocation_room",
  PLAYER_ROOM = "subLocation_playerRoom",
  LIVING_ROOM = "subLocation_livingRoom",
  BATHROOM = "subLocation_bathroom",
  BEDROOM = "subLocation_bedroom",
  PORCH = "subLocation_porch",
}

// This stores EVERY possible location while setup.locations stores every location that is AVAILABLE in-game
const locationDataObject: {
  [nameOfLocation: string]: GameLocation;
} = {
  // North Hirtheford
  [MapLocation.FERTILO_INC]: {
    name: "Fertilo Inc",
    coords: [45000, 45000],
    subLocations: {
      [MapSubLocation.RECEPTION]: {
        name: "Fertilo Inc Reception",
        coords: [2, 7],
      },
      [MapSubLocation.CLOSET]: {
        name: "Measurement Closet",
        coords: [5, 10],
      },
      [MapSubLocation.CEO_OFFICE]: {
        name: "Mr Fertilo's Office",
        coords: [8, 6, 10],
      },

      [MapSubLocation.PLAYER_ROOM]: { name: "Your Room", coords: [11, 9] },
    },
  },

  // East Hirtheford

  // South Hirtheford

  // West Hirtheford
  [MapLocation.PLAYER_HOUSE]: {
    name: "Your Old House",
    coords: [500, 500],
    subLocations: {
      [MapSubLocation.LIVING_ROOM]: {
        name: "Your Old Living Room",
        coords: [1, 30],
      },
      [MapSubLocation.BATHROOM]: {
        name: "Your Old Bathroom",
        coords: [15, 20],
        nav_locations: { east: MapSubLocation.BEDROOM },
      },
      [MapSubLocation.PORCH]: { name: "Your Old Porch", coords: [0, -23] },
      [MapSubLocation.BEDROOM]: {
        name: "Your Old Bedroom",
        coords: [21, 36],
        nav_locations: { west: MapSubLocation.BATHROOM },
      },
    },
  },

  // Central Hirtheford

  // Others
  [MapLocation.GENERAL_BUS]: { name: "Bus", coords: [0, 0] },
  [MapLocation.DREAMSCAPE]: { name: "???", coords: [0, 0] },
  [MapLocation.UNKNOWN]: { name: "???", coords: [0, 0] },
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

const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
];
const averageWalkingSpeed: [
  value: number,
  distanceUnit: string,
  timeUnit: string
] = [1.42, "metres", "second"];
