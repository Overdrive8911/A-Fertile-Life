import { ReactiveMap } from "@solid-primitives/map";
import { signalify } from "classy-solid";
import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { getRandomUUID } from "~/utils/random";
import type { ItemColor, ItemId, ItemTag } from "../item/enums";
import {
	BaseInventoryItem,
	ConsumableInventoryItem,
	EquippableInventoryItem,
} from "../item/inventory-item/class";
import { ClassId } from "../shared/enums";

type SerializedInventory = {
	items: Map<string, ReturnType<typeof BaseInventoryItem.prototype.toJSON>>;
	itemLimit: number;
};

class Inventory
	implements SugarBoxCompatibleClassInstance<SerializedInventory>
{
	private _items: ReactiveMap<string, BaseInventoryItem> = new ReactiveMap();

	private _capacity = 256; // TODO - Don't hardcode the item limit

	constructor(...items: ReadonlyArray<BaseInventoryItem>) {
		items.forEach((item) => {
			this.storeItem(item);
		});

		signalify(this);
	}

	static classId = ClassId.INVENTORY;

	static fromJSON(data: SerializedInventory): Inventory {
		const clone = new Inventory();

		clone._capacity = data.itemLimit;

		for (const [inventoryId, serializedItem] of data.items) {
			const { classId } = serializedItem,
				classConstructorToUse =
					classId === ClassId.EQUIPPABLE_INVENTORY_ITEM
						? EquippableInventoryItem
						: classId === ClassId.CONSUMABLE_INVENTORY_ITEM
							? ConsumableInventoryItem
							: BaseInventoryItem;

			//@ts-expect-error
			const item = classConstructorToUse.fromJSON(clone, serializedItem);

			clone._items.set(inventoryId, item);
		}

		return clone;
	}

	// Return an object denoting the number of items that were successfully stored and could not be stored
	storeItem(arg: {
		itemId: ItemId;
		amount?: number;
		/** Incase you want to use a child class  */
		classType?: typeof BaseInventoryItem;
	}): { success: number; fail: number } {
		const {
			amount: originalAmount = 1,
			classType = BaseInventoryItem,
			itemId,
		} = arg;

		// TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID
		const limit = this._capacity;

		const currSize = this._items.size;

		let amount = originalAmount;

		if (currSize === limit) {
			return { fail: amount, success: 0 };
		} else if (currSize + amount > limit) {
			// Only accept enough to fill the inventory
			// TODO - If this happens, at the end of the function, return an object containing a special code indicating the amount of items that couldn't be stored
			amount = limit - currSize;
		}

		for (let i = 0; i < amount; i++) {
			const inventoryId = getRandomUUID();

			const inventoryItem = new classType(this, inventoryId, itemId);

			this._items.set(inventoryId, inventoryItem);
		}

		return { success: amount, fail: originalAmount - amount };
	}

	// Returns true if the item previously existed and deletion was successful else false
	deleteItem(
		arg:
			| {
					type: "itemId";
					itemId: ItemId;
					/** If not specified, all reocurrences of the item are deleted */
					amount?: number;
			  }
			| { type: "inventoryId"; inventoryId: string },
	): boolean {
		if (arg.type === "inventoryId") {
			// Specifically remove an item using its unique inventory id
			return this._items.delete(arg.inventoryId);
		} else {
			// Remove using the item id. If amount is not specified, remove all matching items
			const { itemId, amount = this._capacity } = arg;

			let numDeleted = 0;

			for (const [inventoryId, item] of this._items) {
				if (item.itemId === itemId) {
					this._items.delete(inventoryId);

					numDeleted++;
				}

				if (numDeleted === amount) break;
			}

			return true;
		}
	}

	/** Returns a list of inventory items (if any) that match the parameter, otherwise null
	 *
	 * @param category Can be an ItemId, ItemColor, ItemTag or the special inventory id from the InventoryItem
	 */
	getItem(
		category:
			| { type: "itemId"; param: ItemId }
			| { type: "itemColor"; param: ItemColor }
			| { type: "itemTag"; param: ItemTag }
			| { type: "inventoryId"; param: string },
	): [BaseInventoryItem, ...BaseInventoryItem[]] | null {
		const { param, type } = category;

		switch (type) {
			case "itemId":
				return this._getItemByItemId(param);
			case "itemColor":
				return this._getItemByItemColor(param);
			case "itemTag":
				return this._getItemByItemTag(param);
			case "inventoryId": {
				const item = this._getItemByInventoryId(param);

				return item ? [item] : null;
			}
		}
	}

	private _getItemByItemId(
		itemId: ItemId,
	): [BaseInventoryItem, ...BaseInventoryItem[]] | null {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (item.itemId === itemId) arr.push(item);
		});

		return arr.length
			? (arr as [BaseInventoryItem, ...BaseInventoryItem[]])
			: null;
	}

	private _getItemByItemColor(
		color: ItemColor,
	): [BaseInventoryItem, ...BaseInventoryItem[]] | null {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (item.itemData.color === color) arr.push(item);
		});

		return arr.length
			? (arr as [BaseInventoryItem, ...BaseInventoryItem[]])
			: null;
	}

	private _getItemByItemTag(
		tag: ItemTag,
	): [BaseInventoryItem, ...BaseInventoryItem[]] | null {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (item.itemData.tags.has(tag)) arr.push(item);
		});

		return arr.length
			? (arr as [BaseInventoryItem, ...BaseInventoryItem[]])
			: null;
	}

	private _getItemByInventoryId(inventoryId: string): BaseInventoryItem | null {
		const item = this._items.get(inventoryId);

		return item ?? null;
	}

	/** Utility method that returns a de-duplicated list of al the item ids in the inventory */
	get uniqueItemIds(): Set<ItemId> {
		const arr = new Set<ItemId>();

		this._items.forEach((value) => {
			arr.add(value.itemId);
		});

		return arr;
	}

	get capacity() {
		return this._capacity;
	}

	set capacity(val: number) {
		const size = this._items.size;

		// Don't allow the inventory's limit to go lower than the amount of items the user currently has
		if (val < size) val = size;

		this._capacity = val;
	}

	get remainingCapacity() {
		return this._capacity - this._items.size;
	}

	get equippables(): IteratorObject<EquippableInventoryItem> {
		return this._items
			.values()
			.filter((item) => item instanceof EquippableInventoryItem);
	}

	get consumables(): IteratorObject<ConsumableInventoryItem> {
		return this._items
			.values()
			.filter((item) => item instanceof ConsumableInventoryItem);
	}

	toJSON(): SerializedInventory {
		const serializedItems: Map<
			string,
			ReturnType<typeof BaseInventoryItem.prototype.toJSON>
		> = new Map();

		for (const [inventoryId, item] of this._items) {
			serializedItems.set(inventoryId, item.toJSON());
		}

		return { itemLimit: this._capacity, items: serializedItems };
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type InventoryConstructorCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedInventory,
	typeof Inventory
>;

export { Inventory };
