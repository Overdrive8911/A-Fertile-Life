namespace NSLocation {
  // NOTE - This stores EVERY possible location. Keep in mind that moving from coords [2,6] to [2,7] or [5,3] to [4,3] takes 10 seconds on average. Note that the `entry` sub location would have its distance calculated from [0,0]
  // NOTE - The first entry in `subLocations` is where the player will enter if they move into that particular location without a set destination (aka another sub location)
  // NOTE - Do not allow any of the sub location coord values to be less than `-(GameMapSubLocationArraySize/2)` or exceed `GameMapSubLocationArraySize/2 - 1`. If `GameMapSubLocationArraySize` is 100, then stay inclusively within -50 and 49. Also keep the values as whole integers
  // NOTE - Using getters for the coords of sub locations makes it easier to do edits down the line. It's also easier to understand what is connected to what
  // It's best to have an image to visualize how the coords would work
  export let gLocationData: LocationObject = {
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
          extraDirectionInfo: {
            west: GameMapCoordinate.BLOCKED,
            east: GameMapCoordinate.BLOCKED,
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
        ...(gRelatedLocations[MapLocationContainer.FERTILO_INC]
          .generalCoords as [number, number]),
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
  // Attach it to setup for use in the browser console
  setup.locationData = gLocationData;

  // Stores relative urls to the icons for sub locations
  export const gSubLocationIcons24x24: { [key in MapSubLocation]?: string } = {
    [MapSubLocation.RECEPTION]: getUrl("reception"),

    [MapSubLocation.HALLWAY_1]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_2]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_3]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_4]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_5]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_6]: getUrl("hallway"),
    [MapSubLocation.HALLWAY_7]: getUrl("hallway"),

    [MapSubLocation.PHARMACY_1]: getUrl("pharmacy"),
    [MapSubLocation.PHARMACY_2]: getUrl("pharmacy"),

    [MapSubLocation.PORCH]: getUrl("porch"),

    [MapSubLocation.CORRIDOR_1]: getUrl("corridor"),
    [MapSubLocation.CORRIDOR_2]: getUrl("corridor"),
    [MapSubLocation.CORRIDOR_3]: getUrl("corridor"),

    [MapSubLocation.LAB]: getUrl("lab"),

    [MapSubLocation.CONSULTATION]: getUrl("consultation"),

    [MapSubLocation.OFFICE_WORK]: getUrl("office_work"),

    [MapSubLocation.MEASUREMENT_CLOSET]: getUrl("measurement_closet"),
  };
  function getUrl(subLocation: string) {
    return `assets/img/map/icons/sub_location/${subLocation}.webp`.toLocaleLowerCase();
  }
}
