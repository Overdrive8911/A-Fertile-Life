// These just tell me whether an area in a `Map Object` has a characteristic
export const enum MapEntityFlags {
  NONE,
  // When the user warps to the `map object`, they will be spawned in any area that has this flag. If multiple areas in the same `map object` have this flag, randomly pick one of them
  IS_ENTRY_POINT = 1 << 0,

  // Any area's with this flag can be used to exit the `map object` from a specified direction.
  IS_EXIT_POINT_NORTH = 1 << 1,
  IS_EXIT_POINT_EAST = 1 << 2,
  IS_EXIT_POINT_SOUTH = 1 << 3,
  IS_EXIT_POINT_WEST = 1 << 4,
  IS_EXIT_POINT_UP = 1 << 5,
  IS_EXIT_POINT_DOWN = 1 << 6,

  // Used to temporarily block connections
  INACCESSIBLE_FROM_NORTH = 1 << 7,
  INACCESSIBLE_FROM_EAST = 1 << 8,
  INACCESSIBLE_FROM_SOUTH = 1 << 9,
  INACCESSIBLE_FROM_WEST = 1 << 10,
  INACCESSIBLE_FROM_UP = 1 << 11,
  INACCESSIBLE_FROM_DOWN = 1 << 12,

  IS_EXIT_POINT = IS_EXIT_POINT_EAST |
    IS_EXIT_POINT_NORTH |
    IS_EXIT_POINT_SOUTH |
    IS_EXIT_POINT_WEST |
    IS_EXIT_POINT_UP |
    IS_EXIT_POINT_DOWN,
  IS_ENTRY_OR_EXIT_POINT = IS_ENTRY_POINT | IS_EXIT_POINT,

  INACCESSIBLE = INACCESSIBLE_FROM_NORTH |
    INACCESSIBLE_FROM_EAST |
    INACCESSIBLE_FROM_SOUTH |
    INACCESSIBLE_FROM_WEST |
    INACCESSIBLE_FROM_UP |
    INACCESSIBLE_FROM_DOWN,
}
export const enum Direction {
  NORTH = 'North',
  EAST = 'East',
  SOUTH = 'South',
  WEST = 'West',
  UP = 'Up',
  DOWN = 'Down',
}
export const enum Distance {
  NONE = 0,
  VERY_SHORT = 1.5,
  SHORT = 5,
  SOMEWHAT_SHORT = 7.5,
  AVERAGE = 10,
  SOMEWHAT_LONG = 13.5,
  LONG = 20,
  VERY_LONG = 30,
}

// SECTION - Ids for the MapEntity
export const enum SubLocationId {
  DUMMY,

  RECEPTION,
  CLOSET,
  MEASUREMENT_CLOSET,
  CEO_OFFICE,
  CONSULTATION,
  LAB,
  OFFICE_WORK,

  PHARMACY,

  PLAYER_ROOM,
  LIVING_ROOM,
  BATHROOM,
  BEDROOM,
  PORCH,

  // Hallways
  HALLWAY,

  // Corridors
  CORRIDOR,

  // Rooms
  ROOM,
}

export const enum LocationId {
  DUMMY,

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

export const enum SubRegionId {
  DUMMY,
  FERTILO_INC,
  TEST_NEIGHBOURHOOD,
}

export const enum RegionId {
  DUMMY,
  NORTH_HIRTHEFORD,
  EAST_HIRTHEFORD,
  SOUTH_HIRTHEFORD,
  WEST_HIRTHEFORD,
  CENTRAL_HIRTHEFORD,
}

export const enum GlobalMapId {
  GLOBAL,
}

export const enum MapEntityId {
  DUMMY = '0',
  SUB_LOCATION = '1',
  LOCATION = '2',
  SUB_REGION = '3',
  REGION = '4',
  GLOBAL_MAP = '5',
}
//!SECTION
