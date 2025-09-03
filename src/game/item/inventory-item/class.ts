import { createMutable } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import type { GameDateAndTime } from "~/game/date-and-time/class";
import { GAME_VARIABLES } from "~/game/engine/engine";
import type { Inventory } from "~/game/inventory/class";
import { BodyArea, ClassId } from "~/game/shared/enums";
import type { UUID } from "~/types/uuid";
import { areNoFlagsSet } from "~/utils/bitfields";
import { ConsumableItem, EquippableItem } from "../class";
import type { ItemId } from "../enums";
import { gInGameItems } from "../game-items";
import { KeyItem } from "../key-item/class";

// biome-ignore lint/suspicious/noConstEnum: <It'll be inlined>
const enum InventoryItemData {
	MIN_DURABILITY = 0,
}

type InventoryItemClassIds =
	| ClassId.BASE_INVENTORY_ITEM
	| ClassId.EQUIPPABLE_INVENTORY_ITEM
	| ClassId.CONSUMABLE_INVENTORY_ITEM
	| ClassId.CLOTHING_INVENTORY_ITEM;

type SerializedInventoryItem = {
	itemId: ItemId;
	inventoryId: UUID;

	/** This is stored so that I know what class constructor to use to deserialize the data */
	classId: InventoryItemClassIds;

	obtainedOn: GameDateAndTime;
};

/** Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()` */
class BaseInventoryItem
	implements SugarBoxCompatibleClassInstance<SerializedInventoryItem>
{
	/** To know what type of item it is */
	readonly itemId: ItemId;

	/** If present, can be used to find the exact position of an item in the inventory */
	readonly inventory: Inventory;

	/** Index that this instance resides in */
	readonly inventoryId: UUID;

	readonly obtainedOn: GameDateAndTime;

	constructor(
		inventory: Inventory,
		inventoryId: UUID,
		itemId: ItemId,
		obtainedOn: GameDateAndTime,
	) {
		this.itemId = itemId;

		if (!gInGameItems[this.itemId])
			throw new Error(`ItemId "${this.itemId}" does not exist`);

		this.inventory = inventory;

		this.inventoryId = inventoryId;

		this.obtainedOn = obtainedOn;

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	/** For type checking */
	isEquippable(): this is EquippableInventoryItem {
		return this instanceof EquippableInventoryItem;
	}

	/** For type checking */
	isConsumable(): this is ConsumableInventoryItem {
		return this instanceof ConsumableInventoryItem;
	}

	static classId: InventoryItemClassIds = ClassId.BASE_INVENTORY_ITEM;

	/** Add the inventory when deserializing */
	static fromJSON(
		inventory: Inventory,
		data: SerializedInventoryItem,
	): BaseInventoryItem {
		const { inventoryId, itemId, obtainedOn } = data;
		const clone = new BaseInventoryItem(
			inventory,
			inventoryId,
			itemId,
			obtainedOn,
		);

		return clone;
	}

	/** Purposely excluded the inventory to prevent circular references */
	toJSON(): SerializedInventoryItem {
		return {
			inventoryId: this.inventoryId,
			itemId: this.itemId,
			classId: (this.constructor as typeof BaseInventoryItem).classId,
			obtainedOn: this.obtainedOn,
		};
	}

	/** Data from the static Item class */
	get data() {
		// biome-ignore lint/style/noNonNullAssertion: <Deal with this later>
		return gInGameItems[this.itemId]!;
	}

	get isDeletable() {
		// Key items can't be deleted from the player's end so I won't include this check in the delete methods
		if (this.data instanceof KeyItem) return false;

		return true;
	}

	/** Deletes this instance from its inventory */
	delete(inventory = this.inventory) {
		inventory.deleteItem({
			inventoryId: this.inventoryId,
			type: "inventoryId",
		});
	}
}

type SerializedConsumableInventoryItem = SerializedInventoryItem & {};

class ConsumableInventoryItem extends BaseInventoryItem {
	static override classId: InventoryItemClassIds =
		ClassId.CONSUMABLE_INVENTORY_ITEM;

	/** Applies the effects of the item and deletes itself from the inventory */
	use(): void {
		this.data.use();

		this.delete();
	}

	isUsable(): boolean {
		const expiresIn = this.data.expiresIn;

		if (expiresIn === 0) return true;

		return (
			GAME_VARIABLES.gameDateAndTime.date.getDate() -
				this.obtainedOn.date.getDate() <
			expiresIn
		);
	}

	override toJSON(): SerializedConsumableInventoryItem {
		return super.toJSON();
	}

	static override fromJSON(
		inventory: Inventory,
		data: SerializedConsumableInventoryItem,
	): ConsumableInventoryItem {
		const { inventoryId, itemId, obtainedOn } = data;

		const clone = new ConsumableInventoryItem(
			inventory,
			inventoryId,
			itemId,
			obtainedOn,
		);

		return clone;
	}

	override get data() {
		if (!(super.data instanceof ConsumableItem))
			throw new Error(`ItemId "${this.itemId}" is not a consumable item`);

		return super.data;
	}
}

type SerializedEquippableInventoryItem = SerializedInventoryItem & {
	equipped: boolean;
	durability: number;
};

class EquippableInventoryItem extends BaseInventoryItem {
	private _equipped: boolean;

	private _durability;

	static override classId: InventoryItemClassIds =
		ClassId.EQUIPPABLE_INVENTORY_ITEM;

	constructor(
		...args: [
			...ConstructorParameters<typeof BaseInventoryItem>,
			durability?: number,
			equipped?: boolean,
		]
	) {
		const [
			inventory,
			inventoryId,
			itemId,
			gameDateAndTime,
			durability,
			equipped,
		] = args;

		super(inventory, inventoryId, itemId, gameDateAndTime);

		this._durability = durability ?? this.data.maxDurability;

		this._equipped = equipped ?? false;

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	get equipped() {
		return this._equipped;
	}

	get durability() {
		return this._durability;
	}

	set durability(value: number) {
		if (value <= InventoryItemData.MIN_DURABILITY) {
			// Durability has been used up, so delete the item from inventory

			this.inventory.deleteItem({
				inventoryId: this.inventoryId,
				type: "inventoryId",
			});

			return;
		}

		if (value > this.data.maxDurability) {
			value = this.data.maxDurability;
		}

		this._durability = value;
	}

	/** Returns a ratio of the item's durability in comparison to it's max durability as a float between 0 and 1 inclusively */
	get durabilityRatio() {
		return this._durability / this.data.maxDurability;
	}

	override toJSON(): SerializedEquippableInventoryItem {
		const { durability, equipped } = this;

		return {
			...super.toJSON(),
			durability,
			equipped,
		};
	}

	static override fromJSON(
		inventory: Inventory,
		data: SerializedEquippableInventoryItem,
	): EquippableInventoryItem {
		const { inventoryId, itemId, obtainedOn, durability, equipped } = data;
		const clone = new EquippableInventoryItem(
			inventory,
			inventoryId,
			itemId,
			obtainedOn,
			durability,
			equipped,
		);

		return clone;
	}

	override get data() {
		if (!(super.data instanceof EquippableItem))
			throw new Error(`ItemId "${this.itemId}" is not an equippable item`);

		return super.data;
	}

	/** Item is too damaged to be used at < 20% durability */
	private get _isDurableEnoughToEquip() {
		return this.durability / this.data.maxDurability > 0.2;
	}

	/** Returns true if the body area the item will cover is free, otherwise false */
	get canEquip(): boolean {
		if (!this._isDurableEnoughToEquip) return false;

		const itemData = this.data;

		const allEquippedItems = this.inventory.equippedItems;

		const getOccupiedBodyArea = (type: EquippableItem["type"]) =>
			allEquippedItems.reduce((acc, data) => {
				if (data.data.type === type) {
					acc |= data.data.bodyArea;
				}

				return acc;
			}, BodyArea.NONE);

		switch (itemData.type) {
			// Only concern ourselves with innerwear
			case "inner": {
				const occupiedInnerBodyArea = getOccupiedBodyArea("inner");

				// Perform the comparison after removing the innerwear bitfield so it doesn't interfere
				const canEquip = areNoFlagsSet(
					itemData.bodyArea & ~BodyArea.INNER,
					occupiedInnerBodyArea & ~BodyArea.INNER,
				);

				return canEquip;
			}

			// Only concern ourselves with outerwear
			case "outer": {
				const occupiedOuterBodyArea = getOccupiedBodyArea("outer");

				const canEquip = areNoFlagsSet(
					itemData.bodyArea,
					occupiedOuterBodyArea,
				);

				return canEquip;
			}

			case "tattoo": {
				const occupiedTattooBodyArea = getOccupiedBodyArea("tattoo");

				// Perform the comparison after removing the innerwear bitfield so it doesn't interfere
				const canEquip = areNoFlagsSet(
					itemData.bodyArea & ~BodyArea.TATTOO,
					occupiedTattooBodyArea & ~BodyArea.TATTOO,
				);

				return canEquip;
			}

			default:
				return true;
		}
	}

	private get _conflictingItems() {
		return this.inventory.equippedItems.filter((equippedItem) =>
			equippedItem.data.covers(this.data.bodyArea),
		);
	}

	/** Search for equipped items taking the area and unequip them. If any unequipping fails, reverse what has been done
	 *
	 * @returns `true` if conflicting were succesfully unequipped, and `false` otherwise
	 */
	private _unequipConflictingItems(): boolean {
		const unequippedItems: EquippableInventoryItem[] = [];

		for (const item of this._conflictingItems) {
			if (!item.unequip()) {
				unequippedItems.forEach((item) => {
					item._equipped = true;
				});

				return false;
			}

			unequippedItems.push(item);
		}

		return true;
	}

	/**
	 * Tries to equip the item
	 *
	 * @param force - if true, forcefully unequips conflicting items; if false, fails when area isn't free
	 * @returns true if item ends up equipped (regardless of initial state), false if equipping failed
	 *
	 * @example
	 * // Basic equip attempt
	 * const success = item.equip(); // fails if area occupied
	 *
	 * // Force equip, unequipping conflicts
	 * const success = item.equip(true); // unequips conflicting items
	 */
	equip(force = false): boolean {
		// Item is already equipped
		if (this.equipped) return true;

		if (!this._isDurableEnoughToEquip) return false;

		if (this.canEquip) {
			this._equipped = true;

			return true;
		} else if (force) {
			if (!this._unequipConflictingItems()) return false;

			this._equipped = true;

			return true;
		} else {
			return false;
		}
	}

	/** Try to unequip the item. Returns true if the item is unequipped at the end (regardless of it it was unequipped before hand), and false otherwise. (Although, I'm not yet sure if it'd ever return false) */
	unequip(): boolean {
		this._equipped = false;

		return true;
	}
}

export { BaseInventoryItem, ConsumableInventoryItem, EquippableInventoryItem };
