import { gLeftShiftValue } from './other_data'

// For accessing anything with the type `LocationCoords`
export enum LocationCoordIndex {
  X,
  Y,
  Z,
}

// The values passed into a function when any of the navigation buttons are clicked
export enum GameMapDirection {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

// // To let me know what type of "map area" `GenericLocationData` could be
// export const enum CategoryOfLocation {
//   SUB_LOCATION,
//   LOCATION,
// }

// Stores the general name of a group of multiple locations. Is used in `gRelatedLocations`
export enum MapLocationContainer {
  FERTILO_INC,
  PLAYER_HOUSE,
  OTHER,
}

// An enum of all sub locations. Multiple sub locations can share the same name as long as they're in different locations
// Some sub locations can occur multiple times in a single location and as such have a number appended to them.
// NOTE - Ensure that the name of a member (e.g RECEPTION) can be converted into a subLocation string (e.g subLocation_reception) as well as be used to get the appropriate image (e.g /media/img/map/sub_location/reception.webp)
// NOTE - Assign the duplicates to the map from left to right
export enum MapSubLocation {
  DUMMY = 1 << 15,

  RECEPTION,
  CLOSET,
  MEASUREMENT_CLOSET,
  CEO_OFFICE,
  CONSULTATION,
  LAB,
  OFFICE_WORK,

  PHARMACY_1,
  PHARMACY_2,

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

  // Rooms
  ROOM_1,
  ROOM_2,
  ROOM_3,
  ROOM_4,
  ROOM_5,

  // END = 1 << 30
}

// An enum of all locations. Locations are basically just containers of related areas. They are also the only areas that may be displayed on the world map
// NOTE - Ensure that the name of a member (e.g FERTILO_INC) can be converted into a subLocation string (e.g location_fertiloInc)
// NOTE - Arrange related locations right after each other for clarity
// NOTE - Every entry in this enum MUST have a relation to a related entry in `MapLocationContainer`. If there isn't one, create it (look at the other entries to know what to do)
// NOTE - As long as the number of locations in each group doesn't exceed (2 ^ gLeftShiftValue), it'll be fine
export enum MapLocation {
  //
  DUMMY,

  FERTILO_INC_FIRST_FLOOR_UNDERGROUND = 0 |
    ((MapLocationContainer.FERTILO_INC << gLeftShiftValue) + 1),
  FERTILO_INC_GROUND_FLOOR = 2,
  FERTILO_INC_FIRST_FLOOR,
  FERTILO_INC_SECOND_FLOOR,
  FERTILO_INC_THIRD_FLOOR,
  FERTILO_INC_TOP_FLOOR,

  PLAYER_HOUSE = 0 | (MapLocationContainer.PLAYER_HOUSE << 8),

  BUS = 0 | (MapLocationContainer.OTHER << 8),
  DREAM = 1 | (MapLocationContainer.OTHER << 8),
  UNKNOWN = 2 | (MapLocationContainer.OTHER << 8),

  // NOTE: DO NOT GO BEYOND THIS
  END = MapSubLocation.DUMMY - 1,
}

// In the 2d/3d game map array, each numeric member has a value to determine properties, like if it is passable/empty/blocked/etc
export enum GameMapCoordinate {
  EMPTY = MapLocation.DUMMY, // Can be passed through
  BLOCKED = MapLocation.DUMMY - 1, // Cannot be passed through
}

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
  IS_EXIT_POINT = IS_EXIT_POINT_EAST |
    IS_EXIT_POINT_NORTH |
    IS_EXIT_POINT_SOUTH |
    IS_EXIT_POINT_WEST,
  IS_ENTRY_OR_EXIT_POINT = IS_ENTRY_POINT | IS_EXIT_POINT,
}
export const enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  UP,
  DOWN,
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

  PHARMACY_1,
  PHARMACY_2,

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

  // Rooms
  ROOM_1,
  ROOM_2,
  ROOM_3,
  ROOM_4,
  ROOM_5,
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
//!SECTION
