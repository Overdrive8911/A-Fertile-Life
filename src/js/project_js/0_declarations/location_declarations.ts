interface GameLocation {
  name: string;
  coords: LocationCoords;
  nav_locations?: NavigationLocations;
  subLocations?: {
    [nameOfSubLocation in MapSubLocation]?: GameSubLocation;
  };
}

interface GameSubLocation {
  name: string;
  coords: LocationCoords;
  nav_locations?: NavigationLocations;
}

type LocationCoords = [x: number, y: number, z?: number];

interface NavigationLocations {
  north?: MapLocation | MapSubLocation;
  east?: MapLocation | MapSubLocation;
  south?: MapLocation | MapSubLocation;
  west?: MapLocation | MapSubLocation;
}

// An enum of all locations
// NOTE - Ensure that the name of a member (e.g FERTILO_INC) can be converted into a subLocation string (e.g location_fertiloInc)
enum MapLocation {
  FERTILO_INC,
  PLAYER_HOUSE,
  BUS,
  DREAM,
  UNKNOWN,
}

// An enum of all sub locations. Multiple sub locations can share the same name as long as they're in different locations
// Some sub locations can occur multiple times in a single location and as such have a number appended to them.
// NOTE - Ensure that the name of a member (e.g RECEPTION) can be converted into a subLocation string (e.g subLocation_reception) as well as be used to get the appropriate image (e.g assets/img/map/sub_location/reception.webp)
enum MapSubLocation {
  RECEPTION,
  CLOSET,
  MEASUREMENT_CLOSET,
  CEO_OFFICE,
  PHARMACY,
  CONSULTATION,
  LAB,
  OFFICE_WORK,

  ROOM,
  PLAYER_ROOM,
  LIVING_ROOM,
  BATHROOM,
  BEDROOM,
  PORCH,

  // Hallways
  HALLWAY,
  HALLWAY_1,
  HALLWAY_2,
  HALLWAY_3,
  HALLWAY_4,
  HALLWAY_5,

  // Corridors
  CORRIDOR,
  CORRIDOR_1,
  CORRIDOR_2,
  CORRIDOR_3,

  // Staircases
  STAIRCASE,
  STAIRCASE_1,
  STAIRCASE_2,
  STAIRCASE_3,

  // Elevators
  ELEVATOR,
  ELEVATOR_1,
  ELEVATOR_2,
  ELEVATOR_3,
}

// This stores EVERY possible location while setup.locations stores every location that is AVAILABLE in-game
const gLocationData: {
  [nameOfLocation in MapLocation]: GameLocation;
} = {
  // North Hirtheford
  [MapLocation.FERTILO_INC]: {
    name: "Fertilo Inc",
    coords: [45000, 45000],
    subLocations: {
      [MapSubLocation.PORCH]: {
        name: "Fertilo Inc",
        coords: [2, 5],
      },
      [MapSubLocation.RECEPTION]: {
        name: "Fertilo Inc Reception",
        coords: [2, 7],
      },
      [MapSubLocation.MEASUREMENT_CLOSET]: {
        name: "Measurement Closet",
        coords: [5, 10],
      },
      [MapSubLocation.HALLWAY]: {
        name: "Hallway",
        coords: [0, 0],
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
  [MapLocation.BUS]: { name: "Bus", coords: [0, 0] },
  [MapLocation.DREAM]: { name: "???", coords: [0, 0] },
  [MapLocation.UNKNOWN]: { name: "???", coords: [0, 0] },
};

const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
];
const averageWalkingSpeed: [
  value: number,
  distanceUnit: string,
  timeUnit: string
] = [1.42, "metres", "second"];
