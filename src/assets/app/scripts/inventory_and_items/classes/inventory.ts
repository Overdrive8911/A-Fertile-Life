import { attachClassToWindow } from "../../declarations/general_declarations";
import { ItemId, ItemTag } from "../declarations/item_enums";
import type {
  AnyItemDynamicData,
  ExtraIdDataType,
} from "../declarations/types_and_interfaces";
import { InventoryItem } from "./inventory_item";

export type InventoryIndex = number;
export class Inventory {
  // protected readonly _construct = this.constructor as typeof Inventory1; // Typescript woes
  protected items: Map<InventoryIndex, InventoryItem>; // TODO: convert this "number" type to "InventoryIndex"
  #itemLimit = 256; // TODO - Don't hardcode te item limit

  constructor(classProperties: Inventory | null = null) {
    this.items = new Map();

    // Overwrite the default values with `classProperties` if it exists
    if (classProperties != null) {
      Object.keys(classProperties).forEach((pn) => {
        // const property: NotFunc<keyof Inventory1> = pn as keyof Inventory1;
        // const property = pn as NotFunc<keyof Inventory1> & string;
        const property = pn as never; // just disable type checking here

        this[property] = clone(classProperties[property]);
      }, this);
    }
  }

  static tryConvertStringItemId(
    itemId: ItemId | string,
    consoleErrorTextForInvalidItemId?: string
  ): ItemId | undefined {
    if (typeof itemId == "string") {
      // convert `itemId` to an actual id, if possible
      const tempItemId: ItemId | undefined = this.getItemIdFromStringId(itemId);

      if (tempItemId == undefined || tempItemId == null) {
        console.error(consoleErrorTextForInvalidItemId);
      }

      itemId = tempItemId ?? ItemId.DUMMY;
    }
    return itemId;
  }

  // Return true if successful else false
  storeItem(
    itemId: ItemId | string,
    amount?: number,
    locationObtained?: string,
    extraIdData?: number | string,
    dynamicData?: AnyItemDynamicData
  ) {
    // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID

    itemId =
      (this.constructor as typeof Inventory).tryConvertStringItemId(
        itemId,
        `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
      ) ?? ItemId.DUMMY;
    if (itemId == undefined) return false;

    if (!amount) amount = 1;

    const limit = this.#itemLimit;
    const currSize = this.items.size;
    if (currSize == limit) {
      return false;
    } else if (currSize + amount > limit) {
      // Only accept enough to fill the inventory
      // TODO - If this happens, at the end of the function, return an object containing a special code indicating the amount of items that couldn't be stored
      amount = limit - currSize;
    }

    while (amount > 0) {
      // get all the keys in an array
      let inventoryKeys: number[] = [];
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
          locationObtained != undefined
            ? locationObtained
            : variables().player.areaId,
        idInInventory: newRandStorageId,
      });

      if (extraIdData != undefined && extraIdData != null) {
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
  removeItem(itemId: ItemId | string, amount?: number): boolean;
  removeItem(
    storageId: number,
    amount?: number,
    useUniqueStorageId?: true
  ): boolean;
  removeItem(
    itemOrStorageId: ItemId | string | number,
    amount?: number,
    useUniqueStorageId = false
  ): boolean {
    //@ts-ignore
    itemOrStorageId = (
      this.constructor as typeof Inventory
    ).tryConvertStringItemId(
      itemOrStorageId,
      `The string data representing an item's id, ${itemOrStorageId}, is invalid. No item was stored.`
    );
    if (itemOrStorageId == undefined) return false;

    if (!amount) amount = 1;

    if (useUniqueStorageId && typeof itemOrStorageId == "number") {
      if (!this.items.has(itemOrStorageId)) return false;

      this.items.delete(itemOrStorageId);
      // There can only be one inventory item with a particular storage id so ignore `amount`
      return true;
    }

    let matchingItemKeys: number[] = [];
    this.items.forEach((value, key) => {
      if (value.itemId == itemOrStorageId) {
        matchingItemKeys.push(key);
      }
    });
    if (matchingItemKeys.length == 0) {
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

  removeAllMatchingItems(itemId: ItemId | string) {
    return this.removeItem(itemId, this.#itemLimit);
  }

  // Actually returns the number of items found
  getItemCount(itemId: ItemId | string) {
    //@ts-ignore
    itemId = (this.constructor as typeof Inventory).tryConvertStringItemId(
      itemId,
      `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
    );
    if (itemId == undefined) return false;

    let itemCount = 0;
    this.items.forEach((item) => {
      if (item.itemId == itemId) itemCount++;
    });

    return itemCount;
  }

  get arrOfUniqueItemIds() {
    let arr: ItemId[] = [];

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
    itemId: ItemId | string,
    extraIdData: ExtraIdDataType /* This is solely use to identify an item and nothing more*/
  ): InventoryItem | null;
  getItem(
    inventoryStorageId: InventoryIndex,
    useUniqueInventoryStorageId: true
  ): InventoryItem | null;
  getItem(
    itemOrStorageId: ItemId | string | InventoryIndex,
    extraIdentificationDataOrUseUniqueStorageId?: true | ExtraIdDataType
  ) {
    //@ts-ignore
    itemOrStorageId = (
      this.constructor as typeof Inventory
    ).tryConvertStringItemId(
      itemOrStorageId,
      `The string data representing an item's id, ${itemOrStorageId}, is invalid. No item was retrieved.`
    );

    if (itemOrStorageId == undefined) return false;

    if (typeof extraIdentificationDataOrUseUniqueStorageId == "boolean") {
      // ANCHOR: The id used to stored the item in the inventory was passed as well as the `useUniqueStorageId` argument as TRUE
      return this.items.get(itemOrStorageId as ItemId);
    } else {
      //
      let inGameInventoryItemArray: InventoryItem[] = [];
      const itemId = itemOrStorageId as ItemId;

      for (const [, item] of this.items) {
        const loopItemId = item.itemId;

        if (loopItemId == itemId) {
          if (
            extraIdentificationDataOrUseUniqueStorageId &&
            item.extraIdData == extraIdentificationDataOrUseUniqueStorageId
          ) {
            inGameInventoryItemArray.push(item);
            break; // Gotten the specific item so break
          }

          inGameInventoryItemArray.push(item);
        }
      }

      return inGameInventoryItemArray.length == 0
        ? null
        : inGameInventoryItemArray;
    }
  }

  // Returns an array of every inventory item that matches the given tag, if any. Ignores the `DUMMY` item
  getAllItemsByItemTag(itemTag = [ItemTag.ALL]) {
    let returnedItems = [...this.items.values()];

    if (itemTag) {
      if (!itemTag.includes(ItemTag.ALL)) {
        returnedItems = returnedItems.filter((item) => {
          return item.itemTags.includesAll(itemTag);
        });
      }
    }

    return returnedItems;
  }

  static getItemIdFromStringId(itemIdString: string) {
    let actualItemId = ItemId[
      itemIdString.toLocaleUpperCase() as any
    ] as unknown as ItemId;
    // if (actualItemId == undefined) {
    //   // Invalid id, use the dummy id instead
    //   actualItemId = ItemId.DUMMY;
    // }

    return actualItemId as ItemId | undefined;

    // const itemIdStrings = Object.values(ItemId).filter((value) => {
    //   return typeof value == "string";
    // }) as string[];

    // const itemId = itemIdStrings.findIndex((value) => {
    //   return itemIdString == value;
    // });

    // if (itemId > ItemId.DUMMY) return itemId;

    // return ItemId.DUMMY;
  }

  clone() {
    return new (this.constructor as typeof Inventory)(this);
  }

  toJSON() {
    const ownData: { [key: string]: any } = {};

    Object.keys(this).forEach((prop) => {
      ownData[prop] = clone(this[prop as any as keyof Inventory]);
    }, this);

    return Serial.createReviver(
      `new ${(this.constructor as typeof Inventory).name}($ReviveData$)`,
      ownData
    );
  }
}

attachClassToWindow(Inventory);
