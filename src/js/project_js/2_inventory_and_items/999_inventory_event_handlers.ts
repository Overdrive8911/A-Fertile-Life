namespace NSInventoryAndItem {
  // SECTION - For adding functionality to the inventory icon in the top bar
  $(document).on(":passageend", () => {
    const inventoryBtn = $(".ui-settings-button-inventory");

    inventoryBtn.ariaClick(() => {
      openInventoryDialog();
    });
  });
  // !SECTION

  // SECTION - Deal with the inventory tooltip and its quirks
  export function inventoryTooltipHandler() {
    $(".inventory-item-image").on("mouseover", () => {
      let tooltipContainer: JQuery<HTMLElement>;
      let inventoryImageContainer: JQuery<HTMLElement>;

      for (let i of $(".inventory-tooltip")) {
        if ($(i).css("display") != "none") {
          // The active tooltip
          tooltipContainer = $(i);

          // The image container that is the parent to the active tooltip
          inventoryImageContainer = tooltipContainer.parent();
        }
      }

      const inventoryImageContainerBottom =
        inventoryImageContainer.offset().top + inventoryImageContainer.height();

      // Ensure that the tooltip container stays right beneath the inventory item's image
      tooltipContainer.offset({ top: inventoryImageContainerBottom });

      // Make sure that the tool tip doesn't cut out of the view port. Instead, shift it above the image
      const tooltipContainerBottom =
        tooltipContainer.offset().top + tooltipContainer.height();
      const viewportBottom = $(window).height();

      if (tooltipContainerBottom > viewportBottom) {
        tooltipContainer.offset({
          top: inventoryImageContainer.offset().top - tooltipContainer.height(),
        });
      }
    });
  }
  // !SECTION
}
