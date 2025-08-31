import { GAME_VARIABLES } from "~/game/engine/engine";
import { ROUNDED_BORDER } from "../../shared/constants";

export function DigitalClock() {
	const timeData = () => GAME_VARIABLES.gameDateAndTime.data;

	return (
		<div
			class={`${ROUNDED_BORDER} border border-primary border-dashed p-1 bg-base-300 grid grid-rows-2 place-items-center w-4/5 mx-auto text-info select-none cursor-pointer`}
		>
			<div class="countdown font-mono text-2xl text-shadow-[2px_2px_1px] text-shadow-info/25">
				<span style={{ "--value": timeData().hours }}></span>:
				<span
					style={{
						"--value": timeData().minutes,
					}}
					class="mr-2"
				></span>
			</div>

			<div class="countdown font-mono text-lg">
				{timeData().day},{" "}
				<span style={{ "--value": timeData().date }} class="mx-2"></span>
				{timeData().month}
			</div>
		</div>
	);
}
