interface InventoryItem {
  itemId: number; // Entry in `InventoryItemIds`. Also used to get the name of the items
  price: number; // For the player to obtain it. The selling price is 45% of this value :p
  weight: number; // In grams
  locationObtained: GameLocation;
  handler?: () => void; // A handler function called when the item is used. Unusable items don't need this
}
type SortingId = number; // Used in sorting the items. no two items can have the same SortingId

type Inventory = Map<SortingId, InventoryItem>;

enum InventoryItemProperties {
  PRICE_CANNOT_BE_BOUGHT = -1,
}
