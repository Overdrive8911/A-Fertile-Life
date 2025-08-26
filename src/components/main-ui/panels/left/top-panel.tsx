import { DigitalClock } from "./digital-clock";
import { MapArea } from "./map-area";
import { Reminders } from "./reminders";

export function TopPanel() {
	return (
		<div class="grid grid-rows-[0.75fr_1.25fr_1.5fr] gap-4">
			<DigitalClock />

			<Reminders />

			<MapArea />
		</div>
	);
}
