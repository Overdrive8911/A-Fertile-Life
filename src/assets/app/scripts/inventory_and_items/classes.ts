import { gInGameItems } from "./declarations/game_item_declarations";
import {
  ItemColor,
  ItemId,
  ItemProperties,
  ItemTag,
} from "./declarations/item_enums";
import type {
  ExtraIdDataType,
  AnyItemDynamicData,
  ItemClassMethod,
  GenericItemDynamicData,
  ItemCallback,
  ItemConstructorArgs,
} from "./declarations/types_and_interfaces";

// Only the ID and location obtained is needed for static data since the required info can be fetched from `gInGameItems`. A regular `Item` is converted to this in `storeItem()`
export class InventoryItem {
  //@ts-ignore
  #itemId: ItemId; // To know what type of item it is
  #idInInventory?: InventoryIndex; // If present, can be used to find the exact position of an item in the inventory
  extraIdData?: ExtraIdDataType; // To identify a particular stored item in the inventory (in cases where there are multiple items with the same id but this particular item should be used), it should always be unique and is optionally set when an object is stored with `storeItem()`.
  locationObtained?: string; // NOTE - It's actually meant to be a number, so make sure to convert it appropriately when merging. It'll just store the name of the location. If it doesn't exist, the item was gotten from "???"
  // price?: number;
  // weight?: number;
  dynamicData?: AnyItemDynamicData; // In case an object has dynamicData, just put the required data here and read it as necessary

  constructor(initData: Partial<InventoryItem> | Item | null = null) {
    // Overwrite the default values with `initData` if it exists
    if (initData != null) {
      if (initData instanceof Item) {
        // Just grab the id of the item
        this.itemId = initData.itemId;
      } else {
        Object.keys(initData).forEach((pn) => {
          // const property: NotFunc<keyof Inventory1> = pn as keyof Inventory1;
          // const property = pn as NotFunc<keyof Inventory1> & string;
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

type InventoryIndex = number;
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

    return JSON.reviveWrapper(
      `new ${(this.constructor as typeof Inventory).name}($ReviveData$)`,
      ownData
    );
  }
}

export class Item {
  // // ANCHOR - This class accepts 3 arguments; an object which may have any data of the non-method properties of this class, a function to serve as the handler callback of the item to create, or both in an object described by `allData` which is {data: ..., handler: ...}
  #itemId?: ItemId; // Entry in `ItemId`. Also used to get the name of the items
  #name?: string;
  #price?: number; // For the player to obtain it. The selling price is 45% of this value :p
  #weight?: number; // In grams
  #description?: string;
  #imgUrl?: string; // The relative url to its image file in relations to the compiled html file
  #tags?: ItemTag[]; // For sorting items
  #color?: ItemColor; // Just for aesthetics

  // A handler function called when the item is used. Unusable items don't need this. Return data (and parameters) will be an array/iterable/single primitive value and will likely be of the same structure (since the stored data in an inventory item(if any) may be used as arguments). See the getter `callback()`
  customCallBack?: ItemCallback; // NOTE: Add this when initializing a new item and a special "default callback" is required.
  // ANCHOR: The `defaultCallback()` is simply the default function that should be called when an item in the inventory is used. Like wearing / removing clothing, consuming food or drugs, etc.
  protected defaultCallback(...args: Parameters<ItemCallback>) {
    // REVIEW - What should the generic item callback be?
    // TODO - Fix this typescript error
    return 0 as ReturnType<ItemCallback>;
  }

  constructor(data?: ItemConstructorArgs<Item>) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key as keyof Item];

        //@ts-expect-error
        this[key as keyof Item] = clone(element);
      }
    }
  }

  // SECTION - Item Class Getters
  // NOTE - If any of these are meant to have values, just put them in unless they'll default to something else
  get itemId() {
    return this.#itemId || ItemId.DUMMY;
  }
  get name() {
    return this.#name != undefined
      ? this.#name
      : this.itemId != ItemId.DUMMY
      ? (() => {
          const str = ItemId[this.itemId];
          let splitStr = str.replace("_", " ").toLocaleLowerCase().split(" ");
          splitStr = splitStr.map((val) => {
            return val.toLocaleUpperFirst();
          });
          return splitStr.join(" ");
        })()
      : "Dummy";
  }
  // NOTE - Unless the item cannot be bought, put a value here, even zero yes
  get price() {
    return this.#price || ItemProperties.PRICE_CANNOT_BE_BOUGHT;
  }
  get weight() {
    return this.#weight || ItemProperties.WEIGHTLESS;
  }
  get description() {
    return this.#description || "Dummy";
  }
  // NOTE - This can only be omitted if the name of the image to use is the same as the name of the item in the `ItemId` enum, ignoring case sensitivity
  get imgUrl() {
    return (
      this.#imgUrl ||
      `assets/img/items/${ItemId[this.itemId].toLocaleLowerCase()}.webp`
    );
  }
  get tags() {
    return this.#tags || [ItemTag.DUMMY];
  }
  get callback() {
    return this.customCallBack ? this.customCallBack : this.defaultCallback;
  }
  get color() {
    return this.#color ? this.#color : ItemColor.NO_COLOR;
  }
  // !SECTION

  // SECTION - Item Class Setters
  set itemId(val: ItemId) {
    this.#itemId = val;
  }
  set name(val: string) {
    this.#name = val;
  }
  set price(val: number | ItemProperties.PRICE_CANNOT_BE_BOUGHT) {
    if (val >= ItemProperties.PRICE_CANNOT_BE_BOUGHT) {
      this.#price = val;
    }
  }
  set weight(val: number | ItemProperties.WEIGHTLESS) {
    if (val >= ItemProperties.WEIGHTLESS) {
      this.#weight = val;
    }
  }
  set description(val: string) {
    this.#description = val;
  }
  set imgUrl(val: string) {
    this.#imgUrl = val;
  }
  set tags(val: ItemTag[]) {
    if (val[0]) {
      this.#tags = val;
    }
  }
  set color(val: ItemColor) {
    if (val != ItemColor.NO_COLOR) {
      this.#color = val;
    }
  }
  // !SECTION

  // SECTION - Methods
  addTags(...tagsToAdd: ItemTag[]) {
    // Remove any unneeded tags
    tagsToAdd.delete(ItemTag.ALL);

    // Initialize the `tags` array if its still undefined
    this.#tags ??= [];
    this.#tags.pushUnique(...tagsToAdd);
  }

  // Returns an array of the removed tags
  removeTags(...tagsToRemove: ItemTag[]): ItemTag[] {
    if (!this.#tags) return [];
    return this.#tags.delete(...tagsToRemove);
  }
  // !SECTION

  // SECTION - Sugarcube specific methods
  // clone() {
  //   return new (this.constructor as typeof Item)(this);
  // }

  // toJSON() {
  //   const ownData: { [key: string]: any } = {};

  //   Object.keys(this).forEach((prop) => {
  //     ownData[prop] = clone(this[prop as any as keyof Item]);
  //   }, this);

  //   return JSON.reviveWrapper(
  //     `new ${(this.constructor as typeof Item).name}($ReviveData$)`,
  //     ownData
  //   );
  // }
  // !SECTION
}
