import type { Player } from "~/game/character/class/player";
import type { GameDateAndTime } from "~/game/date-and-time/class";

type SaveDataV0_0_1 = {
	gameDateAndTime: GameDateAndTime;
	player: Player;
};

export type { SaveDataV0_0_1 };
