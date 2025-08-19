import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { GAME_VARIABLES } from "~/App";
import { either, includesAll } from "~/utils/iterable";
import { type ItemId, ItemTag } from "../item/enums";
import { InventoryItem } from "../item/inventory-item/class";
import type { AnyItemDynamicData, ExtraIdDataType } from "../item/types";
import { ClassId } from "../shared/enums";

type SerializedInventory = {
	items: Map<number, InventoryItem>;
	itemLimit: number;
};

class Inventory
	implements SugarBoxCompatibleClassInstance<SerializedInventory>
{
	protected items: Map<number, InventoryItem> = new Map();

	#itemLimit = 256; // TODO - Don't hardcode the item limit

	constructor() {
		this.items = new Map();
	}

	static classId = ClassId.INVENTORY;

	static fromJSON(data: SerializedInventory): Inventory {
		const clone = new Inventory();

		clone.#itemLimit = data.itemLimit;
		clone.items = data.items;

		return clone;
	}

	// Return true if successful else false
	storeItem(
		itemId: ItemId,
		amount?: number,
		locationObtained?: string,
		extraIdData?: number | string,
		dynamicData?: AnyItemDynamicData,
	) {
		// TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID
		if (!amount) amount = 1;

		const limit = this.#itemLimit;

		const currSize = this.items.size;

		if (currSize === limit) {
			return false;
		} else if (currSize + amount > limit) {
			// Only accept enough to fill the inventory
			// TODO - If this happens, at the end of the function, return an object containing a special code indicating the amount of items that couldn't be stored
			amount = limit - currSize;
		}

		while (amount > 0) {
			// get all the keys in an array
			const inventoryKeys: number[] = [];
			this.items.forEach((v, key) => {
				inventoryKeys.push(key);
			});

			// REVIEW - See whether this can be optimized
			// Create an array with a length to contain 256 items and spread out its keys into the array we'll actually use, i.e [0,1,2,3,...,255] and filter away keys already used in the inventory
			const unusedInventoryKeys = [...Array(limit).keys()].filter((value) => {
				return !inventoryKeys.includes(value);
			});
			const newRandStorageId = either(unusedInventoryKeys) as unknown as number;

			const inventoryItem = new InventoryItem({
				itemId: itemId,
				locationObtained:
					locationObtained !== undefined
						? locationObtained
						: // : GAME_VARIABLES.player.areaId,
							"",
				inventoryId: newRandStorageId,
			});

			if (extraIdData != null) {
				inventoryItem.extraIdData = extraIdData;
			}

			if (dynamicData) {
				inventoryItem.dynamicData = dynamicData;
			}

			this.items.set(newRandStorageId, inventoryItem);

			amount--;
		}
		return true;
	}

	// Returns true if successful else false
	removeItem(itemId: ItemId, amount?: number): boolean;
	removeItem(
		storageId: number,
		amount?: number,
		useUniqueStorageId?: true,
	): boolean;
	removeItem(
		itemOrStorageId: ItemId | number,
		amount?: number,
		useUniqueStorageId = false,
	): boolean {
		if (!amount) amount = 1;

		if (useUniqueStorageId && typeof itemOrStorageId === "number") {
			if (!this.items.has(itemOrStorageId)) return false;

			this.items.delete(itemOrStorageId);
			// There can only be one inventory item with a particular storage id so ignore `amount`
			return true;
		}

		const matchingItemKeys: number[] = [];
		this.items.forEach((value, key) => {
			if (value.itemId === itemOrStorageId) {
				matchingItemKeys.push(key);
			}
		});
		if (matchingItemKeys.length === 0) {
			return false;
		}

		matchingItemKeys.forEach((key) => {
			if (amount && amount > 0) {
				this.items.delete(key);
				amount--;
			}
		});
		return true;
	}

	removeAllMatchingItems(itemId: ItemId) {
		return this.removeItem(itemId, this.#itemLimit);
	}

	// Actually returns the number of items found
	getItemCount(itemId: ItemId) {
		let itemCount = 0;

		this.items.forEach((item) => {
			if (item.itemId === itemId) itemCount++;
		});

		return itemCount;
	}

	get arrOfUniqueItemIds() {
		const arr: ItemId[] = [];

		this.items.forEach((value) => {
			arr.push(value.itemId);
		});

		return [...new Set(arr)];
	}

	get itemLimit() {
		return this.#itemLimit;
	}

	set itemLimit(val: number) {
		const size = this.items.size;

		// Don't allow the inventory's limit to go lower than the amount of items the user currently has
		if (val < size) val = size;

		this.#itemLimit = val;
	}

	get remainingCapacity() {
		return this.#itemLimit - this.items.size;
	}

	// Returns any matched item(s) in the inventory. Returns "null" if no matched item is present. If `extraIdData` is provided, it will try to find a SINGLE item with both the specified id and `extraIdData`. DOES NOT DELETE ANYTHING
	getItem(itemId: ItemId): InventoryItem[] | null;
	getItem(
		itemId: ItemId,
		extraIdData: ExtraIdDataType /* This is solely use to identify an item and nothing more*/,
	): InventoryItem | null;
	getItem(
		inventoryStorageId: number,
		useUniqueInventoryStorageId: true,
	): InventoryItem | null;
	getItem(
		itemOrStorageId: ItemId | number,
		extraIdentificationDataOrUseUniqueStorageId?: true | ExtraIdDataType,
	) {
		if (typeof extraIdentificationDataOrUseUniqueStorageId === "boolean") {
			// ANCHOR: The id used to stored the item in the inventory was passed as well as the `useUniqueStorageId` argument as TRUE
			return this.items.get(itemOrStorageId as ItemId);
		} else {
			//
			const inGameInventoryItemArray: InventoryItem[] = [];
			const itemId = itemOrStorageId as ItemId;

			for (const [, item] of this.items) {
				const loopItemId = item.itemId;

				if (loopItemId === itemId) {
					if (
						extraIdentificationDataOrUseUniqueStorageId &&
						item.extraIdData === extraIdentificationDataOrUseUniqueStorageId
					) {
						inGameInventoryItemArray.push(item);
						break; // Gotten the specific item so break
					}

					inGameInventoryItemArray.push(item);
				}
			}

			return inGameInventoryItemArray.length === 0
				? null
				: inGameInventoryItemArray;
		}
	}

	// Returns an array of every inventory item that matches the given tag, if any. Ignores the `DUMMY` item
	getAllItemsByItemTag(itemTag = new Set([ItemTag.ALL])) {
		let returnedItems = [...this.items.values()];

		if (itemTag) {
			if (!itemTag.has(ItemTag.ALL)) {
				returnedItems = returnedItems.filter((item) => {
					return includesAll(item.itemTags, [...itemTag]);
				});
			}
		}

		return returnedItems;
	}

	toJSON(): SerializedInventory {
		return { itemLimit: this.#itemLimit, items: this.items };
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type InventoryConstructorCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedInventory,
	typeof Inventory
>;

export { Inventory };
