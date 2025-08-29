import { ReactiveMap } from "@solid-primitives/map";
import { signalify } from "classy-solid";
import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import type { UUID } from "~/types/uuid";
import { getRandomUUID } from "~/utils/random";
import { BaseItem, ConsumableItem, EquippableItem } from "../item/class";
import { type ItemColor, type ItemId, ItemTag } from "../item/enums";
import {
	BaseInventoryItem,
	ConsumableInventoryItem,
	EquippableInventoryItem,
} from "../item/inventory-item/class";
import { ClassId } from "../shared/enums";

type SerializedInventory = {
	items: Map<UUID, ReturnType<typeof BaseInventoryItem.prototype.toJSON>>;
	capacity: number;
};

class Inventory
	implements SugarBoxCompatibleClassInstance<SerializedInventory>
{
	private _items: ReactiveMap<UUID, BaseInventoryItem> = new ReactiveMap();

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

		clone._capacity = data.capacity;

		clone._items = new ReactiveMap(
			data.items.entries().map(([inventoryId, serializedItem]) => {
				const { classId } = serializedItem,
					classConstructorToUse =
						classId === ClassId.EQUIPPABLE_INVENTORY_ITEM
							? EquippableInventoryItem
							: classId === ClassId.CONSUMABLE_INVENTORY_ITEM
								? ConsumableInventoryItem
								: BaseInventoryItem;

				//@ts-expect-error
				const item = classConstructorToUse.fromJSON(clone, serializedItem);

				return [inventoryId, item];
			}),
		);

		return clone;
	}

	/**
	 *
	 * @returns an object denoting the number of items that were successfully stored and could not be stored */
	storeItem(
		item: BaseItem,
		originalAmount?: number,
	): { success: number; fail: number };
	storeItem(
		item: BaseInventoryItem,
		originalAmount?: number,
	): { success: number; fail: number };
	storeItem(
		itemId: ItemId,
		originalAmount?: number,
		classType?: typeof BaseInventoryItem,
	): { success: number; fail: number };
	storeItem(
		itemOrItemId: ItemId | BaseItem | BaseInventoryItem,
		/** Amount of items to store */
		originalAmount = 1,
		/** Incase you want to use a child class  */
		classType: typeof BaseInventoryItem = BaseInventoryItem,
	): { success: number; fail: number } {
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

			const inventoryItem =
				itemOrItemId instanceof BaseInventoryItem
					? itemOrItemId
					: itemOrItemId instanceof BaseItem
						? itemOrItemId instanceof ConsumableItem
							? new ConsumableInventoryItem(this, inventoryId, itemOrItemId.id)
							: itemOrItemId instanceof EquippableItem
								? new EquippableInventoryItem(
										this,
										inventoryId,
										itemOrItemId.id,
									)
								: new BaseInventoryItem(this, inventoryId, itemOrItemId.id)
						: new classType(this, inventoryId, itemOrItemId);

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
			| { type: "inventoryId"; inventoryId: UUID },
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
			| { type: "inventoryId"; param: UUID },
	): BaseInventoryItem[] {
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

				return item ? [item] : [];
			}
		}
	}

	private _getItemByItemId(itemId: ItemId): BaseInventoryItem[] {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (item.itemId === itemId) arr.push(item);
		});

		return arr;
	}

	private _getItemByItemColor(color: ItemColor): BaseInventoryItem[] {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (item.data.color === color) arr.push(item);
		});

		return arr;
	}

	private _getItemByItemTag(tag: ItemTag): BaseInventoryItem[] {
		const arr: BaseInventoryItem[] = [];

		this._items.forEach((item) => {
			if (tag === ItemTag.ALL || item.data.tags.has(tag)) {
				arr.push(item);
			}
		});

		return arr;
	}

	private _getItemByInventoryId(inventoryId: UUID): BaseInventoryItem | null {
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

	get usedCapacity() {
		return this._items.size;
	}

	/** Rough gauge on how full the inventory is */
	get usage(): "low" | "medium" | "high" {
		const ratio = this._items.size / this._capacity;

		if (ratio >= 0.75) return "high";

		if (ratio >= 0.35) return "medium";

		return "low";
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
		return {
			capacity: this._capacity,
			items: new Map(
				this._items.entries().map(([id, item]) => [id, item.toJSON()]),
			),
		};
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type InventoryConstructorCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedInventory,
	typeof Inventory
>;

export { Inventory };
