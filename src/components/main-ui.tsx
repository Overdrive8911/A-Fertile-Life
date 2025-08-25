import BackpackIcon from "lucide-solid/icons/backpack";
import BellIcon from "lucide-solid/icons/bell";
import RotateCcwIcon from "lucide-solid/icons/rotate-ccw";
import SaveIcon from "lucide-solid/icons/save";
import SettingsIcon from "lucide-solid/icons/settings";
import ZoomInIcon from "lucide-solid/icons/zoom-in";
import ZoomOutIcon from "lucide-solid/icons/zoom-out";
import { For, type JSX } from "solid-js";
import { GAME_VARIABLES } from "~/App";
import { getRandomUUID } from "~/utils/random";
import { PassageDisplay } from "./../game/passages/passage-display";
import energyIcon from "./../media/img/icons/stats/energy.webp";
import healthIcon from "./../media/img/icons/stats/heart.webp";
import moneyIcon from "./../media/img/icons/stats/money.webp";
import moodIcon from "./../media/img/icons/stats/mood.webp";
import reputationIcon from "./../media/img/icons/stats/reputation.webp";
import stomachIcon from "./../media/img/icons/stats/stomach.webp";
import uterusExpIcon from "./../media/img/icons/stats/uterus-exp.webp";
import uterusHpIcon from "./../media/img/icons/stats/uterus-hp.webp";
import { StatMeter } from "./meter";
import GameModal from "./modal/game-modal";
import { showModal } from "./modal/generic-modal";

const RIGHT_AND_LEFT_PANEL_DIMENSION =
	"h-[97.5%] w-[85%] lg:w-[75%] contain-strict p-2 lg:p-4";
const ROUNDED_BORDER = "rounded-2xl";

function MainUI() {
	return (
		// So that on mobile portrait mode, the 3 panels can be accessed by simply swiping
		<div class="h-full w-full carousel [scrollbar-width:auto] sm:[scrollbar-width:none] grid grid-cols-[100vw_100vw_100vw] sm:grid-cols-[1fr_1.75fr_1fr] lg:grid-cols-[0.85fr_1.75fr_1fr] py-4 *:h-full *:[scroll-snap-align:start]">
			<LeftPanel />

			<CenterPanel />

			<RightPanel />
		</div>
	);
}

function LeftPanel() {
	function TopPanel() {
		function DigitalClock() {
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
			<div class="grid grid-rows-[0.75fr_1.25fr_1.5fr] gap-4">
				<DigitalClock />

				<Reminders />

				<MapArea />
			</div>
		);
	}

	function BottomPanel() {
		function Button(prop: {
			children: JSX.Element;
			onClick?: (e: MouseEvent) => void;
		}) {
			return (
				<button
					type="button"
					class="btn btn-primary btn-soft text-lg w-4/5 p-0"
					onClick={prop.onClick}
				>
					{prop.children}
				</button>
			);
		}

		const saveDialogId = getRandomUUID(),
			inventoryDialogId = getRandomUUID(),
			settingsDialogId = getRandomUUID(),
			restartDialogId = getRandomUUID();

		return (
			<div class="flex flex-col justify-end items-center gap-8 pb-4">
				<Button
					onClick={(_) => {
						showModal(saveDialogId);
					}}
				>
					<SaveIcon />
					Save
					<SaveGameModal modalId={saveDialogId} />
				</Button>

				<Button
					onClick={(_) => {
						showModal(inventoryDialogId);
					}}
				>
					<BackpackIcon />
					Inventory
					<InventoryModal modalId={inventoryDialogId} />
				</Button>

				<Button
					onClick={(_) => {
						showModal(settingsDialogId);
					}}
				>
					<SettingsIcon />
					Settings
					<SettingsModal modalId={settingsDialogId} />
				</Button>

				<Button
					onClick={(_) => {
						showModal(restartDialogId);
					}}
				>
					<RotateCcwIcon />
					Restart
					<RestartModal modalId={restartDialogId} />
				</Button>
			</div>
		);
	}

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

function CenterPanel() {
	return (
		<div
			class={`grid grid-rows-[3.5fr_1fr] gap-6 px-1 *:border *:border-primary *:rounded-2xl *:${ROUNDED_BORDER} *:p-4 *:bg-base-200`}
		>
			{/* Main passage display*/}
			<main class="prose max-w-full text-base-content overflow-auto contain-strict">
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

function RightPanel() {
	function StatusDisplay() {
		return (
			<Block title="STATS">
				<div class="flex flex-col gap-2">
					<StatMeter val={0.9} stat="Health" icon={healthIcon} />
					<StatMeter val={0.69} stat="Energy" icon={energyIcon} />
					<StatMeter val={0.87} stat="Mood" icon={moodIcon} />
					<StatMeter val={0.72} stat="Fullness" icon={stomachIcon} />
					<StatMeter val={0.89} stat="Womb Health" icon={uterusHpIcon} />
					<StatMeter
						val={0.23}
						stat="Womb Exp"
						icon={uterusExpIcon}
						highColor="blue"
						midColor="blue"
						lowColor="blue"
					/>
				</div>
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
				class={`${RIGHT_AND_LEFT_PANEL_DIMENSION} flex flex-col *:grow border border-primary ${ROUNDED_BORDER} text-center bg-base-200 gap-4 overflow-y-auto`}
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

function SaveGameModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="SAVE">
			Gorb You :3
		</GameModal>
	);
}

function SettingsModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="SETTINGS">
			Gorb You :3
		</GameModal>
	);
}

function InventoryModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="INVENTORY">
			Gorb You :3
		</GameModal>
	);
}

function RestartModal(prop: { modalId: string }) {
	return (
		<GameModal modalId={prop.modalId} title="RESTART">
			Gorb You :3
		</GameModal>
	);
}

export default MainUI;
