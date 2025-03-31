/* NOTE: Due to the way that UUIDs are generated, changing the order of class instantiation may result in regenerating UUIDs and may also result in inconsistencies with the player's save data. 

As such, ensure that all "safe zones", which are areas where the player's can confidently save without the risk of issues, are defined at the top of this file and should NEVER have their positions altered unless you want to break them :p 

Edit: I've added a safeguard that'll prevent the saved area id from messing up too bad as long as the passage doesn't *also* change. 

TLDR: Don't think too much about anything if only a single area is attached to a passage. Even if multiple are attached to a passage, it shouldn't be much of an issue as long as you don't mess up the order. Even if you do, worst case scenario is that the player get's warped to a similar passage (and I'll probably implement a tool to manually fix that).

If the player stays in a "safe-zone", this is a non-issue. */

//ANCHOR - Assume that any areas with the same passage name are the same

import { SubLocation } from "../classes";
import { MapEntityFlags, SubLocationId } from "../enums";

// SECTION: Player House
export const subLocation_playerBedroom = new SubLocation(
  SubLocationId.BEDROOM,
  "Your Room",
  "Player_Bedroom",
  "ZZZ..."
);
export const subLocation_playerKitchen = new SubLocation(
  SubLocationId.KITCHEN,
  "Your Kitchen",
  "Player_Kitchen",
  "Smells good ^w^"
);
export const subLocation_playerBathroom = new SubLocation(
  SubLocationId.BATHROOM,
  "Your Bathroom",
  "Player_Bathroom",
  "^w^"
);
export const subLocation_playerLivingRoom = new SubLocation(
  SubLocationId.LIVING_ROOM,
  "Your Living Room",
  "",
  "Still smells like you :3"
);
export const subLocation_playerPorch = new SubLocation(
  SubLocationId.PORCH,
  "Porch",
  "Player_Porch",
  "Grassy..."
);
//!SECTION

//SECTION: Fertilo Inc
export const subLocation_Porch = new SubLocation(
  SubLocationId.PORCH,
  "Porch",
  "Fertilo_Inc_Porch",
  "Get Porched",
  MapEntityFlags.IS_ENTRY_OR_EXIT_POINT
);
export const subLocation_Reception = new SubLocation(
  SubLocationId.RECEPTION,
  "Reception",
  "Fertilo_Inc_Reception",
  "The Entry Point of Fertilo Inc"
);
export const subLocation_MeasurementCloset = new SubLocation(
  SubLocationId.MEASUREMENT_CLOSET,
  "Measurement Closet",
  "Fertilo_Inc_Measurement_Closet"
);
export const subLocation_Pharmacy1 = new SubLocation(
  SubLocationId.HALLWAY,
  "Pharmacy",
  "Fertilo_Inc_Pharmacy"
);
export const subLocation_Pharmacy2 = new SubLocation(
  SubLocationId.HALLWAY,
  "Pharmacy",
  "Fertilo_Inc_Pharmacy"
);
export const subLocation_Corridor1 = new SubLocation(
  SubLocationId.CORRIDOR,
  "Corridor",
  "Fertilo_Inc_Corridor"
);
export const subLocation_Hallway1 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway2 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway3 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway4 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway5 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway6 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Hallway7 = new SubLocation(
  SubLocationId.HALLWAY,
  "Hallway",
  "Fertilo_Inc_Hallway"
);
export const subLocation_Lab = new SubLocation(
  SubLocationId.LAB,
  "Laboratory",
  "Fertilo_Inc_Lab"
);
export const subLocation_Consultation = new SubLocation(
  SubLocationId.CONSULTATION,
  "Consultation Office",
  "Fertilo_Inc_Consultation"
);
export const subLocation_OfficeWork = new SubLocation(
  SubLocationId.OFFICE_WORK,
  "Office",
  "Fertilo_Inc_Office_Work"
);

export const subLocation_ceoOffice = new SubLocation(
  SubLocationId.CEO_OFFICE,
  "CEO Office",
  "Fertilo_Inc_CEO_Office",
  "Fertilo's Domain"
);

export const subLocation_fertiloIncPlayerRoom = new SubLocation(
  SubLocationId.ROOM,
  "Your Room",
  "Fertilo_Inc_Player_Room",
  "Your New Room"
);
//!SECTION
