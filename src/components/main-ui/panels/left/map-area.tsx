import ZoomInIcon from "lucide-solid/icons/zoom-in";
import ZoomOutIcon from "lucide-solid/icons/zoom-out";
import { ROUNDED_BORDER } from "../../shared/constants";

export function MapArea() {
	const BUTTON_CLASS = "btn btn-primary p-0 size-full rounded-none";

	return (
		<div
			class={`${ROUNDED_BORDER} border border-primary grid grid-cols-[1fr_1.9rem] grid-rows-2 overflow-clip`}
		>
			{/* The map Canvas*/}
			<div class="row-span-2">
				MAP CANVAS HERE. TAP TO OPEN A MAGNIFIED VIEW.
			</div>

			{/*Zoom in button*/}
			<button type="button" class={BUTTON_CLASS}>
				<ZoomInIcon />
			</button>

			{/*Zoom out button*/}
			<button type="button" class={BUTTON_CLASS}>
				<ZoomOutIcon />
			</button>
		</div>
	);
}
