enum InventoryItemIds {
  DUMMY,
}

// This will store ALL the available info for every item. All the PC will keep in their inventory is the ID of the item so the required data can be linked back here. If an item has dynamic data, then that would be stored with the PC
const gInGameItems: Item[] = [
  {
    itemId: InventoryItemIds.DUMMY,
    price: 0,
    weight: 0,
  },
];
