import {
	BackpackIcon,
	BellIcon,
	RotateCcwIcon,
	SaveIcon,
	SettingsIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-solid";
import { For, type JSX } from "solid-js";
import { PassageDisplay } from "./../game/passages/passage-display";

const RIGHT_AND_LEFT_PANEL_DIMENSION = "h-[97.5%] w-[75%] contain-strict";
const ROUNDED_BORDER = "rounded-2xl";

function MainUI() {
	return (
		<div class="h-full w-[300vw] sm:w-full grid grid-cols-3 sm:grid-cols-[0.85fr_1.75fr_1fr] py-4 *:h-full">
			<LeftPanel />

			<CenterPanel />

			<RightPanel />
		</div>
	);
}

function LeftPanel() {
	function TopPanel() {
		function DigitalClock() {
			return (
				<div
					class={`${ROUNDED_BORDER} border border-primary border-dashed p-1 bg-base-300 grid grid-rows-2 place-items-center w-3/4 mx-auto text-info`}
				>
					<div class="countdown font-mono text-2xl text-shadow-[2px_2px_1px] text-shadow-info/25">
						<span style="--value:15;"></span>:
						<span style="--value:30;" class="mr-2"></span> PM
					</div>

					<div class="countdown font-mono text-lg">
						WED, <span style="--value:30;" class="mx-2"></span>
						FEB
					</div>
				</div>
			);
		}

		function Reminders() {
			return (
				<Block
					title={
						<>
							REMINDERS
							<BellIcon class="inline-block ml-1" />
						</>
					}
				>
					**Display a list of recent reminders here**
				</Block>
			);
		}

		function MapArea() {
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

		return (
			<div class="grid grid-rows-[0.75fr_1.25fr_1.5fr] gap-2">
				<DigitalClock />

				<Reminders />

				<MapArea />
			</div>
		);
	}

	function BottomPanel() {
		function Button(prop: {
			handler?: (e: MouseEvent) => void;
			children: JSX.Element;
		}) {
			return (
				<button
					type="button"
					class="btn btn-primary btn-soft text-lg w-3/4"
					onClick={prop.handler}
				>
					{prop.children}
				</button>
			);
		}

		return (
			<div class="flex flex-col justify-end items-center gap-8 pb-4">
				<Button>
					<SaveIcon />
					Save
				</Button>

				<Button>
					<BackpackIcon />
					Inventory
				</Button>

				<Button>
					<SettingsIcon />
					Settings
				</Button>

				<Button>
					<RotateCcwIcon />
					Restart
				</Button>
			</div>
		);
	}

	return (
		<div class="flex justify-center items-center">
			<div
				class={`${RIGHT_AND_LEFT_PANEL_DIMENSION} p-4 grid grid-rows-2 border border-primary ${ROUNDED_BORDER} text-center bg-base-200`}
			>
				<TopPanel />

				<BottomPanel />
			</div>
		</div>
	);
}

function CenterPanel() {
	return (
		<div
			class={`grid grid-rows-[3.5fr_1fr] gap-6 px-1 *:border *:border-primary *:${ROUNDED_BORDER} *:p-4 *:bg-base-200`}
		>
			{/* Main passage display*/}
			<main class="overflow-auto contain-strict">
				<PassageDisplay />
			</main>

			{/* Buttons for interacting with the passage*/}
			<div class="grid grid-cols-3 md:grid-cols-4 gap-4 contain-strict overflow-auto">
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

function RightPanel() {
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
		<div class="flex justify-center items-center">
			<div
				class={`${RIGHT_AND_LEFT_PANEL_DIMENSION} grid grid-rows-3 border border-primary ${ROUNDED_BORDER} text-center bg-base-200 p-4 gap-4`}
			>
				<StatusDisplay />

				<StatusEffects />

				<PlayerDisplay />
			</div>
		</div>
	);
}

function Block(prop: { title: JSX.Element; children: JSX.Element }) {
	// return (
	// 	// To hide the ugly border on the last element, we use the `last:` variant
	// 	<div class="flex flex-col last:[&_div]:border-b-0">
	// 		<h2 class="text-xl font-bold">{prop.title}</h2>

	// 		<div class="grow border-b border-t border-primary">{prop.children}</div>
	// 	</div>
	// );
	//
	return (
		<div class={`flex flex-col border border-primary ${ROUNDED_BORDER}`}>
			<h2 class="text-xl font-bold">{prop.title}</h2>

			<div class="grow border-t border-primary p-2">{prop.children}</div>
		</div>
	);
}

export default MainUI;
