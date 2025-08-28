import type { LucideProps } from "lucide-solid";
import FoodIcon from "lucide-solid/icons/apple";
import AllItemsIcon from "lucide-solid/icons/layout-grid";
import MiscellaneousIcon from "lucide-solid/icons/package";
import DrugIcon from "lucide-solid/icons/pill";
import ClothingIcon from "lucide-solid/icons/shirt";
import KeyItemIcon from "lucide-solid/icons/star";
import TrashIcon from "lucide-solid/icons/trash-2";
import { createSelector, createSignal, For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { useMediaQuery } from "solidjs-use";
import { GAME_VARIABLES } from "~/App";
import { BaseButton } from "~/components/button";
import { ItemTag } from "~/game/item/enums";
import { getNameOfItemTag } from "~/game/item/utils";
import GameModal from "../../modal/game-modal";

export function InventoryModal(prop: { modalId: string }) {
	const itemTags = [
		ItemTag.ALL,
		ItemTag.CLOTHING,
		ItemTag.DRUGS,
		ItemTag.FOOD,
		ItemTag.KEY_ITEM,
		ItemTag.MISCELLANEOUS,
		ItemTag.TRASH,
	] as const satisfies readonly [ItemTag, ...ItemTag[]] & {
		[K in ItemTag]: ItemTag;
	};

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

	const isMobileScreen = useMediaQuery("(max-width: 48rem)");

	return (
		<GameModal modalId={prop.modalId} title="INVENTORY" class="overflow-clip">
			{/* The inventory will be a grid with 2 parts seperated by column or row (depending on viewport size)

		The left / top will contain all the items while the right / bottom will be the view / extra description of the item / view of equipped items */}
			<div class="grid grid-row-[1.25fr_1fr] md:grid-cols-[1.25fr_1fr] md:grid-row-1">
				{/* Item grid with button tab for switching between categories / tags */}
				<section class="flex flex-col gap-4 contain-inline-size">
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
											{isMobileScreen() ? "" : tagName}
										</button>
									</div>
								);
							}}
						</For>
					</div>

					{/* The actual grid that displays the inventory's items */}
					<section class="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2 overflow-y-auto overflow-x-clip h-[60vh] [scrollbar-gutter:stable] auto-rows-max">
						<For
							each={GAME_VARIABLES.player.inventory.getItem({
								type: "itemTag",
								param: selectedTag(),
							})}
						>
							{(item) => {
								const itemData = () => item.data;

								return (
									<button
										type="button"
										class="btn btn-primary btn-outline h-auto aspect-square"
									>
										{itemData().name}
									</button>
								);
							}}
						</For>
					</section>
				</section>
			</div>
		</GameModal>
	);
}
