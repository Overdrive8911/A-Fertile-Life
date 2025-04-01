import { SubLocation, Location } from "../../../../classes";
import {
  SubLocationId,
  LocationId,
  Direction,
  Distance,
} from "../../../../enums";

// SECTION: Player House
export const Bedroom = new SubLocation(
  SubLocationId.BEDROOM,
  "Your Room",
  "Player_Bedroom",
  "ZZZ..."
);
const Kitchen = new SubLocation(
  SubLocationId.KITCHEN,
  "Your Kitchen",
  "Player_Kitchen",
  "Smells good ^w^"
);
const Bathroom = new SubLocation(
  SubLocationId.BATHROOM,
  "Your Bathroom",
  "Player_Bathroom",
  "^w^"
);
const LivingRoom = new SubLocation(
  SubLocationId.LIVING_ROOM,
  "Your Living Room",
  "",
  "Still smells like you :3"
);
const Porch = new SubLocation(
  SubLocationId.PORCH,
  "Porch",
  "Player_Porch",
  "Grassy..."
);

export const location_playerHouse = new Location(
  LocationId.PLAYER_HOUSE,
  "Your House"
)
  .addArea(Kitchen, Bedroom, LivingRoom, Porch, Bathroom)
  .connect({
    from: Bedroom,
    areas: [
      { to: Bedroom, dir: Direction.SOUTH },
      { to: LivingRoom, dir: Direction.EAST },
    ],
  })
  .connect({
    from: LivingRoom,
    areas: [
      { to: Kitchen, dir: Direction.EAST },
      {
        to: Porch,
        dir: Direction.SOUTH,
        dist: Distance.VERY_SHORT,
      },
    ],
  });
