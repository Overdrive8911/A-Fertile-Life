import type { LucideProps } from "lucide-solid";
import FoodIcon from "lucide-solid/icons/apple";
import AscendingOrderIcon from "lucide-solid/icons/arrow-down-a-z";
import DescendingOrderIcon from "lucide-solid/icons/arrow-down-z-a";
import AllItemsIcon from "lucide-solid/icons/layout-grid";
import UnequipIcon from "lucide-solid/icons/minus";
import MiscellaneousIcon from "lucide-solid/icons/package";
import DrugIcon from "lucide-solid/icons/pill";
import EquipIcon from "lucide-solid/icons/plus";
import ClothingIcon from "lucide-solid/icons/shirt";
import KeyItemIcon from "lucide-solid/icons/star";
import TrashIcon from "lucide-solid/icons/trash-2";
import {
	createEffect,
	createMemo,
	createSelector,
	createSignal,
	For,
	Index,
	Match,
	on,
	Show,
	Switch,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { createStore, produce } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { useMediaQuery } from "solidjs-use";
import { BaseButton } from "~/components/button";
import { Meter } from "~/components/meter";
import { triggerConfirmationModal } from "~/components/modal/confirmation-modal";
import { closeModal, showModal } from "~/components/modal/generic-modal";
import { GAME_ENGINE, GAME_VARIABLES } from "~/game/engine/engine";
import { type ItemId, ItemTag } from "~/game/item/enums";
import { gInGameItems } from "~/game/item/game-items";
import type {
	BaseInventoryItem,
	ConsumableInventoryItem,
	EquippableInventoryItem,
} from "~/game/item/inventory-item/class";
import { getNameOfItemTag } from "~/game/item/utils";
import { presentNumberAsMoney } from "~/game/shared/utils";
import type { EnumToArray } from "~/types/generics";
import { getRandomUUID } from "~/utils/random";
import { capitalizeString } from "~/utils/string";
import GameModal from "../../modal/game-modal";

export function InventoryModal(prop: { modalId: string }) {
	const itemTags = [
		ItemTag.ALL,
		ItemTag.KEY_ITEM,
		ItemTag.FOOD,
		ItemTag.CLOTHING,
		ItemTag.DRUGS,
		ItemTag.TRASH,
		ItemTag.MISCELLANEOUS,
	] as const satisfies EnumToArray<ItemTag>;

	const icons = {
		[ItemTag.ALL]: AllItemsIcon,
		[ItemTag.CLOTHING]: ClothingIcon,
		[ItemTag.DRUGS]: DrugIcon,
		[ItemTag.FOOD]: FoodIcon,
		[ItemTag.KEY_ITEM]: KeyItemIcon,
		[ItemTag.MISCELLANEOUS]: MiscellaneousIcon,
		[ItemTag.TRASH]: TrashIcon,
	} as const satisfies Record<ItemTag, (props: LucideProps) => JSX.Element>;

	const [selectedTag, setSelectedTag] = createSignal(ItemTag.ALL);
	const isTagSelected = createSelector(selectedTag);

	type SortingParam = {
		param: "a-z" | "price" | "weight" | "quantity" | "recency";
		dir: "asc" | "desc";
	};
	const [sortingParam, setSortingParam] = createStore<SortingParam>({
		dir: "asc",
		param: "a-z",
	});
	const isSortingParam = createSelector(() => sortingParam.param);

	const isMobileScreenInPortraitOrLandscape =
		useMediaQuery("(max-width: 64rem)");

	const gameInventory = () => GAME_VARIABLES.player.inventory;

	return (
		<GameModal
			modalId={prop.modalId}
			title={(() => {
				const inventoryUsage = () => gameInventory().usage;

				return (
					<>
						INVENTORY -{" "}
						<span
							class={`${inventoryUsage() === "high" ? "text-error" : inventoryUsage() === "medium" ? "text-warning" : "text-success"}`}
						>
							{gameInventory().usedCapacity}
						</span>{" "}
						/ {gameInventory().capacity}
					</>
				);
			})()}
			class="overflow-clip min-h-fit"
			useProse={false}
		>
			{/* The inventory will display all the items uniquely, i.e multiple items of the same id will not be shown repeatedly, instead, each shown item will trigger a modal when clicked that will alllow proper inspection. */}
			{/* Item grid with button tab for switching between categories / tags as well as sorting and searching */}
			<section class="flex flex-col gap-4 contain-inline-size h-[70vh]">
				<div class="flex gap-4 justify-center items-center flex-wrap">
					{/* Button tab list for the item tags */}
					<div
						class="join flex-wrap justify-center"
						role="tablist"
						aria-label="Item Categories"
					>
						<For each={itemTags}>
							{(tag) => {
								const tagName = getNameOfItemTag(tag);
								const tagPanelName = `${tagName} Panel` as const;
								const isSelected = () => isTagSelected(tag);

								return (
									<div class="tooltip" data-tip={tagPanelName}>
										<button
											class={`btn btn-primary btn-sm md:btn-md whitespace-nowrap ${isSelected() ? "" : "btn-outline"}`}
											type="button"
											role="tab"
											aria-selected={isSelected()}
											aria-controls={tagPanelName}
											onClick={(_) => setSelectedTag(tag)}
										>
											<Dynamic component={icons[tag]} />
											{isMobileScreenInPortraitOrLandscape() ? "" : tagName}
										</button>
									</div>
								);
							}}
						</For>
					</div>

					{/* Simple wrapper */}
					<div class="flex gap-4 justify-around items-center">
						{/* Container for sorting */}
						<div class="flex justify-center items-center gap-2 flex-nowrap whitespace-nowrap">
							Sort By:
							{/* Select for the parameter used for sorting */}
							{(() => {
								const alphabeticParam = "a-z" satisfies SortingParam["param"],
									priceParam = "price" satisfies SortingParam["param"],
									recencyParam = "recency" satisfies SortingParam["param"],
									quantityParam = "quantity" satisfies SortingParam["param"],
									weightParam = "weight" satisfies SortingParam["param"];

								return (
									<select
										class="select select-primary w-fit"
										onInput={({ target: { value } }) => {
											if (
												value !== alphabeticParam &&
												value !== priceParam &&
												value !== quantityParam &&
												value !== weightParam &&
												value !== recencyParam
											)
												throw new Error("Invalid option");

											setSortingParam(
												produce((state) => {
													state.param = value;
												}),
											);
										}}
									>
										<option
											selected={isSortingParam(alphabeticParam)}
											value={alphabeticParam}
										>
											A-Z
										</option>
										<option
											selected={isSortingParam(priceParam)}
											value={priceParam}
										>
											Price
										</option>
										<option
											selected={isSortingParam(recencyParam)}
											value={recencyParam}
										>
											Recency
										</option>
										<option
											selected={isSortingParam(quantityParam)}
											value={quantityParam}
										>
											Quantity
										</option>
										<option
											selected={isSortingParam(weightParam)}
											value={weightParam}
										>
											Weight
										</option>
									</select>
								);
							})()}
							{/* Ascending or descending order */}
							{(() => {
								const btnClass = "btn btn-primary btn-outline px-1";

								return (
									<Show
										when={sortingParam.dir === "asc"}
										fallback={
											<BaseButton
												class={btnClass}
												onClick={(_) =>
													setSortingParam(
														produce((state) => {
															state.dir = "asc";
														}),
													)
												}
												tooltip="Descending Order"
												tooltipDir="left"
											>
												<DescendingOrderIcon />
											</BaseButton>
										}
									>
										<BaseButton
											class={btnClass}
											onClick={(_) =>
												setSortingParam(
													produce((state) => {
														state.dir = "desc";
													}),
												)
											}
											tooltip="Ascending Order"
											tooltipDir="left"
										>
											<AscendingOrderIcon />
										</BaseButton>
									</Show>
								);
							})()}
						</div>

						{/* Container for searching */}
						<div></div>
					</div>
				</div>

				{/* The actual grid that displays the inventory's items */}
				<section class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 p-2 overflow-y-auto overflow-x-clip [scrollbar-gutter:stable] auto-rows-max">
					{(() => {
						const itemStacks = createMemo(() => {
							const items = gameInventory().getItem({
								type: "itemTag",
								param: selectedTag(),
							});

							// Gwoup by itemId
							const stacks = new Map<ItemId, BaseInventoryItem[]>();

							items.forEach((item) => {
								const existing = stacks.get(item.itemId) || [];
								existing.push(item);
								stacks.set(item.itemId, existing);
							});

							return [
								...stacks.entries().map(([itemId, instances]) => ({
									itemId,
									instances,
								})),
							];
						});

						const sortedItemStacks = createMemo(() => {
							const applySortingDir = (val: -1 | 0 | 1) =>
								(sortingParam.dir === "asc" ? 1 : -1) * val;

							const getMostRecentInventoryItemDate = (
								inventoryItems: BaseInventoryItem[],
							) =>
								inventoryItems.reduce<Date>((acc, val) => {
									const valDate = val.obtainedOn.date;

									if (valDate > acc) acc = valDate;

									return acc;
								}, new Date(0));

							return itemStacks().toSorted((a, b) => {
								const { instances: aInstances, itemId: aItemId } = a,
									{ instances: bInstances, itemId: bItemId } = b,
									aItemData = gInGameItems[aItemId],
									bItemData = gInGameItems[bItemId];

								// By default, assume ascending order
								switch (sortingParam.param) {
									case "a-z": {
										return applySortingDir(
											aItemData.name > bItemData.name ? 1 : -1,
										);
									}

									case "price": {
										return applySortingDir(
											aItemData.price > bItemData.price ? 1 : -1,
										);
									}

									case "recency": {
										const aMostRecentItemDate =
												getMostRecentInventoryItemDate(aInstances),
											bMostRecentItemDate =
												getMostRecentInventoryItemDate(bInstances);

										return applySortingDir(
											aMostRecentItemDate > bMostRecentItemDate ? 1 : -1,
										);
									}

									case "quantity": {
										return applySortingDir(
											aInstances.length > bInstances.length ? 1 : -1,
										);
									}

									case "weight": {
										return applySortingDir(
											aItemData.weight > bItemData.weight ? 1 : -1,
										);
									}

									default:
										return 0;
								}
							});
						});

						return (
							<Index each={sortedItemStacks()}>
								{(item) => {
									const itemData = () => gInGameItems[item().itemId];
									const itemName = () => itemData().name;
									const itemStackAmount = () => item().instances.length;

									const itemStackModal = getRandomUUID();

									return (
										<>
											<button
												type="button"
												class="btn btn-primary btn-outline h-auto aspect-square relative flex flex-col"
												onClick={(_) => showModal(itemStackModal)}
											>
												<Image
													src={itemData().img}
													alt={`${itemName()} icon`}
													class="w-[90%]"
												/>

												<div class="tooltip w-full" data-tip={itemName()}>
													<div class="overflow-clip whitespace-nowrap text-ellipsis">
														{itemName()}
													</div>
												</div>

												<div class="badge badge-soft badge-accent badge-sm absolute -top-2 -right-2">
													x{itemStackAmount()}
												</div>
											</button>

											<ItemStackModal
												instances={item().instances}
												itemId={item().itemId}
												modalId={itemStackModal}
											></ItemStackModal>
										</>
									);
								}}
							</Index>
						);
					})()}
				</section>
			</section>
		</GameModal>
	);
}

interface ItemStackModalProps {
	modalId: string;
	itemId: ItemId;
	instances: BaseInventoryItem[];
}

export function ItemStackModal(props: ItemStackModalProps) {
	// Helper component for consistent info display
	function InfoRow(props: { label: string; value: string }) {
		return (
			<div class="flex justify-between items-center py-1 text-sm md:text-base">
				<span class="opacity-70">{props.label}:</span>
				<span class="text-info max-w-1/2 whitespace-nowrap text-ellipsis overflow-clip">
					{props.value}
				</span>
			</div>
		);
	}

	const itemData = () => gInGameItems[props.itemId];
	const itemName = () => itemData().name;

	const [selectedInventoryItem, setSelectedInventoryItem] =
		createSignal<BaseInventoryItem | null>(null);
	const isInventoryItemSelected = createSelector(selectedInventoryItem);

	// To prevent ui inconsistencies when sorting by reseting the selected invenotyr item to view the details of
	createEffect(
		on([() => props.instances], () => {
			setSelectedInventoryItem(null);
		}),
	);

	return (
		<GameModal
			modalId={props.modalId}
			title={`${itemName()} Stack (${props.instances.length})`}
			// class="max-w-2xl"
			useProse={false}
		>
			{/* Left / Top grid cell contains a list of the inventory items in the stack, while the right / bottom grid cell contains the info "display" of the aforementioned item */}
			<div class="grid grid-rows-[1fr_1.25fr] sm:grid-cols-2 sm:grid-rows-1 *:m-2">
				{/* Grid of individual invenotry items within a stack */}
				<div class="self-center [--cell-size:4rem] sm:[--cell-size:5rem] grid grid-cols-[repeat(auto-fit,var(--cell-size)))] auto-rows-max gap-4 justify-center pt-2 overflow-y-auto overflow-x-clip h-48 sm:h-64">
					<For each={props.instances}>
						{(inventoryItem, index) => (
							<button
								type="button"
								class={`relative btn btn-primary btn-outline w-full h-auto aspect-square flex flex-col p-2 group hover:btn-primary ${isInventoryItemSelected(inventoryItem) && "btn-active"}`}
								onClick={() => setSelectedInventoryItem(inventoryItem)}
							>
								<div class="badge badge-soft badge-accent badge-sm absolute -top-2 -right-2">
									#{index() + 1}
								</div>

								<Image
									src={itemData().img}
									alt={`${itemName()} Id: ${inventoryItem.inventoryId}`}
									class="w-full"
								/>

								<Show when={inventoryItem.isEquippable() && inventoryItem}>
									{(equippableInventoryItem) => (
										<>
											{/* Show item condition, equipped status, etc */}
											<Show when={equippableInventoryItem().equipped}>
												{(_) => (
													<div class="badge badge-info badge-soft badge-sm rounded-full absolute -top-2 -left-2">
														E
													</div>
												)}
											</Show>

											{/* Durability indicator for damaged items */}
											<Meter
												val={equippableInventoryItem().durabilityRatio}
												containerClass="rounded-field"
												height="0.5rem"
											/>
										</>
									)}
								</Show>
							</button>
						)}
					</For>
				</div>

				{/* Proper Item view */}
				<div class="h-64 md:h-80 sm:min-h-fit justify-self-center p-2 border border-primary rounded-box bg-base-200 aspect-square flex flex-col gap-4 items-center overflow-y-auto [&_p]:text-sm [&_p]:md:text-base">
					<Show when={selectedInventoryItem()}>
						{(inventoryItem) => {
							const itemData = () => inventoryItem().data;
							const obtainedOn = () => inventoryItem().obtainedOn;
							const obtainedOnUtilityData = () => obtainedOn().data;

							return (
								<>
									{/* Detailed information */}
									<div class="max-w-full">
										<InfoRow label="ID" value={inventoryItem().inventoryId} />

										<InfoRow
											label="Found on"
											value={`${obtainedOn().date.toLocaleDateString()}, ${obtainedOnUtilityData().hours}:${`${obtainedOnUtilityData().minutes}`.padStart(2, "0")}`}
										/>

										<InfoRow label="Found at" value="TODO" />

										<InfoRow
											label="Price"
											value={presentNumberAsMoney(itemData().price)}
										/>

										<InfoRow label="Weight" value={`${itemData().weight}g`} />

										<Switch>
											{/* Equipment-specific info */}
											<Match
												when={
													inventoryItem().isEquippable() &&
													(inventoryItem() as EquippableInventoryItem)
												}
											>
												{(equippable) => (
													<>
														<InfoRow
															label="Durability"
															value={`${equippable().durabilityRatio * 100}%`}
														/>

														<InfoRow
															label="Type"
															value={`${capitalizeString(equippable().data.type)}wear`}
														/>

														<InfoRow
															label="Status"
															value={
																equippable().equipped
																	? "Equipped"
																	: "Unequipped"
															}
														/>
													</>
												)}
											</Match>

											{/* Consumable-specific info */}
											{/*<Match
												when={
													inventoryItem().isConsumable() &&
													(inventoryItem() as ConsumableInventoryItem)
												}
											>
												{(consumable) => (
													<InfoRow
														label="Usable"
														value={consumable().isUsable() ? "Yes" : "No"}
													/>
												)}
											</Match>*/}
										</Switch>

										{/* Item description if available */}
										<Show when={itemData().description}>
											{(description) => (
												<div class="pt-3 border-t border-base-300">
													<p class="opacity-80">{description()}</p>
												</div>
											)}
										</Show>
									</div>

									<div class="flex gap-2">
										<Show when={inventoryItem().isDeletable}>
											<BaseButton
												class="btn-error btn-sm md:btn-md"
												onClick={(_) => {
													triggerConfirmationModal(async () => {
														GAME_ENGINE.setVars((state) => {
															inventoryItem().delete(state.player.inventory);
															setSelectedInventoryItem(null);
														});
													}, `This will permanently discard ${itemData().name}`);
												}}
											>
												<TrashIcon /> Trash
											</BaseButton>
										</Show>

										<Switch>
											<Match
												when={
													inventoryItem().isConsumable() &&
													(inventoryItem() as ConsumableInventoryItem)
												}
											>
												{(consumable) => (
													<button
														type="button"
														disabled={!consumable().isUsable()}
														class="btn btn-primary btn-sm md:btn-md"
														onClick={(_) => {
															consumable().use();

															setSelectedInventoryItem(null);
														}}
													>
														Use
													</button>
												)}
											</Match>

											<Match
												when={
													inventoryItem().isEquippable() &&
													(inventoryItem() as EquippableInventoryItem)
												}
											>
												{(equippable) => {
													const isEquipped = () => equippable().equipped;

													const canEquip = createMemo(
														() => equippable().canEquip,
													);

													return (
														<Show
															when={!isEquipped() && !canEquip()}
															fallback={
																<BaseButton
																	class="btn-primary btn-sm md:btn-md"
																	onClick={(_) =>
																		!isEquipped()
																			? equippable().equip()
																			: equippable().unequip()
																	}
																>
																	<Switch fallback="Can't Equip">
																		<Match when={isEquipped()}>
																			<UnequipIcon /> Unequip
																		</Match>

																		<Match when={canEquip()}>
																			<EquipIcon /> Equip
																		</Match>
																	</Switch>
																</BaseButton>
															}
														>
															<BaseButton
																class="btn-warning btn-sm md:btn-md"
																onClick={(_) =>
																	triggerConfirmationModal(
																		async () => equippable().equip(true),
																		`This will forcefully unequip any items equipped in the same area.`,
																	)
																}
															>
																<EquipIcon /> Force Equip
															</BaseButton>
														</Show>
													);
												}}
											</Match>
										</Switch>
									</div>
								</>
							);
						}}
					</Show>
				</div>
			</div>

			{/* Action buttons at the bottom */}
			<div class="modal-action *:btn-sm md:*:btn-md">
				<button
					type="button"
					class="btn btn-ghost"
					onClick={() => closeModal(props.modalId)}
				>
					Close
				</button>

				<Show when={props.instances[0]?.isDeletable}>
					<button
						type="button"
						class="btn btn-error"
						onClick={(_) => {
							triggerConfirmationModal(async () => {
								GAME_ENGINE.setVars((state) => {
									props.instances.forEach((inventoryItem) => {
										inventoryItem.delete(state.player.inventory);
										setSelectedInventoryItem(null);
									});
								});
							}, `This will permanently discard ${props.instances.length} ${itemData().name} items.`);
						}}
					>
						<TrashIcon />
						Trash All
					</button>
				</Show>
			</div>
		</GameModal>
	);
}

function Image(prop: { class: string; src: string; alt: string }) {
	return (
		<img
			src={prop.src}
			alt={prop.alt}
			class={`[image-rendering:pixelated] aspect-square ${prop.class}`}
		/>
	);
}
