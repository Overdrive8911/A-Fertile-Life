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

    const itemSellingPrice = `$${getItem(itemId).price * 0.45}`;
    const itemWeight =
      getItem(itemId).weight < 1000
        ? `${getItem(itemId).weight}g`
        : `${(getItem(itemId).weight / 1000).toFixed(2)}kg`;
    const itemDescription = getItem(itemId).description;

    // TODO - Add at most 3 different locations the item was found and finally a Use button

    // Append the name, amount and image of the item
    inventoryRow.append(
      `<div class="inventory-item">
        <div class="inventory-item-name">&nbsp${nameOfItem}&nbsp</div>

        <div class="inventory-item-image pixel-art">
          <img src=${itemImageUrl}>

          <div class="inventory-tooltip">
            <p>
              <i>${itemDescription}</i>
            </p>
            
            <p>
                Selling Price = <span class="playerStatNeutral">${itemSellingPrice}</span>
                <br>
                Weight = <span class="playerStatNeutral">${itemWeight}</span>
            </p>
          </div>
        </div>

        <div class="inventory-item-footer">x${numOfDuplicates}&nbsp</div>
      </div>`
    );
  }

  Dialog.setup("Inventory", "inventory-dialog");
  Dialog.append(inventoryRow);
  Dialog.open();
};
