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
	Show,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { onClickOutside, useMediaQuery } from "solidjs-use";
import { GAME_VARIABLES } from "~/App";
import { closeModal, showModal } from "~/components/modal/generic-modal";
import { type ItemId, ItemTag } from "~/game/item/enums";
import { gInGameItems } from "~/game/item/game-items";
import type { BaseInventoryItem } from "~/game/item/inventory-item/class";
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
												<img
													src={itemData().img}
													alt={`${itemName()} icon`}
													class="[image-rendering:pixelated] w-[90%] aspect-square"
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
	const itemData = () => gInGameItems[props.itemId];
	const itemName = () => itemData().name;

	return (
		<GameModal
			modalId={props.modalId}
			title={`${itemName()} Stack (${props.instances.length})`}
			class="max-w-2xl"
			useProse={false}
		>
			{/* Grid of individual items with more space and better layout */}
			<div class="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 max-h-96 overflow-y-auto">
				<For each={props.instances}>
					{(inventoryItem, index) => (
						<div class="relative">
							<button
								type="button"
								class="btn btn-primary btn-outline h-auto aspect-square flex flex-col p-2 group hover:btn-primary"
								// onClick={() => handleItemAction(inventoryItem)}
							>
								<img
									src={itemData().img}
									alt={`${itemName()} ${index() + 1}`}
									class="[image-rendering:pixelated] w-full aspect-square"
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
											<Show
												when={
													equippableInventoryItem().durability < 100 &&
													equippableInventoryItem().durability
												}
											>
												{(durability) => (
													<div class="w-full bg-base-300 rounded-full h-1 mt-1">
														<div
															class={`h-1 rounded-full ${
																durability() > 50
																	? "bg-success"
																	: durability() > 25
																		? "bg-warning"
																		: "bg-error"
															}`}
															style={`width: ${durability()}%`}
														/>
													</div>
												)}
											</Show>

											{/* Tooltip with more details */}
											<div
												class="tooltip tooltip-bottom"
												data-tip={`
									${itemName()} #${index() + 1}
									${equippableInventoryItem().durability ? `Durability: ${equippableInventoryItem().durability}%` : ""}
									${equippableInventoryItem().obtainedOn ? `Obtained: ${equippableInventoryItem().obtainedOn.toLocaleDateString()}` : ""}
								`}
											></div>
										</>
									)}
								</Show>
							</button>
						</div>
					)}
				</For>
			</div>

			{/* Action buttons at the bottom */}
			<div class="modal-action">
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
					// onClick={() => handleBulkAction('trash')}
				>
					Trash All
				</button>
			</div>
		</GameModal>
	);
}
