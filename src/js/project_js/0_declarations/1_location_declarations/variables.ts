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
  <svg id="svg1" version="1.1" viewBox="0 0 66 48">
    <image id="image1" x="-5.5e-6" y="3.1e-6" width="66" height="48" image-rendering="crisp-edges" onmouseover="" preserveAspectRatio="none" href="assets/img/map/location/fertilo_inc_ground_floor.webp"/>
    <path id="RECEPTION" d="m28.6 36.2-.003.26-.263-.003.003.269-.266-.003-.004 9 .265-.002.003.262.257.003.005.003.002.261 8.46.00052.004-.275.257.009.002-.281.26.0131v-8.98l-.272-.003.003-.266h-.26v-.263z"/>
    <path id="CORRIDOR_1" d="m30.7 27.5.0331 8.43h4.13v-8.43z"/>
    <path id="LAB" d="m20.6 27.5.002 7.13 8.46.001.003-7.14z"/>
    <path id="HALLWAY_7" d="m54.2 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_6" d="m45.8 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_5" d="m37.3 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_4" d="m28.9 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_3" d="m20.4 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_2" d="m11.9 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="HALLWAY_1" d="m3.44 19.3.018 7.92 7.91.0135-.004-7.92z"/>
    <path id="PHARMACY_1" d="m20.4 36.3.008 5.79 7.38-.0165.018-5.27.263.0117-.0117-.269h.257l.006-.24z"/>
    <path id="MEASUREMENT_CLOSET" d="m37.3 36.2-.008.24.244.0124.008.008h.0165l-.008.244.248.0124.0248.008-.004 5.28 5.55.004-.00053-5.81z"/>
    <path id="PHARMACY_2" d="m38.1 27.5.0165 6.09 6.31-.008-.003-6.04z"/>
    <path id="CONSULTATION_ROOM" d="m44.7 19 .0234-6.03-6.88-.0234.0234 6.08z"/>
    <path id="OFFICE_WORK" d="m54.5 19v-.0331l-.008-7.1 7.38.008.0165 7.09z"/>
  </svg>`,
};
