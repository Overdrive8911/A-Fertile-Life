import { CenterPanel } from "./panels/center-panel";
import { LeftPanel } from "./panels/left-panel";
import { RightPanel } from "./panels/right-panel";

export function MainUI() {
	return (
		// So that on mobile portrait mode, the 3 panels can be accessed by simply swiping
		<div class="h-full w-full carousel [scrollbar-width:auto] sm:[scrollbar-width:none] grid grid-cols-[100vw_100vw_100vw] sm:grid-cols-[1fr_1.75fr_1fr] lg:grid-cols-[0.85fr_1.75fr_1fr] py-4 *:h-full *:[scroll-snap-align:start]">
			<LeftPanel />

			<CenterPanel />

			<RightPanel />
		</div>
	);
}
