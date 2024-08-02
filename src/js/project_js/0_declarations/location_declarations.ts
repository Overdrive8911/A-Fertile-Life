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

// An enum of all locations. Locations are basically just containers of related areas. They are also the only areas that may be displayed on the world map
// NOTE - Ensure that the name of a member (e.g FERTILO_INC) can be converted into a subLocation string (e.g location_fertiloInc)
// NOTE - Arrange related locations right after each other
enum MapLocation {
  //
  FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
  FERTILO_INC_GROUND_FLOOR,
  FERTILO_INC_FIRST_FLOOR,
  FERTILO_INC_SECOND_FLOOR,
  FERTILO_INC_THIRD_FLOOR,
  FERTILO_INC_TOP_FLOOR,

  PLAYER_HOUSE,
  BUS,
  DREAM,
  UNKNOWN,
}

// For ease of use later. Add the first and last related MapLocation in the enum
type RelatedMapLocations = {
  [groupNameOfLocations: string]: {
    name: string;
    coords: LocationCoords;
    firstRelatedLocation: MapLocation;
    lastRelatedLocation: MapLocation;
  };
};
const gRelatedLocations: RelatedMapLocations = {
  FERTILO_INC: {
    name: "Fertilo Inc",
    coords: [45000, 45000],
    firstRelatedLocation: MapLocation.FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
    lastRelatedLocation: MapLocation.FERTILO_INC_TOP_FLOOR,
  },
};

// An enum of all sub locations. Multiple sub locations can share the same name as long as they're in different locations
// Some sub locations can occur multiple times in a single location and as such have a number appended to them.
// NOTE - Ensure that the name of a member (e.g RECEPTION) can be converted into a subLocation string (e.g subLocation_reception) as well as be used to get the appropriate image (e.g assets/img/map/sub_location/reception.webp)
enum MapSubLocation {
  RECEPTION,
  CLOSET,
  MEASUREMENT_CLOSET,
  CEO_OFFICE,
  PHARMACY,
  PHARMACY_1,
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

// This stores EVERY possible location. `addLocation()` is used to add locations and sub locations to this object. `setup.initializeLocationDataObject()` contains many instances of the previous function to populate this object with locations and their respective sub locations.
// NOTE - The first entry in `subLocations` is where the player will enter if they move into that particular location without a set destination (aka another sub location)
let gLocationData: {
  [nameOfLocation in MapLocation]?: GameLocation;
} = {
  // North Hirtheford
  [MapLocation.FERTILO_INC_GROUND_FLOOR]: {
    name: "Fertilo Inc (Ground Floor)",
    coords: gRelatedLocations.FERTILO_INC.coords,
    subLocations: {
      [MapSubLocation.PORCH]: {
        name: "Porch",
        coords: [2, 5],
        nav_locations: {
          north: MapSubLocation.RECEPTION,
        },
      },
      [MapSubLocation.RECEPTION]: {
        name: "Reception",
        coords: [2, 7],
        nav_locations: {
          south: MapSubLocation.PORCH,
          east: MapSubLocation.MEASUREMENT_CLOSET,
          west: MapSubLocation.PHARMACY,
          north: MapSubLocation.CORRIDOR,
        },
      },
      [MapSubLocation.MEASUREMENT_CLOSET]: {
        name: "Measurement Closet",
        coords: [5, 7],
        nav_locations: { west: MapSubLocation.RECEPTION },
      },
      [MapSubLocation.PHARMACY]: {
        name: "Pharmacy",
        coords: [-1, 7],
        nav_locations: { east: MapSubLocation.RECEPTION },
      },
      [MapSubLocation.CORRIDOR]: {
        name: "Corridor",
        coords: [2, 10],
        nav_locations: {
          north: MapSubLocation.HALLWAY_2,
          south: MapSubLocation.RECEPTION,
        },
      },
      [MapSubLocation.HALLWAY]: {
        name: "Hallway",
        coords: [0, 0],
        nav_locations: {
          west: MapSubLocation.ELEVATOR,
          south: MapSubLocation.STAIRCASE,
          east: MapSubLocation.HALLWAY_1,
        },
      },
      [MapSubLocation.ELEVATOR]: {
        name: "Elevator",
        coords: [0, 0],
        nav_locations: { east: MapSubLocation.HALLWAY },
      },
      [MapSubLocation.STAIRCASE]: {
        name: "Staircase",
        coords: [0, 0],
        nav_locations: { north: MapSubLocation.HALLWAY },
      },
      [MapSubLocation.HALLWAY_1]: {
        name: "Hallway",
        coords: [2, 0],
        nav_locations: {
          north: MapSubLocation.ELEVATOR_1,
          south: MapSubLocation.LAB,
          west: MapSubLocation.HALLWAY,
          east: MapSubLocation.HALLWAY_2,
        },
      },
      [MapSubLocation.ELEVATOR_1]: {
        name: "Elevator",
        coords: [0, 0],
        nav_locations: { south: MapSubLocation.HALLWAY_1 },
      },
      [MapSubLocation.LAB]: {
        name: "Laboratory",
        coords: [0, 0],
        nav_locations: { north: MapSubLocation.HALLWAY_1 },
      },
      [MapSubLocation.HALLWAY_2]: {
        name: "Hallway",
        coords: [6, 0],
        nav_locations: {
          south: MapSubLocation.CORRIDOR,
          north: MapSubLocation.STAIRCASE_1,
          west: MapSubLocation.HALLWAY_1,
          east: MapSubLocation.HALLWAY_3,
        },
      },
      [MapSubLocation.STAIRCASE_1]: {
        name: "Staircase",
        coords: [0, 0],
        nav_locations: { south: MapSubLocation.HALLWAY },
      },
      [MapSubLocation.HALLWAY_3]: {
        name: "Hallway",
        coords: [8, 0],
        nav_locations: {
          north: MapSubLocation.CONSULTATION,
          south: MapSubLocation.PHARMACY_1,
          east: MapSubLocation.HALLWAY_4,
          west: MapSubLocation.HALLWAY_2,
        },
      },
      [MapSubLocation.CONSULTATION]: {
        name: "Consultation Office",
        coords: [0, 0],
        nav_locations: { south: MapSubLocation.HALLWAY_3 },
      },
      [MapSubLocation.PHARMACY_1]: {
        name: "Pharmacy",
        coords: [0, 0],
        nav_locations: { north: MapSubLocation.HALLWAY_3 },
      },
      [MapSubLocation.HALLWAY_4]: {
        name: "Hallway",
        coords: [10, 0],
        nav_locations: {
          north: MapSubLocation.OFFICE_WORK,
          east: MapSubLocation.ELEVATOR_2,
          west: MapSubLocation.HALLWAY_3,
        },
      },
      [MapSubLocation.OFFICE_WORK]: {
        name: "Office",
        coords: [0, 0],
        nav_locations: { south: MapSubLocation.HALLWAY_4 },
      },
      [MapSubLocation.ELEVATOR_2]: {
        name: "Elevator",
        coords: [0, 0],
        nav_locations: { west: MapSubLocation.HALLWAY_4 },
      },
    },
  },
  [MapLocation.FERTILO_INC_TOP_FLOOR]: {
    name: "Top Floor",
    coords: [
      gRelatedLocations.FERTILO_INC.coords[0],
      gRelatedLocations.FERTILO_INC.coords[1],
      5,
    ],
    subLocations: {
      [MapSubLocation.CEO_OFFICE]: {
        name: "Mr Fertilo's Office",
        coords: [8, 6],
      },
    },
  },
  [MapLocation.FERTILO_INC_FIRST_FLOOR_UNDERGROUND]: {
    name: "???",
    coords: [
      gRelatedLocations.FERTILO_INC.coords[0],
      gRelatedLocations.FERTILO_INC.coords[1],
      -1,
    ],
    subLocations: {
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
