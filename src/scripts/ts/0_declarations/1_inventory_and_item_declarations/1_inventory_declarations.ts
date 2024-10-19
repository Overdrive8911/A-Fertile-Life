namespace NSInventoryAndItem {
  // Will probably be extended to more specific types (especially those with dynamic data like ammunition)
  // Default to ItemId.DUMMY if any required member is unavailable
  export interface Item {
    itemId: ItemId; // Entry in `ItemId`. Also used to get the name of the items
    imageUrl: string; // The relative url to its image file in relations to the compiled html file
    name: string;
    description: string; // Make it gud
    price: number; // For the player to obtain it. The selling price is 45% of this value :p
    weight: number; // In grams
    tags?: ItemTag[]; // For sorting items
    handler?: (...arg: unknown[]) => Data; // A handler function called when the item is used. Unusable items don't need this. Return data (and parameters) will be an array/iterable/single primitive value and will likely be of the same structure (since the stored data in an inventory item(if any) may be used as arguments)
  }
  type Data = unknown[] | unknown | undefined | void;

  // Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()`
  export interface InventoryItem {
    itemId: ItemId; // To know what type of item it is
    extraIdData?: number | string; // To identify a particular stored item in the inventory (in cases where there are multiple items with the same id but this particular item should be used), it should always be unique and is optionally set when an object is stored with `storeItem()`.
    locationObtained?: string; // NOTE - It's actually meant to be a number, so make sure to convert it appropriately when merging. It'll just store the name of the location. If it doesn't exist, the item was gotten from "???"
    price?: number;
    weight?: number;
    dynamicData?: unknown; // In case an object has dynamicData, just put the required data here and read it as necessary
  }
  export type SortingId = number; // Used in sorting the items. no two items can have the same SortingId
}
