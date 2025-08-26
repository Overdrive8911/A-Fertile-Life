import { createAsync } from "@solidjs/router";
import BackpackIcon from "lucide-solid/icons/backpack";
import BellIcon from "lucide-solid/icons/bell";
import LoadIcon from "lucide-solid/icons/play";
import RotateCcwIcon from "lucide-solid/icons/rotate-ccw";
import SaveIcon from "lucide-solid/icons/save";
import SettingsIcon from "lucide-solid/icons/settings";
import DeleteIcon from "lucide-solid/icons/trash-2";
import ZoomInIcon from "lucide-solid/icons/zoom-in";
import ZoomOutIcon from "lucide-solid/icons/zoom-out";
import {
	createMemo,
	createSignal,
	For,
	Index,
	type JSX,
	onCleanup,
	onMount,
	Show,
	Suspense,
} from "solid-js";
import { GAME_VARIABLES } from "~/App";
import { DEFAULT_VARIABLES } from "~/game/engine/defaults";
import { GAME_ENGINE } from "~/game/engine/engine";
import { EngineDefaults } from "~/game/engine/enum";
import type { ExtractTypeFromAsyncGenerator } from "~/types/generics";
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
import { BaseButton, CircleButton, SquareButton } from "./button";
import { StatMeter } from "./meter";
import GameModal from "./modal/game-modal";
import { closeModal, showModal } from "./modal/generic-modal";

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
	const [existingSavesPromise, setExistingSavesPromise] = createSignal(() =>
		GAME_ENGINE.getSaves(),
	);

	type ExistingSaveType = ExtractTypeFromAsyncGenerator<
		ReturnType<ReturnType<typeof existingSavesPromise>>
	>;

	const existingSaves = createAsync<Map<"autosave" | number, ExistingSaveType>>(
		async () => {
			const saves = new Map<"autosave" | number, ExistingSaveType>();

			for await (const save of existingSavesPromise()()) {
				if (save.type === "autosave") {
					saves.set("autosave", save);
				} else {
					saves.set(save.slot, save);
				}
			}

			return saves;
		},
	);

	const autoSaveData = createMemo(() => {
		const data = existingSaves.latest?.get("autosave");

		if (data?.type === "autosave") return data;

		return null;
	});

	const saveSlotData = (slotNumber: number) => {
		const data = existingSaves.latest?.get(slotNumber);

		if (data?.type !== "autosave") return data;

		return null;
	};

	const NUMBER_OF_ROWS_PER_PAGE = 5,
		NUMBER_OF_PAGES = Math.ceil(
			EngineDefaults.SAVE_SLOTS / NUMBER_OF_ROWS_PER_PAGE,
		),
		ARRAY_OF_SAVE_SLOT_INDEXES: ReadonlyArray<number> & {
			length: EngineDefaults.SAVE_SLOTS;
		} = Array.from({ length: EngineDefaults.SAVE_SLOTS }, (_, index) => index);

	const [currentPage, setCurrentPage] = createSignal(0);

	const arrayOfSaveSlotsToDisplay = createMemo(() => {
		return ARRAY_OF_SAVE_SLOT_INDEXES.slice(
			currentPage() * NUMBER_OF_ROWS_PER_PAGE,
			currentPage() * NUMBER_OF_ROWS_PER_PAGE + NUMBER_OF_ROWS_PER_PAGE,
		);
	});

	onMount(() => {
		const saveEndListener = GAME_ENGINE.on(":saveEnd", (_) => {
			setExistingSavesPromise(() => {
				return () => GAME_ENGINE.getSaves();
			});
		});

		const deleteEndListener = GAME_ENGINE.on(":deleteEnd", (_) => {
			setExistingSavesPromise(() => {
				return () => GAME_ENGINE.getSaves();
			});
		});

		onCleanup(() => {
			saveEndListener();
			deleteEndListener();
		});
	});

	function closeSaveGameModal() {
		closeModal(prop.modalId);
	}

	return (
		<GameModal
			modalId={prop.modalId}
			title="SAVE"
			useProse={false}
			class="max-h-[90vh]"
		>
			<p class="text-warning mb-4">
				If your browser cache is cleared, saves here will be lost! Consider
				saving to file every so often!
			</p>

			<div class="mt-4 mb-4 overflow-x-auto">
				<table class="table table-zebra table-pin-rows table-sm sm:table-md **:text-center">
					<thead>
						<tr>
							<th>#</th>
							<th>Save/Load</th>
							<th>Seed</th>
							<th>Details</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{/* Autosave slot */}
						<tr>
							<th>A</th>

							<td>
								<div class="flex justify-center">
									<CircleButton
										class="btn-accent btn-outline"
										onClick={async (_) => {
											await GAME_ENGINE.loadFromSaveSlot();

											closeSaveGameModal();
										}}
										tooltip="Load Autosave"
									>
										<LoadIcon />
									</CircleButton>
								</div>
							</td>

							<td class="text-info">
								<Suspense>{autoSaveData()?.data.intialState.__seed}</Suspense>
							</td>

							<td>
								<div class="flex flex-col justify-center items-center">
									<Suspense>
										<Show when={autoSaveData()?.data}>
											{(data) => (
												<>
													<h3 class="font-bold max-w-[35ch] overflow-clip text-ellipsis">
														{data().lastPassageId}
													</h3>
													<div class="text-info">
														{data().savedOn.toLocaleString()}
													</div>
												</>
											)}
										</Show>
									</Suspense>
								</div>
							</td>

							<td>
								<CircleButton
									class="btn-error btn-outline"
									onClick={async (_) => {
										await GAME_ENGINE.deleteSaveSlot();
									}}
									tooltip="Delete Autosave"
									tooltipDir="left"
								>
									<DeleteIcon />
								</CircleButton>
							</td>
						</tr>

						<Index each={arrayOfSaveSlotsToDisplay()}>
							{(slotNumber) => {
								const slotNumberToShow = () => slotNumber() + 1;

								return (
									<tr>
										<th>{slotNumberToShow()}</th>

										<td>
											<div class="flex justify-center gap-2">
												<CircleButton
													class="btn-primary btn-outline"
													onClick={async (_) => {
														await GAME_ENGINE.saveToSaveSlot(slotNumber());

														closeSaveGameModal();
													}}
													tooltip={`Save to Slot ${slotNumberToShow()}`}
												>
													<SaveIcon />
												</CircleButton>

												<CircleButton
													class="btn-accent btn-outline"
													onClick={async (_) => {
														await GAME_ENGINE.loadFromSaveSlot(slotNumber());

														closeSaveGameModal();
													}}
													tooltip={`Load from Slot ${slotNumberToShow()}`}
												>
													<LoadIcon />
												</CircleButton>
											</div>
										</td>

										<td class="text-info">
											<Suspense>
												{saveSlotData(slotNumber())?.data.intialState.__seed}
											</Suspense>
										</td>

										<td>
											<div class="flex flex-col justify-center items-center">
												<Suspense>
													<Show when={saveSlotData(slotNumber())?.data}>
														{(data) => (
															<>
																<h3 class="font-bold max-w-[35ch] overflow-clip text-ellipsis">
																	{data().lastPassageId}
																</h3>
																<div class="text-info">
																	{data().savedOn.toLocaleString()}
																</div>
															</>
														)}
													</Show>
												</Suspense>
											</div>
										</td>

										<td>
											<CircleButton
												class="btn-error btn-outline"
												onClick={async (_) => {
													await GAME_ENGINE.deleteSaveSlot(slotNumber());
												}}
												tooltip={`Delete Slot ${slotNumberToShow()}`}
												tooltipDir="left"
											>
												<DeleteIcon />
											</CircleButton>
										</td>
									</tr>
								);
							}}
						</Index>
					</tbody>
				</table>
			</div>

			{/* Export btns */}
			<div class="flex gap-4 justify-between mb-4 [&_button]:btn-outline">
				<div class="flex gap-4 max-w-full overflow-x-auto sm:overflow-x-visible">
					<BaseButton class="btn-primary" tooltip="Save to Disk">
						<SaveIcon />
						Save...
					</BaseButton>

					<BaseButton class="btn-accent" tooltip="Load from Disk">
						<LoadIcon />
						Load...
					</BaseButton>

					<BaseButton class="btn-primary" tooltip="Save to Clipboard">
						<SaveIcon />
						Save to Clipboard
					</BaseButton>
				</div>

				<BaseButton
					class="btn-error"
					tooltip="Clear All Browser Saves"
					tooltipDir="left"
				>
					<DeleteIcon />
					Clear
				</BaseButton>
			</div>

			{/* Pagination */}
			<div class="flex justify-center">
				<div class="join *:join-item *:btn *:btn-primary *:btn-outline">
					<button
						type="button"
						onClick={() => setCurrentPage(Math.max(0, currentPage() - 1))}
					>
						«
					</button>
					<button type="button" class="btn-primary btn-outline">
						Page {currentPage() + 1} of {NUMBER_OF_PAGES}
					</button>
					<button
						type="button"
						onClick={() =>
							setCurrentPage(Math.min(NUMBER_OF_PAGES - 1, currentPage() + 1))
						}
					>
						»
					</button>
				</div>
			</div>
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
	function closeModalWithId(e: MouseEvent) {
		e.stopPropagation();

		return closeModal(prop.modalId);
	}

	return (
		<GameModal modalId={prop.modalId} title="RESTART" class="max-w-[40vw]">
			<div class="text-warning text-center mb-4">
				This will reset all unsaved progress!
			</div>

			<div class="flex justify-center gap-4">
				<button
					type="button"
					class="btn btn-primary"
					onClick={closeModalWithId}
				>
					Changed my mind...
				</button>

				<button
					type="button"
					class="btn btn-error"
					onClick={(e) => {
						GAME_ENGINE.reset();
						closeModalWithId(e);
					}}
				>
					Restart
				</button>
			</div>
		</GameModal>
	);
}

export default MainUI;
