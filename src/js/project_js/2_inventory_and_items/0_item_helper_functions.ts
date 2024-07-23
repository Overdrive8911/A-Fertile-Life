const storeItem = (item: Item) => {
  // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID

  const inventoryItem: InventoryItem = {
    itemId: item.itemId,
    locationObtained: variables().player.locationData.location,
  };

  variables().player.inventory.set(
    variables().player.inventory.size,
    inventoryItem
  );
};

const getItem = (itemId: ItemIds) => {
  // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just check the static copy in `gInGameItems`

  return gInGameItems[itemId];
};

const returnNoDuplicateArrayOfInventoryIds = () => {
  let arr: ItemIds[] = [];

  variables().player.inventory.forEach((value) => {
    arr.push(value.itemId);
  });

  return [...new Set(arr)];
};

const getNumberOfItemDuplicates = (itemId: number) => {
  let arr: number[] = [];

  variables().player.inventory.forEach((value) => {
    arr.push(value.itemId);
  });

  return arr.count(itemId);
};
