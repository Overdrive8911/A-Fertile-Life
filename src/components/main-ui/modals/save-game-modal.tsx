import { readClipboard, writeClipboard } from "@solid-primitives/clipboard";
import { createAsync } from "@solidjs/router";
import CopyIcon from "lucide-solid/icons/clipboard-copy";
import PasteIcon from "lucide-solid/icons/clipboard-paste";
import LoadIcon from "lucide-solid/icons/play";
import SaveIcon from "lucide-solid/icons/save";
import DeleteIcon from "lucide-solid/icons/trash-2";
import {
	createMemo,
	createSignal,
	Index,
	onCleanup,
	onMount,
	Show,
	Suspense,
} from "solid-js";
import { useFileDialog } from "solidjs-use";
import { createAlert } from "~/components/alert";
import { GAME_ENGINE } from "~/game/engine/engine";
import { EngineDefaults } from "~/game/engine/enum";
import type { ExtractTypeFromAsyncGenerator } from "~/types/generics";
import { downloadData } from "~/utils/download";
import { BaseButton, CircleButton } from "../../button";
import GameModal from "../../modal/game-modal";
import { closeModal } from "../../modal/generic-modal";

export function SaveGameModal(prop: { modalId: string }) {
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

	const getAutoSaveSlotData = createMemo(() => {
		const data = existingSaves.latest?.get("autosave");

		if (data?.type === "autosave") return data;

		return null;
	});

	const autoSaveData = () => getAutoSaveSlotData()?.data;

	const getSaveSlotData = (slotNumber: number) => {
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

	const {
		onChange: onFileDialogChange,
		open: openFileDialog,
		reset: resetFileDialog,
	} = useFileDialog({});

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

	function createSaveLoadErrorAlert() {
		createAlert({
			children: "Error loading save data.",
			type: "error",
		});
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
										disabled={!autoSaveData()}
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
								<Suspense>
									{getAutoSaveSlotData()?.data.intialState.__seed}
								</Suspense>
							</td>

							<td>
								<div class="flex flex-col justify-center items-center">
									<Suspense>
										<Show when={getAutoSaveSlotData()?.data}>
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
									disabled={!autoSaveData()}
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

								const saveData = () => getSaveSlotData(slotNumber())?.data;

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
													disabled={!saveData()}
													onClick={async (_) => {
														try {
															await GAME_ENGINE.loadFromSaveSlot(slotNumber());

															closeSaveGameModal();
														} catch {
															createSaveLoadErrorAlert();
														}
													}}
													tooltip={`Load from Slot ${slotNumberToShow()}`}
												>
													<LoadIcon />
												</CircleButton>
											</div>
										</td>

										<td class="text-info">
											<Suspense>{saveData()?.intialState.__seed}</Suspense>
										</td>

										<td>
											<div class="flex flex-col justify-center items-center">
												<Suspense>
													<Show when={saveData()}>
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
												disabled={!saveData()}
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
					<BaseButton
						class="btn-primary"
						tooltip="Save to Disk"
						onClick={async (_) => {
							downloadData(
								await GAME_ENGINE.saveToExport(),
								`Save - ${GAME_ENGINE.name} - ${Date.now()}.save`,
							);
						}}
					>
						<SaveIcon />
						Export
					</BaseButton>

					<BaseButton
						class="btn-accent"
						tooltip="Load from Disk"
						onClick={async (_) => {
							openFileDialog();

							const { off: disableHandler } = onFileDialogChange(
								async (files) => {
									const possibleSaveFile = files?.[0];

									if (possibleSaveFile) {
										try {
											await GAME_ENGINE.loadFromExport(
												await possibleSaveFile.text(),
											);

											closeSaveGameModal();
										} catch {
											createSaveLoadErrorAlert();
										} finally {
											resetFileDialog();
										}
									}

									disableHandler();
								},
							);
						}}
					>
						<input class="hidden" type="file"></input>
						<LoadIcon />
						Import
					</BaseButton>

					<BaseButton
						class="btn-primary"
						tooltip="Copy to Clipboard"
						onClick={async (_) => {
							await writeClipboard(await GAME_ENGINE.saveToExport());
						}}
					>
						<CopyIcon />
						Copy
					</BaseButton>

					<BaseButton
						class="btn-accent"
						tooltip="Paste from Clipboard"
						onClick={async (_) => {
							const clipboard = await readClipboard();

							const possibleSaveString = await (
								(await clipboard[0]?.getType("text/plain")) ?? new Blob([""])
							).text();

							try {
								await GAME_ENGINE.loadFromExport(possibleSaveString);

								closeSaveGameModal();
							} catch {
								createSaveLoadErrorAlert();
							}
						}}
					>
						<PasteIcon />
						Paste
					</BaseButton>
				</div>

				<BaseButton
					class="btn-error"
					tooltip="Clear All Browser Saves"
					tooltipDir="left"
					onClick={async (_) => {
						await GAME_ENGINE.deleteAllSaveSlots();
					}}
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
