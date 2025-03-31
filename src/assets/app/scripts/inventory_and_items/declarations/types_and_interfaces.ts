import type { Player } from "../../declarations/player_declarations";
import type { Item } from "../classes/item";
import type { Clothing } from "../classes/item_extends/clothing";
import type { Drug } from "../classes/item_extends/drug";
import type { Food } from "../classes/item_extends/food";
import type { ClothingState } from "../classes/item_extends/clothing";

// NOTE - All item specific data should extend from this
export interface GenericItemDynamicData {
  /**
   * All items may have a reference to the user holding them
   */
  user?: Player;
}
export type ItemCallback = (
  // inventoryObject: Inventory,
  // storageIdInInventory: number,
  data?: AnyItemDynamicData
) => typeof data extends AnyItemDynamicData ? typeof data : unknown;
// type a<T extends Item, U extends typeof Item> = T & (typeof T)
// NOTE - Add all new item classes here for type safety
type AnyItemClass = Item &
  typeof Item &
  Clothing &
  typeof Clothing &
  Drug &
  typeof Drug &
  Food &
  typeof Food;
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
//   | keyof Food
//   | keyof Clothing
//   | keyof Drug,
//   Item["defaultCallback"]
// >;
// export type UseItemClassMethodFn<Class extends (Item | Food| Clothing| Drug) > = (MethodToUse?: keyof Class) => void | ItemDynamicData

export type SortingId = number; // Used in sorting the items. no two items can have the same SortingId
export type ExtraIdDataType = number | string;

// SECTION - Extensions of `GenericItemDynamicData`
export interface FoodDynamicData extends GenericItemDynamicData {
  timeSinceObtained: number; // In seconds
}
export interface ClothingDynamicData extends GenericItemDynamicData {
  clothingState: ClothingState;
}

// !SECTION

// NOTE: Add all item data types here
export type AnyItemDynamicData =
  | FoodDynamicData
  | ClothingDynamicData
  | GenericItemDynamicData;

export type AllClothingDurabilityPoints =
  | ClothingState.DURABILITY_LVL_1
  | ClothingState.DURABILITY_LVL_2
  | ClothingState.DURABILITY_LVL_3
  | ClothingState.DURABILITY_LVL_4
  | ClothingState.DURABILITY_LVL_5
  | ClothingState.DURABILITY_LVL_6
  | ClothingState.DURABILITY_LVL_7
  | ClothingState.DURABILITY_LVL_8
  | ClothingState.DURABILITY_LVL_9
  | ClothingState.DURABILITY_LVL_10
  | ClothingState.DURABILITY_LVL_11
  | ClothingState.DURABILITY_LVL_12
  | ClothingState.DURABILITY_LVL_13
  | ClothingState.DURABILITY_LVL_14
  | ClothingState.DURABILITY_LVL_15
  | ClothingState.DURABILITY_LVL_16
  | ClothingState.DURABILITY_LVL_17
  | ClothingState.DURABILITY_LVL_18
  | ClothingState.DURABILITY_LVL_19
  | ClothingState.DURABILITY_LVL_20
  | ClothingState.DURABILITY_LVL_21
  | ClothingState.DURABILITY_LVL_22
  | ClothingState.DURABILITY_LVL_23
  | ClothingState.DURABILITY_LVL_24
  | ClothingState.DURABILITY_LVL_25
  | ClothingState.DURABILITY_LVL_26
  | ClothingState.DURABILITY_LVL_27
  | ClothingState.DURABILITY_LVL_28
  | ClothingState.DURABILITY_LVL_29
  | ClothingState.DURABILITY_LVL_30;
