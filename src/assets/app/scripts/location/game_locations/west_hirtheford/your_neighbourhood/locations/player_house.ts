import { SubLocation, Location } from "../../../../classes";
import {
  SubLocationId,
  LocationId,
  Direction,
  Distance,
} from "../../../../enums";

// SECTION: Player House
export const playerBedroom = new SubLocation(
  SubLocationId.BEDROOM,
  "Your Room",
  "Player_Bedroom",
  "ZZZ..."
);
export const playerKitchen = new SubLocation(
  SubLocationId.KITCHEN,
  "Your Kitchen",
  "Player_Kitchen",
  "Smells good ^w^"
);
export const playerBathroom = new SubLocation(
  SubLocationId.BATHROOM,
  "Your Bathroom",
  "Player_Bathroom",
  "^w^"
);
export const playerLivingRoom = new SubLocation(
  SubLocationId.LIVING_ROOM,
  "Your Living Room",
  "",
  "Still smells like you :3"
);
export const playerPorch = new SubLocation(
  SubLocationId.PORCH,
  "Porch",
  "Player_Porch",
  "Grassy..."
);

export const location_playerHouse = new Location(
  LocationId.PLAYER_HOUSE,
  "Your House"
)
  .addArea(
    playerKitchen,
    playerBedroom,
    playerLivingRoom,
    playerPorch,
    playerBathroom
  )
  .connect({
    from: playerBedroom,
    areas: [
      { to: playerBedroom, dir: Direction.SOUTH },
      { to: playerLivingRoom, dir: Direction.EAST },
    ],
  })
  .connect({
    from: playerLivingRoom,
    areas: [
      { to: playerKitchen, dir: Direction.EAST },
      {
        to: playerPorch,
        dir: Direction.SOUTH,
        dist: Distance.VERY_SHORT,
      },
    ],
  });
