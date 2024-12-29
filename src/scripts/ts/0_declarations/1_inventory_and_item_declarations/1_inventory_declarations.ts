namespace NSInventoryAndItem {
  // NOTE - All item specific data should extend from this
  export interface GenericItemDynamicData {}
  export type ItemCallback = (
    // inventoryObject: Inventory,
    // storageIdInInventory: number,
    data?: GenericItemDynamicData
  ) => typeof data extends GenericItemDynamicData ? typeof data : unknown;
  // type a<T extends Item, U extends typeof Item> = T & (typeof T)
  // NOTE - Add all new item classes here for type safety
  export type AnyItemClass = Item &
    typeof Item &
    ItemType.Clothing &
    typeof ItemType.Clothing &
    ItemType.Drug &
    typeof ItemType.Drug &
    ItemType.Food &
    typeof ItemType.Food;
  export type ItemClassMethod<ItemClass extends AnyItemClass> = Extract<
    ItemClass[keyof ItemClass],
    Function
  >;
  // export type ItemClassMethod = Exclude<
  //   | keyof Item
  //   | keyof ItemType.Food
  //   | keyof ItemType.Clothing
  //   | keyof ItemType.Drug,
  //   Item["defaultCallback"]
  // >;
  // export type UseItemClassMethodFn<Class extends (Item | ItemType.Food| ItemType.Clothing| ItemType.Drug) > = (MethodToUse?: keyof Class) => void | ItemDynamicData

  export type SortingId = number; // Used in sorting the items. no two items can have the same SortingId

  // ANCHOR - Extensions of `GenericItemDynamicData`
  export interface ClothingDynamicData extends GenericItemDynamicData {
    clothingState: ItemType.ClothingState | number;
  }

  export type AnyItemDynamicData = ClothingDynamicData | GenericItemDynamicData;
}
