import { Location, SubLocation } from "../../../../classes";
import {
  SubLocationId,
  MapEntityFlags,
  LocationId,
  Direction,
} from "../../../../enums";

const porch = new SubLocation(
  SubLocationId.PORCH,
  "Porch",
  "Fertilo_Inc_Porch",
  "Get Porched",
  MapEntityFlags.IS_ENTRY_OR_EXIT_POINT
);
const reception = new SubLocation(
  SubLocationId.RECEPTION,
  "Reception",
  "Fertilo_Inc_Reception",
  "The Entry Point of Fertilo Inc"
);
const MeasurementCloset = new SubLocation(
  SubLocationId.MEASUREMENT_CLOSET,
  "Measurement Closet",
  "Fertilo_Inc_Measurement_Closet"
);
const Pharmacy1 = new SubLocation(
  SubLocationId.HALLWAY,
  "Pharmacy",
  "Fertilo_Inc_Pharmacy"
);
const Pharmacy2 = new SubLocation(
  SubLocationId.HALLWAY,
  "Pharmacy",
  "Fertilo_Inc_Pharmacy"
);
const Corridor1 = new SubLocation(
  SubLocationId.CORRIDOR,
  "Corridor",
  "Fertilo_Inc_Corridor"
);
const Hallway1 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway2 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway3 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway4 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway5 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway6 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Hallway7 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
const Lab = new SubLocation(SubLocationId.LAB, "Laboratory", "Fertilo_Inc_Lab");
const Consultation = new SubLocation(
  SubLocationId.CONSULTATION,
  "Consultation Office",
  "Fertilo_Inc_Consultation"
);
const OfficeWork = new SubLocation(
  SubLocationId.OFFICE_WORK,
  "Office",
  "Fertilo_Inc_Office_Work"
);

export const location_fertiloIncGroundFloor = new Location(
  LocationId.FERTILO_INC_GROUND_FLOOR,
  "Fertilo Inc (Ground Floor)"
)
  .addArea(
    porch,
    reception,
    MeasurementCloset,
    Pharmacy1,
    Pharmacy2,
    Corridor1,
    Hallway1,
    Hallway2,
    Hallway3,
    Hallway4,
    Hallway5,
    Hallway6,
    Hallway7,
    Lab,
    Consultation,
    OfficeWork
  )
  .connect(
    {
      from: porch,
      areas: [{ to: reception, dir: Direction.NORTH, dist: 2 }],
    },
    {
      from: reception,
      areas: [
        { to: MeasurementCloset, dir: Direction.EAST, dist: 1 },
        {
          to: Pharmacy1,
          dir: Direction.WEST,
          dist: 1,
        },
        {
          to: Corridor1,
          dir: Direction.NORTH,
          dist: 2,
        },
      ],
    },
    {
      from: Corridor1,
      areas: [{ to: Hallway4, dir: Direction.NORTH, dist: 3 }],
    },
    {
      from: Hallway4,
      areas: [
        { to: Hallway3, dir: Direction.WEST, dist: 2 },
        {
          to: Hallway5,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },

    {
      from: Hallway3,
      areas: [
        {
          to: Lab,
          dir: Direction.SOUTH,
          dist: 2,
        },
        {
          to: Hallway2,
          dir: Direction.WEST,
          dist: 2,
        },
      ],
    },
    {
      from: Hallway2,
      areas: [
        {
          to: Hallway1,
          dir: Direction.WEST,
          dist: 2,
        },
      ],
    },

    {
      from: Hallway5,
      areas: [
        {
          to: Pharmacy2,
          dir: Direction.SOUTH,
          dist: 2,
        },
        {
          to: Consultation,
          dir: Direction.NORTH,
          dist: 2,
        },
        {
          to: Hallway6,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },
    {
      from: Hallway6,
      areas: [
        {
          to: Hallway7,
          dir: Direction.EAST,
          dist: 2,
        },
      ],
    },

    {
      from: Hallway7,
      areas: [
        {
          to: OfficeWork,
          dir: Direction.NORTH,
          dist: 2,
        },
      ],
    }
  );

//@ts-ignore
window.t = location_fertiloIncGroundFloor;
console.log(location_fertiloIncGroundFloor);
