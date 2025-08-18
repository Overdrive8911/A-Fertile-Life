import type { GameDateAndTime } from "~/game/date-and-time/class";
import type { PlayerV0_0_1 } from "./player";

type SaveDataV0_0_1 = {
	gameDateAndTime: GameDateAndTime;
	player: PlayerV0_0_1;
};

export type { SaveDataV0_0_1 };
