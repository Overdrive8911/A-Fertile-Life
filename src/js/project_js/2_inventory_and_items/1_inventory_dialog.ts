setup.openInventoryDialog = () => {
  let inventoryRow = $('<div class="inventory-row"></div>');

  for (let i = 0; i < variables().player.inventory.size; i++) {
    const item = variables().player.inventory.get(i);

    // Append the name, amount and image of the item
    inventoryRow.append(`<div class="inventory-item">CHEESE</div>`);
  }

  Dialog.setup("Inventory", "inventory-dialog");
  Dialog.append(inventoryRow);
  Dialog.open();
};
