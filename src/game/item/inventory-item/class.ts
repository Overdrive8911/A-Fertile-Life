// import { gInGameItems } from "./declarations/game_item_declarations";

import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { ClassId } from "~/game/shared/enums";
import { isEmptyObject } from "~/utils/object";
import type { Item } from "../class";
import { ItemId } from "../enums";
import { gInGameItems } from "../game-items";
import type {
	AnyItemDynamicData,
	ExtraIdDataType,
	GenericItemDynamicData,
	ItemClassMethod,
} from "../types";

/** Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()` */
class InventoryItem
	implements SugarBoxCompatibleClassInstance<SerializedInventoryItem>
{
	/** To know what type of item it is */
	readonly itemId: ItemId = ItemId.DUMMY;

	/** If present, can be used to find the exact position of an item in the inventory */
	inventoryId: number | null = null;

	/** To identify a particular stored item in the inventory (in cases where there are multiple items with the same id but this particular item should be used), it should always be unique and is optionally set when an object is stored with `storeItem()` */
	extraIdData?: ExtraIdDataType;

	/** */
	locationObtained?: string;

	/** In case an object has dynamicData, just put the required data here and read it as necessary */
	dynamicData?: AnyItemDynamicData;

	constructor(initData?: SerializedInventoryItem) {
		if (initData) Object.assign(this, initData);
	}

	static classId = ClassId.INVENTORY_ITEM;

	static fromJSON(data: SerializedInventoryItem): InventoryItem {
		const clone = new InventoryItem();

		Object.assign(clone, data);

		return clone;
	}

	toJSON(): SerializedInventoryItem {
		return { ...this };
	}

	get itemTags() {
		return this.staticData.tags;
	}

	get staticData() {
		return gInGameItems[this.itemId] ?? (gInGameItems[ItemId.DUMMY] as Item);
	}

	get usable() {
		return this.staticData.usable;
	}

	// By default, it calls the callback/handler of the appropriate item. However, it can also call any method of any item it represents if the appropriate method is passed as an argument. If `classMethodArgs` is passed, they will be used as the arguments for `classMethod`
	// NOTE - Pass null to any method arguments that are extended from `ItemDynamicData` if you prefer having the data of the item used
	use<method extends ItemClassMethod>(
		classMethodInAnyTypeOfItem?: method,
		...classMethodArgs: Parameters<method>
	) {
		const callback = this.staticData.callback;
		const argData = this.dynamicData ?? ({} as GenericItemDynamicData);
		let returnedData: AnyItemDynamicData | unknown;

		if (classMethodInAnyTypeOfItem) {
			const extraArgs = classMethodArgs;

			//@ts-expect-error
			// Apparently, the typescript version I'm using, v5.5.2, doesn't allow spreading the parameters of generic functions. Or maybe that's not the case? Anyway, this code isn't wrong
			returnedData = classMethodInAnyTypeOfItem(...extraArgs) || {};
		} else {
			// Default to calling the callback while passing the dynamic data as the only argument, then store the returned data
			returnedData = callback(argData);
		}

		// If the returned value is just an empty object, {}, there's no use of storing it.
		if (
			returnedData &&
			typeof returnedData === "object" &&
			!isEmptyObject(returnedData)
		) {
			this.dynamicData = returnedData;
		}

		return returnedData;
	}
}

type SerializedInventoryItem = {
	itemId: ItemId;
	inventoryId: number | null;
	extraIdData?: ExtraIdDataType;
	locationObtained?: string;
	dynamicData?: AnyItemDynamicData;
};

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type InventoryItemClassCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedInventoryItem,
	typeof InventoryItem
>;

export { InventoryItem };
