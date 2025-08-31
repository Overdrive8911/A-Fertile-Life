import { signalify } from "classy-solid";
import { unwrap } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { GAME_VARIABLES } from "~/App";
import type { GameDateAndTime } from "~/game/date-and-time/class";
import type { Inventory } from "~/game/inventory/class";
import { BodyArea, ClassId } from "~/game/shared/enums";
import type { UUID } from "~/types/uuid";
import { areNoFlagsSet } from "~/utils/bitfields";
import { ConsumableItem, EquippableItem } from "../class";
import type { ItemId } from "../enums";
import { gInGameItems } from "../game-items";

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

		signalify(this);
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
	isEquipped: boolean;
	durability: number;
};

class EquippableInventoryItem extends BaseInventoryItem {
	private _isEquipped;

	private _durability;

	static override classId: InventoryItemClassIds =
		ClassId.EQUIPPABLE_INVENTORY_ITEM;

	constructor(
		...args: [
			...ConstructorParameters<typeof BaseInventoryItem>,
			durability?: number,
			isEquipped?: boolean,
		]
	) {
		const [inventory, inventoryId, itemId, gameDateAndTime, durability] = args;

		super(inventory, inventoryId, itemId, gameDateAndTime);

		this._durability = durability ?? this.data.maxDurability;

		this._isEquipped = this.isEquipped ?? false;

		signalify(this);
	}

	get isEquipped() {
		return this._isEquipped;
	}

	set isEquipped(value: boolean) {
		if (value === this._isEquipped) return; // No change

		if (value) {
			// Equipping the item
			if (!this.canEquip) {
				throw new Error(
					`Cannot equip itemId "${this.itemId}". Another item is likely equipped in the same area.`,
				);
			}
		}

		this._isEquipped = value;
	}

	get durability() {
		return this._durability;
	}

	set durability(value: number) {
		if (value <= 0) {
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
		const { durability, isEquipped } = this;

		return {
			...super.toJSON(),
			durability,
			isEquipped,
		};
	}

	static override fromJSON(
		inventory: Inventory,
		data: SerializedEquippableInventoryItem,
	): EquippableInventoryItem {
		const { inventoryId, itemId, obtainedOn, durability, isEquipped } = data;
		const clone = new EquippableInventoryItem(
			inventory,
			inventoryId,
			itemId,
			obtainedOn,
			durability,
			isEquipped,
		);

		return clone;
	}

	override get data() {
		if (!(super.data instanceof EquippableItem))
			throw new Error(`ItemId "${this.itemId}" is not an equippable item`);

		return super.data;
	}

	get canEquip(): boolean {
		const itemData = this.data;

		const allEquippedItems = this.inventory.equippables.filter(
			(equippable) => equippable._isEquipped,
		);

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

	/** Trys to equip the item. Returns true if succesful, and false otherwise */
	equip(): boolean {
		return true;
	}
}

export { BaseInventoryItem, ConsumableInventoryItem, EquippableInventoryItem };
