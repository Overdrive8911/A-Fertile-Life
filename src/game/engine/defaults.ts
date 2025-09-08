import type { SaveDataV0_0_1 } from "~/game/types/story-variables/save-data";
import { Player } from "../character/class/player";
import { GameDateAndTime } from "../date-and-time/class";

const DEFAULT_VARIABLES: SaveDataV0_0_1 = {
	gameDateAndTime: new GameDateAndTime(Date.UTC(2021, 1, 3, 20)),
	player: new Player(),
} as const;

export { DEFAULT_VARIABLES };
