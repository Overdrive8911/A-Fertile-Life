namespace NSInventoryAndItem {
  $(document).on(":passageend", () => {
    const inventoryBtn = $(".ui-settings-button-inventory");

    inventoryBtn.ariaClick(() => {
      openInventoryDialog();
    });
  });
}
