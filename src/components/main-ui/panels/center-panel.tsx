import { For, onMount } from "solid-js";
import { GAME_ENGINE } from "~/game/engine/engine";
import { PassageDisplay } from "../../../game/passages/passage-display";
import { ROUNDED_BORDER } from "../shared/constants";

export function CenterPanel() {
	let passageContainer: HTMLDivElement | undefined;

	onMount(() => {
		GAME_ENGINE.on(":passageChange", () => {
			// Scroll to the top on every passage navigation
			passageContainer?.scrollTo({ top: 0 });
		});
	});

	return (
		<div
			class={`grid grid-rows-[3.5fr_1fr] gap-6 px-1 *:border *:border-primary *:rounded-2xl *:${ROUNDED_BORDER} *:p-4 *:bg-base-200`}
		>
			{/* Main passage display*/}
			<main
				class="prose max-w-full text-base-content overflow-auto contain-strict"
				ref={passageContainer}
			>
				<PassageDisplay />
			</main>

			{/* Buttons for interacting with the passage*/}
			<div class="grid grid-cols-3 lg:grid-cols-4 gap-4 contain-strict overflow-auto">
				<For
					each={[
						"Option 1",
						"Option 2",
						"Option 3",
						"Lorem Ipusm Dolomet",
						"Option 5",
						"Option 6",
						"Pretty long text in box that should likely expand it, right?",
						"Option 8",
						"Option 9",
						"Option 10",
						"Option 11",
						"Option 12",
					]}
				>
					{(val) => (
						<button type="button" class="btn btn-primary btn-soft min-h-fit">
							{val}
						</button>
					)}
				</For>
			</div>
		</div>
	);
}
