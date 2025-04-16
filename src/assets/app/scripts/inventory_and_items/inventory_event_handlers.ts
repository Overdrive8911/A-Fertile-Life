import { convertToClass } from "../declarations/general_declarations";
import { inventoryBtn as inventoryBtnElement } from "../story/passages/styles/ui/top_section.module.css";
import { itemImage, tooltip } from "./inventory.module.css";
import { openInventoryDialog } from "./inventory_dialog";

// SECTION - For adding functionality to the inventory icon in the top bar
$(document).on(":passageend", () => {
	const inventoryBtn = $(convertToClass(inventoryBtnElement));

	inventoryBtn.ariaClick(() => {
		openInventoryDialog();
	});
});
// !SECTION

// SECTION - Deal with the inventory tooltip and its quirks
export function inventoryTooltipHandler() {
	$(convertToClass(itemImage)).on("mouseover", (e) => {
		// let tooltipContainer: JQuery<HTMLElement> = {} as any;
		// let inventoryImageContainer: JQuery<HTMLElement> = {} as any;

		// for (let i of $(convertToClass(tooltip))) {
		// 	console.log(i);
		// 	if ($(i).css("display") != "none") {
		// 		// The active tooltip
		// 		tooltipContainer = $(i);

		// 		// The image container that is the parent to the active tooltip
		// 		inventoryImageContainer = tooltipContainer.parent();
		// 	}
		// }
		const inventoryImageContainer = $(e.target).parent();
		const tooltipContainer = inventoryImageContainer.children(
			convertToClass(tooltip)
		);

		const inventoryImageContainerBottom =
			(inventoryImageContainer.offset()?.top ?? 0) +
			(inventoryImageContainer.height() ?? 0);

		// Ensure that the tooltip container stays right beneath the inventory item's image
		tooltipContainer.offset({ top: inventoryImageContainerBottom });

		// Make sure that the tool tip doesn't cut out of the view port. Instead, shift it above the image
		const tooltipContainerBottom =
			(tooltipContainer.offset()?.top ?? 0) + (tooltipContainer.height() ?? 0);
		const viewportBottom = $(window).height();

		if (tooltipContainerBottom > (viewportBottom ?? 0)) {
			tooltipContainer.offset({
				top:
					(inventoryImageContainer.offset()?.top ?? 0) -
					(tooltipContainer.height() ?? 0),
			});
		}
	});
}
// !SECTION
