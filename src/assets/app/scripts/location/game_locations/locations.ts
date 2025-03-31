import { Direction, Distance, LocationId } from "../enums";
import {
  subLocation_Porch,
  subLocation_Reception,
  subLocation_MeasurementCloset,
  subLocation_Pharmacy1,
  subLocation_Pharmacy2,
  subLocation_Corridor1,
  subLocation_Hallway1,
  subLocation_Hallway2,
  subLocation_Hallway3,
  subLocation_Hallway4,
  subLocation_Hallway5,
  subLocation_Hallway6,
  subLocation_Hallway7,
  subLocation_Lab,
  subLocation_Consultation,
  subLocation_OfficeWork,
  subLocation_playerKitchen,
  subLocation_playerBedroom,
  subLocation_playerLivingRoom,
  subLocation_playerPorch,
  subLocation_playerBathroom,
} from "./sub_locations";
import { Location } from "../classes";

export const location_fertiloIncGroundFloor = new Location(
  LocationId.FERTILO_INC_GROUND_FLOOR,
  "Fertilo Inc (Ground Floor)"
)
  .addArea(
    subLocation_Porch,
    subLocation_Reception,
    subLocation_MeasurementCloset,
    subLocation_Pharmacy1,
    subLocation_Pharmacy2,
    subLocation_Corridor1,
    subLocation_Hallway1,
    subLocation_Hallway2,
    subLocation_Hallway3,
    subLocation_Hallway4,
    subLocation_Hallway5,
    subLocation_Hallway6,
    subLocation_Hallway7,
    subLocation_Lab,
    subLocation_Consultation,
    subLocation_OfficeWork
  )
  .connect(
    {
      from: subLocation_Porch,
      areas: [{ to: subLocation_Reception, dir: Direction.NORTH, dist: 2 }],
    },
    {
      from: subLocation_Reception,
      areas: [
        { to: subLocation_MeasurementCloset, dir: Direction.EAST, dist: 1 },
        {
          to: subLocation_Pharmacy1,
          dir: Direction.WEST,
          dist: 1,
        },
        {
          to: subLocation_Corridor1,
          dir: Direction.NORTH,
          dist: 2,
        },
      ],
    },
    {
      from: subLocation_Corridor1,
      areas: [{ to: subLocation_Hallway4, dir: Direction.NORTH, dist: 3 }],
    },
    {
      from: subLocation_Hallway4,
      areas: [
        { to: subLocation_Hallway3, dir: Direction.WEST, dist: 2 },
        {
          to: subLocation_Hallway5,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },

    {
      from: subLocation_Hallway3,
      areas: [
        {
          to: subLocation_Lab,
          dir: Direction.SOUTH,
          dist: 2,
        },
        {
          to: subLocation_Hallway2,
          dir: Direction.WEST,
          dist: 2,
        },
      ],
    },
    {
      from: subLocation_Hallway2,
      areas: [
        {
          to: subLocation_Hallway1,
          dir: Direction.WEST,
          dist: 2,
        },
      ],
    },

    {
      from: subLocation_Hallway5,
      areas: [
        {
          to: subLocation_Pharmacy2,
          dir: Direction.SOUTH,
          dist: 2,
        },
        {
          to: subLocation_Consultation,
          dir: Direction.NORTH,
          dist: 2,
        },
        {
          to: subLocation_Hallway6,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },
    {
      from: subLocation_Hallway6,
      areas: [
        {
          to: subLocation_Hallway7,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },

    {
      from: subLocation_Hallway7,
      areas: [
        {
          to: subLocation_OfficeWork,
          dir: Direction.NORTH,
          dist: 2,
        },
      ],
    }
  );

//@ts-ignore
window.t = location_fertiloIncGroundFloor;
console.log(location_fertiloIncGroundFloor);

export const location_playerHouse = new Location(
  LocationId.PLAYER_HOUSE,
  "Your House"
)
  .addArea(
    subLocation_playerKitchen,
    subLocation_playerBedroom,
    subLocation_playerLivingRoom,
    subLocation_playerPorch,
    subLocation_playerBathroom
  )
  .connect({
    from: subLocation_playerBedroom,
    areas: [
      { to: subLocation_playerBedroom, dir: Direction.SOUTH },
      { to: subLocation_playerLivingRoom, dir: Direction.EAST },
    ],
  })
  .connect({
    from: subLocation_playerLivingRoom,
    areas: [
      { to: subLocation_playerKitchen, dir: Direction.EAST },
      {
        to: subLocation_playerPorch,
        dir: Direction.SOUTH,
        dist: Distance.VERY_SHORT,
      },
    ],
  });
