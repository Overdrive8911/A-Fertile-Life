import {
	RIGHT_AND_LEFT_PANEL_DIMENSION,
	ROUNDED_BORDER,
} from "../shared/constants";
import { BottomPanel } from "./left/bottom-panel";
import { TopPanel } from "./left/top-panel";

export function LeftPanel() {
	return (
		<div class="flex justify-center items-center">
			<div
				class={`${RIGHT_AND_LEFT_PANEL_DIMENSION} grid grid-rows-[1.125fr_1fr] gap-4 border border-primary ${ROUNDED_BORDER} text-center bg-base-200 overflow-y-auto lg:overflow-y-clip overflow-x-clip`}
			>
				<TopPanel />

				<BottomPanel />
			</div>
		</div>
	);
}
