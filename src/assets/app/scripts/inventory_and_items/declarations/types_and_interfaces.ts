// NOTE - All item specific data should extend from this
export interface GenericItemDynamicData {}
export type ItemCallback = (
  // inventoryObject: Inventory,
  // storageIdInInventory: number,
  data?: AnyItemDynamicData
) => typeof data extends AnyItemDynamicData ? typeof data : unknown;
// type a<T extends Item, U extends typeof Item> = T & (typeof T)
// NOTE - Add all new item classes here for type safety
type AnyItemClass = Item &
  typeof Item &
  ItemType.Clothing &
  typeof ItemType.Clothing &
  ItemType.Drug &
  typeof ItemType.Drug &
  ItemType.Food &
  typeof ItemType.Food;
export type ItemClassMethod = Extract<
  AnyItemClass[keyof AnyItemClass],
  Function
>;
export type ItemConstructorArgs<T extends Item> = Partial<{
  [K in keyof T]: T[K] extends Function
    ? K extends "customCallBack" // Ensure that the name used here matches up with the one in the `Item` class
      ? T[K]
      : never
    : T[K];
}>;
// export type ItemClassMethod = Exclude<
//   | keyof Item
//   | keyof ItemType.Food
//   | keyof ItemType.Clothing
//   | keyof ItemType.Drug,
//   Item["defaultCallback"]
// >;
// export type UseItemClassMethodFn<Class extends (Item | ItemType.Food| ItemType.Clothing| ItemType.Drug) > = (MethodToUse?: keyof Class) => void | ItemDynamicData

export type SortingId = number; // Used in sorting the items. no two items can have the same SortingId
export type ExtraIdDataType = number | string;

// ANCHOR - Extensions of `GenericItemDynamicData`
export interface ClothingDynamicData extends GenericItemDynamicData {
  clothingState: ItemType.ClothingState;
}

// NOTE: Add all item data types here
export type AnyItemDynamicData = ClothingDynamicData | GenericItemDynamicData;

export type AllClothingDurabilityPoints =
  | ItemType.ClothingState.DURABILITY_LVL_1
  | ItemType.ClothingState.DURABILITY_LVL_2
  | ItemType.ClothingState.DURABILITY_LVL_3
  | ItemType.ClothingState.DURABILITY_LVL_4
  | ItemType.ClothingState.DURABILITY_LVL_5
  | ItemType.ClothingState.DURABILITY_LVL_6
  | ItemType.ClothingState.DURABILITY_LVL_7
  | ItemType.ClothingState.DURABILITY_LVL_8
  | ItemType.ClothingState.DURABILITY_LVL_9
  | ItemType.ClothingState.DURABILITY_LVL_10
  | ItemType.ClothingState.DURABILITY_LVL_11
  | ItemType.ClothingState.DURABILITY_LVL_12
  | ItemType.ClothingState.DURABILITY_LVL_13
  | ItemType.ClothingState.DURABILITY_LVL_14
  | ItemType.ClothingState.DURABILITY_LVL_15
  | ItemType.ClothingState.DURABILITY_LVL_16
  | ItemType.ClothingState.DURABILITY_LVL_17
  | ItemType.ClothingState.DURABILITY_LVL_18
  | ItemType.ClothingState.DURABILITY_LVL_19
  | ItemType.ClothingState.DURABILITY_LVL_20
  | ItemType.ClothingState.DURABILITY_LVL_21
  | ItemType.ClothingState.DURABILITY_LVL_22
  | ItemType.ClothingState.DURABILITY_LVL_23
  | ItemType.ClothingState.DURABILITY_LVL_24
  | ItemType.ClothingState.DURABILITY_LVL_25
  | ItemType.ClothingState.DURABILITY_LVL_26
  | ItemType.ClothingState.DURABILITY_LVL_27
  | ItemType.ClothingState.DURABILITY_LVL_28
  | ItemType.ClothingState.DURABILITY_LVL_29
  | ItemType.ClothingState.DURABILITY_LVL_30;
