import { For } from "solid-js";
import { PassageDisplay } from "./../game/passages/passage-display";

function MainUI() {
	return (
		<div class="h-full w-[300vw] sm:w-full grid grid-cols-3 sm:grid-cols-[1fr_2.5fr_1fr] gap-4 p-4 *:h-full">
			<LeftPanel />

			<CenterPanel />

			<RightPanel />
		</div>
	);
}

function LeftPanel() {
	return (
		<div class="w-1/4 h-full p-4">
			<h2 class="text-xl font-bold mb-4">Left Panel</h2>
			<p>Content for the left panel goes here.</p>
		</div>
	);
}

function CenterPanel() {
	return (
		<div class="h-full grid grid-rows-[3fr_1fr] gap-6 *:border *:border-primary *:rounded-box *:p-4">
			{/* Main passage display*/}
			<main class="overflow-auto contain-size bg-base-200">
				<PassageDisplay />
			</main>

			{/* Buttons for interacting with the passage*/}
			<div class="grid grid-cols-3 md:grid-cols-4 gap-4">
				<For each={["Option 1", "Option 2", "Option 3", "Option 4"]}>
					{(val) => (
						<button type="button" class="btn btn-primary btn-outline">
							{val}
						</button>
					)}
				</For>
			</div>
		</div>
	);
}

function RightPanel() {
	return (
		<div class="w-1/4 h-full p-4">
			<h2 class="text-xl font-bold mb-4">Right Panel</h2>
			<p>Content for the right panel goes here.</p>
		</div>
	);
}

export default MainUI;
