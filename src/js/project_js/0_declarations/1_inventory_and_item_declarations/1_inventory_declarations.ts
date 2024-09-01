namespace NSInventoryAndItem {
  // Will probably be extended to more specific types (especially those with dynamic data like ammunition)
  // Default to ItemId.DUMMY if any required member is unavailable
  export interface Item {
    itemId: number; // Entry in `ItemId`. Also used to get the name of the items
    imageUrl: string; // The relative url to its image file in relations to the compiled html file
    name: string;
    description: string; // Make it gud
    price: number; // For the player to obtain it. The selling price is 45% of this value :p
    weight: number; // In grams
    tags?: ItemTag[]; // For sorting items
    handler?: (arg: any[]) => void; // A handler function called when the item is used. Unusable items don't need this
  }

  // Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()`
  export interface InventoryItem {
    itemId: number; // To know what type of item it is
    storageId?: number; // To identify a particular stored item in the inventory, it will always be unique
    locationObtained?: string; // NOTE - It's actually meant to be a number, so make sure to convert it appropriately when merging. It'll just store the name of the location. If it doesn't exist, the item was gotten from "???"
    price?: number;
    weight?: number;
    dynamicData?: {}; // In case an object has dynamicData, just put the required data here and read it as necessary
  }
  export type SortingId = number; // Used in sorting the items. no two items can have the same SortingId

  export type Inventory = Map<SortingId, InventoryItem>;
}
