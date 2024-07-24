const storeItem = (itemId: ItemId) => {
  // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID

  const inventoryItem: InventoryItem = {
    itemId: itemId,
    locationObtained: variables().player.locationData.location,
  };

  variables().player.inventory.set(
    variables().player.inventory.size,
    inventoryItem
  );
};

// Deletes the inventory item object from the player's inventory (multiple times if `amount` is specified)
const removeItem = (itemId: ItemId, amount?: number) => {
  if (amount === undefined) amount = 1;

  while (amount > 0) {
    variables().player.inventory.forEach((value, key) => {
      if (value.itemId == itemId) {
        variables().player.inventory.delete(key);
      }
    });
    amount--;
  }
};

const getItem = (itemId: ItemId) => {
  // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just check the static copy in `gInGameItems`

  return gInGameItems[itemId];
};

const validateItemId = (itemId: ItemId) => {
  if (!gInGameItems[itemId]) return false;

  return true;
};

const getItemIdFromStringId = (itemIdString: string) => {
  for (const i in gInGameItems) {
    if (Object.prototype.hasOwnProperty.call(gInGameItems, i)) {
      const item = gInGameItems[i as unknown as ItemId];

      if (item.itemIdString == itemIdString) {
        return item.itemId;
      }
    }
  }

  return ItemId.DUMMY;
};

const returnNoDuplicateArrayOfInventoryIds = () => {
  let arr: ItemId[] = [];

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
