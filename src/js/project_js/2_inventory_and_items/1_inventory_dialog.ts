setup.openInventoryDialog = () => {
  let inventoryRow = $('<div class="inventory-row"></div>');

  // let arr: ItemIds[] = [];

  // variables().player.inventory.forEach((value) => {
  //   arr.push(value.itemId);
  // });

  const noDupeItemArr = returnNoDuplicateArrayOfInventoryIds();
  for (let i = 0; i < noDupeItemArr.length; i++) {
    const itemId = noDupeItemArr[i];
    const numOfDuplicates = getNumberOfItemDuplicates(itemId);
    const nameOfItem = getItem(itemId).name;
    const itemImageUrl = getItem(itemId).imageUrl;

    // Append the name, amount and image of the item
    inventoryRow.append(
      `<div class="inventory-item">
        <div class="inventory-item-name">&nbsp${nameOfItem}&nbsp</div>

        <div class="inventory-item-image pixel-art">
          <img src=${itemImageUrl}>
        </div>

        <div class="inventory-item-footer">x${numOfDuplicates}&nbsp</div>
      </div>`
    );
  }

  Dialog.setup("Inventory", "inventory-dialog");
  Dialog.append(inventoryRow);
  Dialog.open();
};
