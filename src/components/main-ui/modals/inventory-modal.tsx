import type { LucideProps } from "lucide-solid";
import FoodIcon from "lucide-solid/icons/apple";
import AllItemsIcon from "lucide-solid/icons/layout-grid";
import MiscellaneousIcon from "lucide-solid/icons/package";
import DrugIcon from "lucide-solid/icons/pill";
import ClothingIcon from "lucide-solid/icons/shirt";
import KeyItemIcon from "lucide-solid/icons/star";
import TrashIcon from "lucide-solid/icons/trash-2";
import {
	createMemo,
	createSelector,
	createSignal,
	For,
	Index,
	Match,
	Show,
	Switch,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
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
import type { EnumToArray } from "~/types/generics";
import { getRandomUUID } from "~/utils/random";
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
			{/* Item grid with button tab for switching between categories / tags */}
			<section class="flex flex-col gap-4 contain-inline-size h-[70vh]">
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
									// count: instances.length,
									// // Sowt by obtainedOn to show oldest/newest fiwst
									// sortedInstances: instances.sort((a, b) =>
									//   a.obtainedOn.getTime() - b.obtainedOn.getTime()
									// ),
									// // Fow stackable items, show combined info
									// hasMultiple: instances.length > 1,
									// // Check if any have speciaw pwopewties (equipped, expiwing, etc)
									// hasSpecialStates: instances.some(i =>
									//   (i.isEquippable() && i.isEquipped) ||
									//   (i.isConsumable() && !i.isUsable())
									// )
								})),
							];
						});

						return (
							<Index each={itemStacks()}>
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
				<span class="text-info">{props.value}</span>
			</div>
		);
	}

	const itemData = () => gInGameItems[props.itemId];
	const itemName = () => itemData().name;

	const [selectedInventoryItem, setSelectedInventoryItem] =
		createSignal<BaseInventoryItem | null>(null);
	const isInventoryItemSelected = createSelector(selectedInventoryItem);

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
											<Show when={equippableInventoryItem().isEquipped}>
												{(_) => (
													<div class="badge badge-primary badge-xs absolute -top-1 -right-1">
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
				<div class="h-64 sm:h-80 sm:min-h-fit justify-self-center p-2 border border-primary rounded-box bg-base-200 aspect-square flex flex-col gap-2 justify-center items-center [&_p]:text-sm [&_p]:md:text-base">
					<Show when={selectedInventoryItem()}>
						{(inventoryItem) => {
							const obtainedOn = () => inventoryItem().obtainedOn;
							const obtainedOnUtilityData = () => obtainedOn().data;

							return (
								<>
									{/* Detailed information */}
									<div>
										<InfoRow
											label="Found on"
											value={`${obtainedOn().date.toLocaleDateString()}, ${obtainedOnUtilityData().hours}:${`${obtainedOnUtilityData().minutes}`.padStart(2, "0")}`}
										/>
										<InfoRow label="Found at" value="TODO" />

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
															label="Status"
															value={
																equippable().isEquipped
																	? "Equipped"
																	: "Not Equipped"
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
												<div class="pt-2 border-t border-base-300">
													<p class="opacity-80">{description()}</p>
												</div>
											)}
										</Show>
									</div>

									<div class="flex gap-2">
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
													const isEquipped = () => equippable().isEquipped;

													const canEquip = () =>
														!isEquipped() && equippable().canEquip;

													return (
														<button
															type="button"
															disabled={!canEquip()}
															class="btn btn-primary btn-sm md:btn-md"
															// onClick={_ => equippable().use()}
														>
															{isEquipped()
																? "Unequip"
																: canEquip()
																	? "Equip"
																	: "Can't Equip"}
														</button>
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
