interface GameLocation {
  name: string;
  coords: LocationCoords;
  subLocations?: {
    [nameOfSubLocation in MapSubLocation]?: GameSubLocation;
  };
  subLocationMap?: GameMapForSubLocations<typeof gGameMapSubLocationArraySize>;
}

interface GameSubLocation {
  name?: string;
  coords: LocationCoords;
}

type LocationCoords = [x: number, y: number, z?: number];

enum LocationCoordIndex {
  X,
  Y,
  Z,
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

// To create 100x100 or 100x100x100 arrays
const gGameMapSubLocationArraySize = 100;

// In the 2d/3d game map array, each numeric member has a value to determine properties, like if it is passable/empty/blocked/etc
enum GameMapCoordinate {
  EMPTY = (1 << 0) * gGameMapSubLocationArraySize,
}

// An enum of all locations. Locations are basically just containers of related areas. They are also the only areas that may be displayed on the world map
// NOTE - Ensure that the name of a member (e.g FERTILO_INC) can be converted into a subLocation string (e.g location_fertiloInc)
// NOTE - Arrange related locations right after each other for clarity
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
  [key in MapLocationContainer]: {
    name: string;
    generalCoords: LocationCoords;
    relatedLocations: MapLocation[];
  };
};

// Stores the general name of a group of multiple locations. Is used in `gRelatedLocations`
enum MapLocationContainer {
  FERTILO_INC,
}
const gRelatedLocations: RelatedMapLocations = {
  [MapLocationContainer.FERTILO_INC]: {
    name: "Fertilo Inc",
    generalCoords: [45000, 45000],
    relatedLocations: [
      MapLocation.FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
      MapLocation.FERTILO_INC_GROUND_FLOOR,
      MapLocation.FERTILO_INC_FIRST_FLOOR,
      MapLocation.FERTILO_INC_SECOND_FLOOR,
      MapLocation.FERTILO_INC_THIRD_FLOOR,
      MapLocation.FERTILO_INC_TOP_FLOOR,
    ],
  },
};

// An enum of all sub locations. Multiple sub locations can share the same name as long as they're in different locations
// Some sub locations can occur multiple times in a single location and as such have a number appended to them.
// NOTE - Ensure that the name of a member (e.g RECEPTION) can be converted into a subLocation string (e.g subLocation_reception) as well as be used to get the appropriate image (e.g assets/img/map/sub_location/reception.webp)
// NOTE - Assign the duplicates to the map from left to right
enum MapSubLocation {
  RECEPTION,
  CLOSET,
  MEASUREMENT_CLOSET,
  CEO_OFFICE,
  CONSULTATION,
  LAB,
  OFFICE_WORK,

  PHARMACY_1,
  PHARMACY_2,

  ROOM,
  PLAYER_ROOM,
  LIVING_ROOM,
  BATHROOM,
  BEDROOM,
  PORCH,

  // Hallways
  HALLWAY_1,
  HALLWAY_2,
  HALLWAY_3,
  HALLWAY_4,
  HALLWAY_5,
  HALLWAY_6,
  HALLWAY_7,

  // Corridors
  CORRIDOR_1,
  CORRIDOR_2,
  CORRIDOR_3,

  // Staircases
  STAIRCASE_1,
  STAIRCASE_2,
  STAIRCASE_3,

  // Elevators
  ELEVATOR_1,
  ELEVATOR_2,
  ELEVATOR_3,
}

// Only here to avoid repetition since it's used in `setup.locationData`
function getSubLocationCoords(
  locationId: MapLocation,
  subLocationId: MapSubLocation
): LocationCoords {
  const coords =
    setup.locationData[locationId].subLocations[subLocationId].coords;
  return coords != undefined ? coords : [0, 0, 0];
}

// Same case with the above function. Use zeroes for x/y/z if you're not using them
function getCoordsRelativeToOtherSubLocation(
  locationId: MapLocation,
  subLocationId: MapSubLocation,
  xIncrement: number,
  yIncrement: number,
  zIncrement: number
): LocationCoords {
  const otherSubLocationCoords = getSubLocationCoords(
    locationId,
    subLocationId
  );

  // Prevent undefined values
  if (otherSubLocationCoords[LocationCoordIndex.Z] == undefined)
    otherSubLocationCoords[LocationCoordIndex.Z] = 0;

  let newCoords: LocationCoords = [
    otherSubLocationCoords[LocationCoordIndex.X] + xIncrement,
    otherSubLocationCoords[LocationCoordIndex.Y] + yIncrement,
    otherSubLocationCoords[LocationCoordIndex.Z] + zIncrement,
  ];

  if (newCoords[LocationCoordIndex.Z] == 0) {
    // No use of keeping it
    delete newCoords[LocationCoordIndex.Z];
  }

  return newCoords;
}

// NOTE - This stores EVERY possible location. Keep in mind that moving from coords [2,6] to [2,7] or [5,3] to [4,3] takes 10 seconds on average. Note that the `entry` sub location would have its distance calculated from [0,0]
// NOTE - The first entry in `subLocations` is where the player will enter if they move into that particular location without a set destination (aka another sub location)
// NOTE - Do not allow any of the sub location coord values to be less than `-(GameMapSubLocationArraySize/2)` or exceed `GameMapSubLocationArraySize/2 - 1`. If `GameMapSubLocationArraySize` is 100, then stay inclusively within -50 and 49. Also keep the values as whole integers
// NOTE - Using getters for the coords of sub locations makes it easier to do edits down the line. It's also easier to understand what is connected to what
// It's best to have an image to visualize how the coords would work
setup.locationData = {
  // North Hirtheford
  [MapLocation.FERTILO_INC_GROUND_FLOOR]: {
    name: "Fertilo Inc (Ground Floor)",
    coords: gRelatedLocations[MapLocationContainer.FERTILO_INC].generalCoords,
    subLocations: {
      [MapSubLocation.PORCH]: {
        coords: [0, 0],
      },
      [MapSubLocation.RECEPTION]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.PORCH,
            0,
            2,
            0
          );
        },
      },
      // get [MapSubLocation.RECEPTION](): GameSubLocation {
      //   const porchCoords = this[MapSubLocation.PORCH].coords;
      //   return {
      //     name: "Reception",
      //     coords: [
      //       porchCoords[LocationCoordIndex.X],
      //       porchCoords[LocationCoordIndex.Y] + 2,
      //     ],
      //   };
      // },
      [MapSubLocation.MEASUREMENT_CLOSET]: {
        name: "Measurement Closet",
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.RECEPTION,
            1,
            0,
            0
          );
        },
      },

      [MapSubLocation.PHARMACY_1]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.RECEPTION,
            -1,
            0,
            0
          );
        },
      },
      [MapSubLocation.PHARMACY_2]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_5,
            0,
            -2,
            0
          );
        },
      },

      [MapSubLocation.CORRIDOR_1]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.RECEPTION,
            0,
            2,
            0
          );
        },
      },
      // [MapSubLocation.CORRIDOR_2]: {
      //   coords: [2, 10],
      // },
      // [MapSubLocation.CORRIDOR_3]: {
      //   coords: [0, 0],
      // },

      [MapSubLocation.HALLWAY_1]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            -6,
            0,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_2]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            -4,
            0,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_3]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            -2,
            0,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_4]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.CORRIDOR_1,
            0,
            3,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_5]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            2,
            0,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_6]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            4,
            0,
            0
          );
        },
      },
      [MapSubLocation.HALLWAY_7]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            6,
            0,
            0
          );
        },
      },

      [MapSubLocation.ELEVATOR_1]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_1,
            -1,
            0,
            0
          );
        },
      },
      [MapSubLocation.ELEVATOR_2]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_3,
            0,
            1,
            0
          );
        },
      },
      [MapSubLocation.ELEVATOR_3]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_7,
            1,
            0,
            0
          );
        },
      },

      [MapSubLocation.STAIRCASE_1]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_1,
            0,
            -1,
            0
          );
        },
      },
      [MapSubLocation.STAIRCASE_2]: {
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_4,
            0,
            1,
            0
          );
        },
      },

      [MapSubLocation.LAB]: {
        name: "Laboratory",
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_3,
            0,
            -2,
            0
          );
        },
      },
      [MapSubLocation.CONSULTATION]: {
        name: "Consultation Office",
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_5,
            0,
            2,
            0
          );
        },
      },

      [MapSubLocation.OFFICE_WORK]: {
        name: "Office",
        get [`coords`](): LocationCoords {
          return getCoordsRelativeToOtherSubLocation(
            MapLocation.FERTILO_INC_GROUND_FLOOR,
            MapSubLocation.HALLWAY_7,
            0,
            2,
            0
          );
        },
      },
    },
  },
  [MapLocation.FERTILO_INC_FIRST_FLOOR_UNDERGROUND]: {
    name: "Fertilo Inc",
    coords: [
      ...(gRelatedLocations[MapLocationContainer.FERTILO_INC].generalCoords as [
        number,
        number
      ]),
      -5,
    ],
    subLocations: {
      [MapSubLocation.PLAYER_ROOM]: {
        name: "Your Room",
        coords: [5, 5],
      },
    },
  },

  [MapLocation.FERTILO_INC_TOP_FLOOR]: {
    name: "Top Floor",
    coords: [
      gRelatedLocations[MapLocationContainer.FERTILO_INC].generalCoords[0],
      gRelatedLocations[MapLocationContainer.FERTILO_INC].generalCoords[1],
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

let a = {
  b: 2,
  get c() {
    return this.b * 2;
  },

  get d() {
    return this.c * 4;
  },
};

const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
];

// I used 3.02 mph as the average and scaled it down to metres per second
// NOTE - It should take, on average, 10 seconds to leave a room for the immediate one close by (e.g a room with coords [2,6] to another with coords [2,7]) so every single value difference in coordinates (or the result of `getDistanceBetweenTwoPoints` times 10) is worth 10 seconds at the `averageWalkingSpeed` i.e (1/ averageWalkingSpeed * (INSERT EXTRA VALUES HERE) = 10 on average).
const averageWalkingSpeed: [
  value: number,
  distanceUnit: string,
  timeUnit: string
] = [1.35, "metres", "second"];
