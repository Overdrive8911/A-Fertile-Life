// Will probably be extended to more specific types (especially those with dynamic data like ammunition)
// Default to ItemId.DUMMY if any required member is unavailable
interface Item {
  itemId: number; // Entry in `ItemId`. Also used to get the name of the items
  itemIdString: string; // The entry in `ItemId` but as a string. e.g "DUMMY" instead of ItemId.DUMMY. It's what the macro for twee files uses to get an item's actual id
  imageUrl: string; // The relative url to its image file in relations to the compiled html file
  name: string;
  description: string; // Make it gud
  price: number; // For the player to obtain it. The selling price is 45% of this value :p
  weight: number; // In grams
  handler?: () => void; // A handler function called when the item is used. Unusable items don't need this
}

// Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()`
interface InventoryItem {
  itemId: number;
  locationObtained?: string; // It'll just store the name of the location. If it doesn't exist, the item was gotten from "???"
  price?: number;
  weight?: number;
  dynamicData?: {}; // In case an object has dynamicData, just put the required data here and read it as necessary
}
type SortingId = number; // Used in sorting the items. no two items can have the same SortingId

type Inventory = Map<SortingId, InventoryItem>;

enum InventoryItemProperties {
  PRICE_CANNOT_BE_BOUGHT = -1,
}
