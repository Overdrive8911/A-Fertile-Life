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

// To create 100x100 or 100x100x100 arrays
const gGameMapSubLocationArraySize = 100;

// A bunch of locations represent single floors of a total structure/building. This should help with grouping them
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
        extraDirectionInfo: { west: GameMapCoordinate.BLOCKED },
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

      [MapSubLocation.LAB]: {
        name: "Laboratory",
        extraDirectionInfo: { east: GameMapCoordinate.BLOCKED },
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
        extraDirectionInfo: { east: GameMapCoordinate.BLOCKED },
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
        extraDirectionInfo: { west: GameMapCoordinate.BLOCKED },
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

// The real stuff. This is where the svg image for the actual location is stored.
// Create the relevant map areas on the image using drawing tools and give them ids corresponding with the named values in `MapLocation`. Export the svg (preferably compressed) and add it here. Note to fix the image directory and try to clean up any unnecessary values
const gLocationMapSvgTable: { [key in MapLocation]?: SvgString } = {
  [MapLocation.FERTILO_INC_GROUND_FLOOR]: `
  <svg id="svg1" width="66.146mm" height="47.625mm" version="1.1" viewBox="0 0 66.146 47.625" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g transform="translate(-144.01 -247.3)">
      <image x="144.01" y="247.3" width="66.146" height="47.625" class="pixel-art" preserveAspectRatio="none" href="assets/img/map/location/fertilo_inc_ground_floor.webp"/>

      <path id="RECEPTION" d="m172.58 283.55-.003.26017-.26309-.003.003.26894-.26602-.003-.004 8.9963.26455-.002.003.26164.25724.003.005.003.002.26149 8.4617.00052.004-.27478.25724.009.002-.28064.26017.0131v-8.9846l-.27186-.003.003-.26602h-.26017v-.26309z"/>
      <path id="CORRIDOR_1" d="m174.7 274.82.0331 8.4326h4.1341v-8.4336z"/>
      <path id="LAB" d="m164.64 274.82.002 7.1313 8.4636.001.003-7.1417z"/>
      <path id="HALLWAY_7" d="m198.25 266.64.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_6" d="m189.78 266.63.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_5" d="m181.3 266.59.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_4" d="m172.87 266.63.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_3" d="m164.38 266.62.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_2" d="m155.92 266.61.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="HALLWAY_1" d="m147.45 266.61.018 7.9169 7.9124.0135-.004-7.9214z"/>
      <path id="PHARMACY_1" d="m164.38 283.56.008 5.7878 7.3835-.0165.018-5.2728.26309.0117-.0117-.26894h.25724l.006-.23971z"/>
      <path id="MEASUREMENT_CLOSET" d="m181.32 283.55-.008.23978.24391.0124.008.008h.0165l-.008.24391.24805.0124.0248.008-.004 5.2834 5.5521.004-.00053-5.8133z"/>
      <path id="PHARMACY_2" d="m182.11 274.81.0165 6.0854 6.3086-.008-.003-6.045z"/>
      <path id="CONSULTATION_ROOM" d="m188.69 266.32.0234-6.0336-6.8755-.0234.0234 6.0804z"/>
      <path id="OFFICE_WORK" d="m198.52 266.35v-.0331l-.008-7.1024 7.3753.008.0165 7.0941z"/>
    </g>
  </svg>
`,
};
