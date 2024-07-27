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
// Some sub locations can occur multiple times in a single location and as such have a number appended to them.
enum MapSubLocation {
  RECEPTION = "subLocation_reception",
  CLOSET = "subLocation_closet",
  MEASURING_CLOSET = "subLocation_measuringCloset",
  CEO_OFFICE = "subLocation_CEOOffice",
  PHARMACY = "subLocation_pharmacy",
  CONSULTATION = "subLocation_consultation",
  LAB = "subLocation_lab",
  OFFICE_WORK = "subLocation_officeWork",

  ROOM = "subLocation_room",
  PLAYER_ROOM = "subLocation_playerRoom",
  LIVING_ROOM = "subLocation_livingRoom",
  BATHROOM = "subLocation_bathroom",
  BEDROOM = "subLocation_bedroom",
  PORCH = "subLocation_porch",

  // Hallways
  HALLWAY = "subLocation_hallway",
  HALLWAY_1 = MapSubLocation.HALLWAY + "1",
  HALLWAY_2 = MapSubLocation.HALLWAY + "2",
  HALLWAY_3 = MapSubLocation.HALLWAY + "3",
  HALLWAY_4 = MapSubLocation.HALLWAY + "4",
  HALLWAY_5 = MapSubLocation.HALLWAY + "5",

  // Corridors
  CORRIDOR = "subLocation_corridor",
  CORRIDOR_1 = MapSubLocation.CORRIDOR + "1",
  CORRIDOR_2 = MapSubLocation.CORRIDOR + "2",
  CORRIDOR_3 = MapSubLocation.CORRIDOR + "3",

  // Staircases
  STAIRCASE = "subLocation_staircase",
  STAIRCASE_1 = MapSubLocation.STAIRCASE + "1",
  STAIRCASE_2 = MapSubLocation.STAIRCASE + "2",
  STAIRCASE_3 = MapSubLocation.STAIRCASE + "3",

  // Elevators
  ELEVATOR = "subLocation_elevator",
  ELEVATOR_1 = MapSubLocation.ELEVATOR + "1",
  ELEVATOR_2 = MapSubLocation.ELEVATOR + "2",
  ELEVATOR_3 = MapSubLocation.ELEVATOR + "3",
}

function subLocationSprite(spriteName: string) {
  return `assets/img/map/sub_location/${spriteName}.webp`;
}

const gSubLocationSprites: { [nameOfSubLocation in MapSubLocation]?: string } =
  {
    [MapSubLocation.RECEPTION]: subLocationSprite("reception"),
    [MapSubLocation.CONSULTATION]: subLocationSprite("consultation"),

    [MapSubLocation.CORRIDOR]: subLocationSprite("corridor"),
    [MapSubLocation.CORRIDOR_1]: subLocationSprite("corridor"),
    [MapSubLocation.CORRIDOR_2]: subLocationSprite("corridor"),
    [MapSubLocation.CORRIDOR_3]: subLocationSprite("corridor"),

    [MapSubLocation.ELEVATOR]: subLocationSprite("elevator"),
    [MapSubLocation.ELEVATOR_1]: subLocationSprite("elevator"),
    [MapSubLocation.ELEVATOR_2]: subLocationSprite("elevator"),
    [MapSubLocation.ELEVATOR_3]: subLocationSprite("elevator"),

    [MapSubLocation.HALLWAY]: subLocationSprite("hallway"),
    [MapSubLocation.HALLWAY_1]: subLocationSprite("hallway"),
    [MapSubLocation.HALLWAY_2]: subLocationSprite("hallway"),
    [MapSubLocation.HALLWAY_3]: subLocationSprite("hallway"),
    [MapSubLocation.HALLWAY_4]: subLocationSprite("hallway"),
    [MapSubLocation.HALLWAY_5]: subLocationSprite("hallway"),

    [MapSubLocation.STAIRCASE]: subLocationSprite("staircase"),
    [MapSubLocation.STAIRCASE_1]: subLocationSprite("staircase"),
    [MapSubLocation.STAIRCASE_2]: subLocationSprite("staircase"),
    [MapSubLocation.STAIRCASE_3]: subLocationSprite("staircase"),

    [MapSubLocation.LAB]: subLocationSprite("lab"),
    [MapSubLocation.MEASURING_CLOSET]: subLocationSprite("measuring_closet"),
    [MapSubLocation.OFFICE_WORK]: subLocationSprite("office_work"),
    [MapSubLocation.PHARMACY]: subLocationSprite("pharmacy"),
  };

// This stores EVERY possible location while setup.locations stores every location that is AVAILABLE in-game
const locationDataObject: {
  [nameOfLocation in MapLocation]: GameLocation;
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
