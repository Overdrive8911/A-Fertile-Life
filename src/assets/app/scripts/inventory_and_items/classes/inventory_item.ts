// import { gInGameItems } from "./declarations/game_item_declarations";
import { gInGameItems } from "../declarations/game_item_declarations";
import { ItemId } from "../declarations/item_enums";
import type {
  ExtraIdDataType,
  AnyItemDynamicData,
  ItemClassMethod,
  GenericItemDynamicData,
} from "../declarations/types_and_interfaces";
import { type InventoryIndex, Inventory } from "./inventory";
import { Item } from "./item";

// Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()`
export class InventoryItem {
  //@ts-ignore
  #itemId: ItemId; // To know what type of item it is
  #idInInventory?: InventoryIndex; // If present, can be used to find the exact position of an item in the inventory
  extraIdData?: ExtraIdDataType; // To identify a particular stored item in the inventory (in cases where there are multiple items with the same id but this particular item should be used), it should always be unique and is optionally set when an object is stored with `storeItem()`.
  locationObtained?: string;
  dynamicData?: AnyItemDynamicData; // In case an object has dynamicData, just put the required data here and read it as necessary

  constructor(initData: Partial<InventoryItem> | Item | null = null) {
    // Overwrite the default values with `initData` if it exists
    if (initData != null) {
      if (initData instanceof Item) {
        // Just grab the id of the item
        this.itemId = initData.itemId;
      } else {
        Object.keys(initData).forEach((pn) => {
          const property = pn as never; // just disable type checking here

          this[property] = clone(initData[property]);
        }, this);
      }
    }
  }

  clone() {
    return new (this.constructor as typeof InventoryItem)(this);
  }

  toJSON() {
    const ownData: { [key: string]: any } = {};

    Object.keys(this).forEach((prop) => {
      ownData[prop] = clone(this[prop as any as keyof InventoryItem]);
    }, this);

    return JSON.reviveWrapper(
      `new ${(this.constructor as typeof InventoryItem).name}($ReviveData$)`,
      ownData
    );
  }

  get itemId() {
    return this.#itemId == undefined ? ItemId.DUMMY : this.#itemId;
  }

  set itemId(val: ItemId) {
    if (val != null || val != undefined) {
      this.#itemId = val;
    }
  }

  get idInInventory(): number | null {
    if (this.#idInInventory == undefined)
      console.error(
        `The inventory item, ${
          this.staticData?.name
        }, with the data, ${JSON.stringify(
          this
        )}, does not have its index in an inventory stored.`
      );

    return this.#idInInventory ?? null;
  }

  // NOTE: Remember to set this when rearranging the positions of items in the `Inventory`
  set idInInventory(val: InventoryIndex | Inventory) {
    if (val instanceof Inventory) {
      // TODO: Add code that will accurately deduce the id
      // val.getItem()
    } else {
      this.#idInInventory = val;
    }
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
      $.isPlainObject(returnedData) &&
      !$.isEmptyObject(returnedData)
    ) {
      this.dynamicData = returnedData;
    }

    return returnedData;
  }
}

(window as any)[InventoryItem.name] = InventoryItem;
