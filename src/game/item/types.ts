/** biome-ignore-all lint/complexity/noBannedTypes: <For generics> */

import type { PlayerV0_0_1 } from "../types/story-variables/player";
import type { Item } from "./class";
import type { Clothing } from "./clothing/class";
import type { ClothingDynamicData } from "./clothing/types";
import type { Drug } from "./drug/class";
import type { ItemTag } from "./enums";
import type { Food } from "./food/class";
import type { FoodDynamicData } from "./food/types";

// NOTE - All item specific data should extend from this
type GenericItemDynamicData = {
	/**
	 * All items may have a reference to the user holding them
	 */
	user?: PlayerV0_0_1;
};

type ItemCallback = (
	// inventoryObject: Inventory,
	// storageIdInInventory: number,
	data?: AnyItemDynamicData,
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

type ItemClassMethod = Extract<AnyItemClass[keyof AnyItemClass], Function>;

type BaseItemConstructorArgs<T extends Item> = Partial<{
	[K in keyof T]: T[K] extends Function
		? K extends "customCallBack" // Ensure that the name used here matches up with the one in the `Item` class
			? T[K]
			: never
		: T[K];
}>;

type ItemConstructorArgs<TItemClass extends Item> = Omit<
	BaseItemConstructorArgs<TItemClass>,
	"tags"
> & { tags?: ItemTag[] };

type SortingId = number; // Used in sorting the items. no two items can have the same SortingId
type ExtraIdDataType = number | string;

// !SECTION

// NOTE: Add all item data types here
type AnyItemDynamicData =
	| FoodDynamicData
	| ClothingDynamicData
	| GenericItemDynamicData;

export type {
	AnyItemClass,
	AnyItemDynamicData,
	ExtraIdDataType,
	GenericItemDynamicData,
	ItemCallback,
	ItemConstructorArgs,
	ItemClassMethod,
	SortingId,
};
