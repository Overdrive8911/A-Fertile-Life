import { For, type JSX } from "solid-js";
import { PassageDisplay } from "./../game/passages/passage-display";

function MainUI() {
	return (
		<div class="h-full w-[300vw] sm:w-full grid grid-cols-3 sm:grid-cols-[1fr_2.5fr_1fr] gap-[7.5%] py-4 px-[2.5%] *:h-full">
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
		<div class="grid grid-rows-[3.5fr_1fr] gap-6 *:border *:border-primary *:rounded-box *:p-4 *:bg-base-200">
			{/* Main passage display*/}
			<main class="overflow-auto contain-strict">
				<PassageDisplay />
			</main>

			{/* Buttons for interacting with the passage*/}
			<div class="grid grid-cols-3 md:grid-cols-4 gap-4">
				<For each={["Option 1", "Option 2", "Option 3", "Option 4"]}>
					{(val) => (
						<button type="button" class="btn btn-primary btn-soft">
							{val}
						</button>
					)}
				</For>
			</div>
		</div>
	);
}

function RightPanel() {
	function Block(prop: { title: string; children: JSX.Element }) {
		return (
			// To hide the ugly border on the last element, we use the `last:` variant
			<div class="flex flex-col last:[&_div]:border-b-0">
				<h2 class="text-xl font-bold">{prop.title}</h2>

				<div class="grow border-b border-t border-primary">{prop.children}</div>
			</div>
		);
	}

	function StatusDisplay() {
		return (
			<Block title="STATS">
				<p>Health: 100</p>
				<p>Happiness: 80</p>
				<p>Wealth: 50</p>
				<p>Energy: 70</p>
				<p>Reputation: 60</p>
				<p>Skills: Cooking, Farming, Crafting</p>
			</Block>
		);
	}

	function StatusEffects() {
		return <Block title="STATUS EFFECTS">TODO: List of status effects</Block>;
	}

	function PlayerDisplay() {
		return <Block title="YOU">TODO: Player display with name, age,</Block>;
	}

	return (
		<div class="grid grid-rows-3 border border-primary rounded-box text-center bg-base-200">
			<StatusDisplay />

			<StatusEffects />

			<PlayerDisplay />
		</div>
	);
}

export default MainUI;
