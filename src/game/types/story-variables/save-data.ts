import type { GameDateAndTime } from "~/game/date-and-time/class";
import type { Player } from "./player";

type SaveDataV0_0_1 = {
	gameDateAndTime: GameDateAndTime;
	player: Player;
};

export type { SaveDataV0_0_1 };
