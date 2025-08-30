import { For, onMount } from "solid-js";
import { GAME_ENGINE } from "~/game/engine/engine";
import { PassageDisplay } from "../../../game/passages/passage-display";
import { ROUNDED_BORDER } from "../shared/constants";

export function CenterPanel() {
	let passageContainer!: HTMLDivElement;

	onMount(() => {
		GAME_ENGINE.on(":passageChange", () => {
			// Scroll to the top on every passage navigation
			passageContainer.scroll(0, 0);
		});
	});

	return (
		<div
			class={`grid grid-rows-1 px-1 *:border *:border-primary *:rounded-2xl *:${ROUNDED_BORDER} *:p-4 *:bg-base-200`}
		>
			{/* Main passage display*/}
			<main
				class="prose max-w-full text-base-content overflow-auto contain-strict"
				ref={passageContainer}
			>
				<PassageDisplay />
			</main>
		</div>
	);
}
