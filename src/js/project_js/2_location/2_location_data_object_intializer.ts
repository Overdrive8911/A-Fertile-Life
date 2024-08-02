// NOTE - Navigation locations connect different sub locations and locations together. Here, you only need to include the navigation location of one in the pair of sub locations/locations. Completing the pair doesn't do anything since the `addLocation()` function handles that.
// NOTE - The default name of the sub locations are the capital forms of the indexes of their names, e.g MapSubLocation.HALLWAY_4 has a default name of "Hallway", MapSubLocation.CORRIDOR has a default name of "Corridor". Use this for unimportant areas with duplicates
// Their coords also default to[0, 0] if not inputted
setup.initializeLocationDataObject = () => {
  // SECTION - Fertilo Inc
  // Ground Floor
  addLocation(
    MapLocation.FERTILO_INC_GROUND_FLOOR,
    "Fertilo Inc (Ground Floor)",
    gRelatedLocations.FERTILO_INC.coords,
    [
      {
        id: MapSubLocation.PORCH,
        subLocationData: {
          name: "Fertilo Inc",
          coords: [0, 0],
          nav_locations: { north: MapSubLocation.RECEPTION },
        },
      },
      {
        id: MapSubLocation.RECEPTION,
        subLocationData: {
          name: "Reception",
          coords: [0, 0],
          nav_locations: {
            north: MapSubLocation.CORRIDOR,
            east: MapSubLocation.MEASUREMENT_CLOSET,
            west: MapSubLocation.PHARMACY,
          },
        },
      },
      {
        id: MapSubLocation.MEASUREMENT_CLOSET,
        subLocationData: {
          name: "Measurement Closet",
          coords: [0, 0],
        },
      },
      {
        id: MapSubLocation.PHARMACY,
        subLocationData: {
          name: "Pharmacy",
          coords: [0, 0],
        },
      },
      {
        id: MapSubLocation.CORRIDOR,
        subLocationData: {
          nav_locations: {
            north: MapSubLocation.HALLWAY_4,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_4,
        subLocationData: {
          nav_locations: {
            west: MapSubLocation.HALLWAY_3,
            east: MapSubLocation.HALLWAY_5,
            north: MapSubLocation.STAIRCASE_2,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_3,
        subLocationData: {
          nav_locations: {
            west: MapSubLocation.HALLWAY_2,
            north: MapSubLocation.ELEVATOR_2,
            south: MapSubLocation.LAB,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_2,
        subLocationData: { nav_locations: { west: MapSubLocation.HALLWAY_1 } },
      },
      {
        id: MapSubLocation.HALLWAY_1,
        subLocationData: {
          nav_locations: {
            west: MapSubLocation.ELEVATOR_1,
            south: MapSubLocation.STAIRCASE_1,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_5,
        subLocationData: {
          nav_locations: {
            east: MapSubLocation.HALLWAY_6,
            north: MapSubLocation.CONSULTATION,
            south: MapSubLocation.PHARMACY_1,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_6,
        subLocationData: {
          nav_locations: {
            east: MapSubLocation.HALLWAY_7,
          },
        },
      },
      {
        id: MapSubLocation.HALLWAY_7,
        subLocationData: {
          nav_locations: {
            north: MapSubLocation.OFFICE_WORK,
            east: MapSubLocation.ELEVATOR_3,
          },
        },
      },
    ]
  );

  console.log(gLocationData);
};
