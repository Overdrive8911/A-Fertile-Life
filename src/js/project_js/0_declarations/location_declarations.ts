interface GameLocation {
  name: string;
  coords: LocationCoords;
  nav_locations?: NavigationLocations;
  subLocations?: {
    [nameOfSubLocation in MapSubLocation]?: GameSubLocation;
  };
  subLocationMap?: GameMapForSubLocations<typeof GameMapSubLocationArraySize>;
}

interface GameSubLocation {
  name?: string;
  coords: LocationCoords;
  // nav_locations?: NavigationLocations;
}

type LocationCoords = [x: number, y: number, z?: number];

enum LocationCoordIndex {
  X,
  Y,
  Z,
}

interface NavigationLocations {
  north?: GameSubLocation | MapSubLocation;
  east?: GameSubLocation | MapSubLocation;
  south?: GameSubLocation | MapSubLocation;
  west?: GameSubLocation | MapSubLocation;
}

// The game map would be a 2d/3d array to store all 3 possible coords for locations or sub locations. The id's for the respective location/sub locations are stored in the spot that their coords point to
// NOTE - Any locations/sub locations that can be navigated to via north, east, south or west directions must share the same axis, i.e the x axis in east/ west and y axis in north/south.
// NOTE - The first array represents the x axis, the second represents the y axis and the third (if present) represents the z axis
type GameMapForLocations<Size extends number> = GameMapTuple<
  GameMapTuple<GameMapTuple<number, Size>, Size>,
  Size
>; // 3d array
type GameMapForSubLocations<Size extends number> = GameMapTuple<
  GameMapTuple<number, Size>,
  Size
>; // 2d array
type GameMapTuple<Coord, AxisLength extends number> = [Coord, ...Coord[]] & {
  length: AxisLength;
};
// type GameMapTuple<Coord> = GameMapTupleType<Coord, 100>

// In the 2d/3d game map array, each numeric member has a value to determine properties, like if it is passable/empty/blocked/etc
enum GameMapCoordinate {
  EMPTY = -1,
}

// To create 100x100 or 100x100x100 arrays
const GameMapSubLocationArraySize = 100;

const gOppositeNavigationDirections: {
  [key in keyof NavigationLocations]: keyof NavigationLocations;
} = {
  north: "south",
  east: "west",
  south: "north",
  west: "east",
};

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
  HALLWAY_6,
  HALLWAY_7,

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

// NOTE - This stores EVERY possible location.
// NOTE - The first entry in `subLocations` is where the player will enter if they move into that particular location without a set destination (aka another sub location)
// NOTE - Do not allow any of the sub location coord values to be less than `-(GameMapSubLocationArraySize/2)` or exceed `GameMapSubLocationArraySize/2 - 1`. If `GameMapSubLocationArraySize` is 100, then stay inclusively within -50 and 49
let gLocationData: {
  [nameOfLocation in MapLocation]?: GameLocation;
} = {
  // North Hirtheford
  [MapLocation.FERTILO_INC_GROUND_FLOOR]: {
    name: "Fertilo Inc (Ground Floor)",
    coords: gRelatedLocations.FERTILO_INC.coords,
    subLocations: {
      [MapSubLocation.PORCH]: {
        coords: [2, 5],
      },
      [MapSubLocation.RECEPTION]: {
        coords: [2, 7],
      },
      [MapSubLocation.MEASUREMENT_CLOSET]: {
        name: "Measurement Closet",
        coords: [5, 7],
      },
      [MapSubLocation.PHARMACY]: {
        coords: [-1, 7],
      },

      [MapSubLocation.CORRIDOR]: {
        coords: [2, 10],
      },

      [MapSubLocation.HALLWAY]: {
        coords: [0, 0],
      },
      [MapSubLocation.HALLWAY_1]: {
        coords: [2, 0],
      },
      [MapSubLocation.HALLWAY_2]: {
        coords: [6, 0],
      },
      [MapSubLocation.HALLWAY_3]: {
        coords: [8, 0],
      },
      [MapSubLocation.HALLWAY_4]: {
        coords: [10, 0],
      },

      [MapSubLocation.ELEVATOR]: {
        coords: [10, 21],
      },
      [MapSubLocation.ELEVATOR_1]: {
        coords: [30, 0],
      },
      [MapSubLocation.ELEVATOR_2]: {
        coords: [47, 0],
      },

      [MapSubLocation.STAIRCASE]: {
        coords: [0, 21],
      },
      [MapSubLocation.STAIRCASE_1]: {
        coords: [23, 0],
      },

      [MapSubLocation.LAB]: {
        name: "Laboratory",
        coords: [6, 44],
      },
      [MapSubLocation.CONSULTATION]: {
        name: "Consultation Office",
        coords: [8, 7],
      },

      [MapSubLocation.OFFICE_WORK]: {
        name: "Office",
        coords: [2, 6],
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
      },
      [MapSubLocation.PORCH]: { name: "Your Old Porch", coords: [0, -23] },
      [MapSubLocation.BEDROOM]: {
        name: "Your Old Bedroom",
        coords: [21, 36],
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
