import {
	RIGHT_AND_LEFT_PANEL_DIMENSION,
	ROUNDED_BORDER,
} from "../shared/constants";
import { PlayerDisplay } from "./right/player-display";
import { StatusDisplay } from "./right/status-display";
import { StatusEffects } from "./right/status-effects";

export function RightPanel() {
	return (
		<div class="flex justify-center items-center">
			<div
				class={`${RIGHT_AND_LEFT_PANEL_DIMENSION} flex flex-col *:grow border border-primary ${ROUNDED_BORDER} text-center bg-base-200 gap-4 overflow-y-auto`}
			>
				<StatusDisplay />

				<StatusEffects />

				<PlayerDisplay />
			</div>
		</div>
	);
}
