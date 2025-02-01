namespace NSLocation {
  // NOTE: (Barring the first) lm EVERY AREA MUST HAVE A CONNECTION TO AT LEAST ONE OTHER LOCATION. At least for now, don't try to make islands disconnected from others
  /* NOTE: When adding areas, do it in this order:
    - USE COMMENTS TO SECTION OUT RELATED AREAS FOR READABILITY
    - Create instances of every child area.
    - Connect them together.
    - Create the instance of the container area. 
    - Add all the child areas to the container area. */
  // Testing
  export namespace MapArea {
    const globalMap = new Region(1, "Global Map");

    const fertiloIncPorchFloor1 = new SubLocation(SubLocationId.PORCH, "Porch");
    const fertiloIncReceptionFloor1 = new SubLocation(
      SubLocationId.RECEPTION,
      "Reception",
      undefined,
      "The Entry Point of Fertilo Inc"
    );
    const fertiloIncMeasurementClosetFloor1 = new SubLocation(
      SubLocationId.MEASUREMENT_CLOSET,
      "Measurement Closet"
    );
    const fertiloIncPharmacy1Floor1 = new SubLocation(
      SubLocationId.PHARMACY_1,
      "Pharmacy 1"
    );
    const fertiloIncPharmacy2Floor1 = new SubLocation(
      SubLocationId.PHARMACY_2,
      "Pharmacy 2"
    );
    const fertiloIncCorridor1Floor1 = new SubLocation(
      SubLocationId.CORRIDOR_1,
      "Corridor 1"
    );
    const fertiloIncHallway1Floor1 = new SubLocation(
      SubLocationId.HALLWAY_1,
      "Hallway 1"
    );
    const fertiloIncHallway2Floor1 = new SubLocation(
      SubLocationId.HALLWAY_2,
      "Hallway 2"
    );
    const fertiloIncHallway3Floor1 = new SubLocation(
      SubLocationId.HALLWAY_3,
      "Hallway 3"
    );
    const fertiloIncHallway4Floor1 = new SubLocation(
      SubLocationId.HALLWAY_4,
      "Hallway 4"
    );
    const fertiloIncHallway5Floor1 = new SubLocation(
      SubLocationId.HALLWAY_5,
      "Hallway 5"
    );
    const fertiloIncHallway6Floor1 = new SubLocation(
      SubLocationId.HALLWAY_6,
      "Hallway 6"
    );
    const fertiloIncHallway7Floor1 = new SubLocation(
      SubLocationId.HALLWAY_7,
      "Hallway 7"
    );
    const fertiloIncLabFloor1 = new SubLocation(
      SubLocationId.LAB,
      "Laboratory"
    );
    const fertiloIncConsultationFloor1 = new SubLocation(
      SubLocationId.CONSULTATION,
      "Consultation Office"
    );
    const fertiloIncOfficeWorkFloor1 = new SubLocation(
      SubLocationId.OFFICE_WORK,
      "Office"
    );

    const fertiloIncGroundFloor = new Location(
      LocationId.FERTILO_INC_GROUND_FLOOR,
      "Fertilo Inc (Ground Floor)"
    );

    fertiloIncPorchFloor1.connectTo({
      area: fertiloIncReceptionFloor1,
      dir: Direction.NORTH,
      dist: 2,
    });

    fertiloIncReceptionFloor1.connectTo(
      { area: fertiloIncMeasurementClosetFloor1, dir: Direction.EAST, dist: 1 },
      { area: fertiloIncPharmacy1Floor1, dir: Direction.WEST, dist: 1 },
      { area: fertiloIncCorridor1Floor1, dir: Direction.NORTH, dist: 2 }
    );

    fertiloIncCorridor1Floor1.connectTo({
      area: fertiloIncHallway4Floor1,
      dir: Direction.NORTH,
      dist: 3,
    });

    fertiloIncHallway4Floor1.connectTo(
      { area: fertiloIncHallway1Floor1, dir: Direction.WEST, dist: 6 },
      { area: fertiloIncHallway2Floor1, dir: Direction.WEST, dist: 4 },
      { area: fertiloIncHallway3Floor1, dir: Direction.WEST, dist: 2 },
      { area: fertiloIncHallway5Floor1, dir: Direction.EAST, dist: 2 },
      { area: fertiloIncHallway6Floor1, dir: Direction.EAST, dist: 4 },
      { area: fertiloIncHallway7Floor1, dir: Direction.EAST, dist: 6 }
    );

    fertiloIncHallway3Floor1.connectTo({
      area: fertiloIncLabFloor1,
      dir: Direction.SOUTH,
      dist: 2,
    });

    fertiloIncHallway5Floor1.connectTo({
      area: fertiloIncPharmacy2Floor1,
      dir: Direction.SOUTH,
      dist: 2,
    });

    fertiloIncHallway7Floor1.connectTo({
      area: fertiloIncOfficeWorkFloor1,
      dir: Direction.NORTH,
      dist: 2,
    });

    fertiloIncHallway5Floor1.connectTo({
      area: fertiloIncConsultationFloor1,
      dir: Direction.NORTH,
      dist: 2,
    });

    fertiloIncGroundFloor.addArea(
      fertiloIncPorchFloor1,
      fertiloIncReceptionFloor1,
      fertiloIncMeasurementClosetFloor1,
      fertiloIncPharmacy1Floor1,
      fertiloIncPharmacy2Floor1,
      fertiloIncCorridor1Floor1,
      fertiloIncHallway1Floor1,
      fertiloIncHallway2Floor1,
      fertiloIncHallway3Floor1,
      fertiloIncHallway4Floor1,
      fertiloIncHallway5Floor1,
      fertiloIncHallway6Floor1,
      fertiloIncHallway7Floor1,
      fertiloIncLabFloor1,
      fertiloIncConsultationFloor1,
      fertiloIncOfficeWorkFloor1
    );

    console.log(fertiloIncGroundFloor);

    globalMap.addArea(fertiloIncGroundFloor);
  }

  // NOTE - This stores EVERY possible location. Keep in mind that moving from coords [2,6] to [2,7] or [5,3] to [4,3] takes 10 seconds on average. Note that the `entry` sub location would have its distance calculated from [0,0]
  // NOTE - The first entry in `subLocations` is where the player will enter if they move into that particular location without a set destination (aka another sub location)
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
          coords: [1, 3],
        },
        [MapSubLocation.BATHROOM]: {
          name: "Your Old Bathroom",
          coords: [5, 2],
        },
        [MapSubLocation.PORCH]: { name: "Your Old Porch", coords: [0, -3] },
        [MapSubLocation.BEDROOM]: {
          name: "Your Old Bedroom",
          coords: [1, 6],
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
  // NOTE - Add the urls of sub locations with mini icons here. Use lowercase
  export const gSubLocationIcons24x24: { [key in MapSubLocation]?: string } = {
    [MapSubLocation.DUMMY]: getUrl("dummy"),

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

    [MapSubLocation.ROOM_1]: getUrl("room"),
    [MapSubLocation.ROOM_2]: getUrl("room"),
    [MapSubLocation.ROOM_3]: getUrl("room"),
    [MapSubLocation.ROOM_4]: getUrl("room"),
    [MapSubLocation.ROOM_5]: getUrl("room"),

    [MapSubLocation.LAB]: getUrl("lab"),

    [MapSubLocation.CONSULTATION]: getUrl("consultation"),

    [MapSubLocation.OFFICE_WORK]: getUrl("office_work"),

    [MapSubLocation.MEASUREMENT_CLOSET]: getUrl("measurement_closet"),

    [MapSubLocation.PLAYER_ROOM]: getUrl("room"),
    [MapSubLocation.BEDROOM]: getUrl("bedroom"),
    [MapSubLocation.BATHROOM]: getUrl("bathroom"),
    [MapSubLocation.LIVING_ROOM]: getUrl("living_room"),
  };
  function getUrl(subLocation: string) {
    return `assets/img/map/icons/sub_location/${subLocation}.webp`;
  }
}
