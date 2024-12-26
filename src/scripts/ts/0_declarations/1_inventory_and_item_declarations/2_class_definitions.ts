namespace NSInventoryAndItem {
  export class Inventory {
    // protected readonly _construct = this.constructor as typeof Inventory1; // Typescript woes
    protected items: Map<number, InventoryItem>;
    #itemLimit = 256; // TODO - Don't hardcode te item limit

    constructor(classProperties: Inventory = null) {
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
        const tempItemId: ItemId | undefined =
          this.getItemIdFromStringId(itemId);

        if (tempItemId == undefined || tempItemId == null) {
          console.error(consoleErrorTextForInvalidItemId);
        }

        itemId = tempItemId;
      }
      return itemId;
    }

    // Return true if successful else false
    storeItem(
      itemId: ItemId | string,
      amount?: number,
      locationObtained?: string,
      extraIdData?: number | string,
      dynamicData?: ItemDynamicData
    ) {
      // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID

      itemId = (this.constructor as typeof Inventory).tryConvertStringItemId(
        itemId,
        `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
      );
      if (itemId == undefined) return false;

      if (!(this.constructor as typeof Inventory).validateItemId(itemId))
        return false;

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

        // Create an array with a length to contain 256 items and spread out its keys into the array we'll actually use, i.e [0,1,2,3,...,255] and filter away keys already used in the inventory
        const unusedInventoryKeys = [...Array(limit).keys()].filter((value) => {
          return !inventoryKeys.includes(value);
        });
        const newRandStorageId = either(
          unusedInventoryKeys
        ) as unknown as number;

        const inventoryItem: InventoryItem = {
          itemId: itemId,
          locationObtained:
            locationObtained != undefined
              ? locationObtained
              : variables().player.locationData.location,
        };
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
    removeItem(
      itemOrStorageId: ItemId | string | number,
      amount?: number,
      useUniqueStorageId = false
    ) {
      itemOrStorageId = (
        this.constructor as typeof Inventory
      ).tryConvertStringItemId(
        itemOrStorageId,
        `The string data representing an item's id, ${itemOrStorageId}, is invalid. No item was stored.`
      );
      if (itemOrStorageId == undefined) return false;

      if (!amount) amount = 1;

      if (useUniqueStorageId) {
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
        if (amount > 0) {
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

    // Returns the first item in the inventory the id matches. Returns false if no item is present. If `extraIdData` is provided, it will try to find a item with both the specified id and `extraIdData`. DOES NOT DELETE ANYTHING
    getItem(
      itemOrStorageId: ItemId | string | number,
      useUniqueStorageId = false,
      extraIdData: number | string
    ) {
      itemOrStorageId = (
        this.constructor as typeof Inventory
      ).tryConvertStringItemId(
        itemOrStorageId,
        `The string data representing an item's id, ${itemOrStorageId}, is invalid. No item was retrieved.`
      );
      if (itemOrStorageId == undefined) return false;

      if (useUniqueStorageId) {
        // return gInGameItems[this.items.get(itemOrStorageId).itemId];
        return this.items.get(itemOrStorageId);
      }

      let inGameInventoryItem: InventoryItem | false = false;

      for (const [, item] of this.items) {
        const id = item.itemId;
        if (id == itemOrStorageId) {
          if (extraIdData && item.extraIdData == extraIdData) {
            inGameInventoryItem = item;
            break; // Gotten the specific item so break
          }

          inGameInventoryItem = item;
          // TODO - Handle dynamic data
        }
      }

      return inGameInventoryItem;
    }

    // Runs the handler of an inventory item (if any) and stores any returned data in the actual inventory item. Using the storageId is normally preferred
    useItem(
      inventoryItemOrStorageId: InventoryItem | number,
      ...functionArgs: unknown[]
    ) {
      let item: InventoryItem;
      let itemFunc: Function;
      if (
        typeof inventoryItemOrStorageId == "number" &&
        this.items.has(inventoryItemOrStorageId)
      ) {
        item = this.items.get(inventoryItemOrStorageId);
        itemFunc = gInGameItems[item.itemId].callback;
      } else if (typeof inventoryItemOrStorageId == "object") {
        item = inventoryItemOrStorageId;
        itemFunc = gInGameItems[inventoryItemOrStorageId.itemId].callback;
      }

      if (itemFunc) {
        const returnedData: unknown = functionArgs
          ? itemFunc(...functionArgs)
          : itemFunc();

        if (returnedData) {
          item.dynamicData = clone(returnedData);
        }

        return true;
      }

      return false;
    }

    useItemWithDynamicData(inventoryItemOrStorageId: InventoryItem | number) {
      const type = typeof inventoryItemOrStorageId == "object";

      if (!type && !this.items.has(inventoryItemOrStorageId)) return false;

      this.useItem(
        inventoryItemOrStorageId,
        type
          ? inventoryItemOrStorageId.dynamicData
          : this.items.get(inventoryItemOrStorageId).dynamicData
      );
    }

    // Returns static data from `Item` as well as dynamic data in the form of handlers on `InventoryItem` itself
    // REVIEW - Properly deal with cases where there are multiple items with different handler properties
    static getItemStaticData(itemId: ItemId | string) {
      itemId = this.tryConvertStringItemId(
        itemId,
        `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
      );
      if (itemId == undefined) return false;

      return gInGameItems[itemId];
    }

    // REVIEW - This might not fit here. Also, add a check to only work on items in the inventory
    static doesItemHaveTag(itemId: ItemId | string, tag: ItemTag) {
      itemId = this.tryConvertStringItemId(
        itemId,
        `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
      );
      if (itemId == undefined) return false;

      const itemTags = (this.getItemStaticData(itemId) as Item).tags;

      if (
        itemTags.find((value) => {
          return value == tag;
        })
      ) {
        return true;
      }

      return false;
    }

    static validateItemId(itemId: ItemId) {
      if (!gInGameItems[itemId]) return false;

      return true;
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
  // @ts-expect-error
  window[`${Inventory.name}`] = Inventory; // Attach the class to the window object to ensure that sugarcube always finds it

  // @ts-expect-error
  window.test = new Inventory();
  // @ts-expect-error
  window.test2 = Inventory;
  // @ts-expect-error
  window.testFunc = () => {
    // @ts-expect-error
    const lim = test.getItemLimit;
    for (let i = 0; i < lim; i++) {
      // @ts-expect-error
      window.test.storeItem(i);
    }
  };

  // type GenericItemCallback = (...args: unknown[]) => any;
  export class Item {
    // // ANCHOR - This class accepts 3 arguments; an object which may have any data of the non-method properties of this class, a function to serve as the handler callback of the item to create, or both in an object described by `allData` which is {data: ..., handler: ...}
    #itemId?: ItemId; // Entry in `ItemId`. Also used to get the name of the items
    #name?: string;
    #price?: number; // For the player to obtain it. The selling price is 45% of this value :p
    #weight?: number; // In grams
    #description?: string;
    #imgUrl?: string; // The relative url to its image file in relations to the compiled html file
    #tags?: ItemTag[]; // For sorting items

    // A handler function called when the item is used. Unusable items don't need this. Return data (and parameters) will be an array/iterable/single primitive value and will likely be of the same structure (since the stored data in an inventory item(if any) may be used as arguments). See the getter `callback()`
    customCallBack?: Function;
    defaultCallback() {
      // REVIEW - What should the generic item callback be?
      return 0 as unknown;
    }

    constructor(data?: Partial<Item>) {
      for (const key in data as Item) {
        if (Object.prototype.hasOwnProperty.call(data as Item, key)) {
          const element = (data as Item)[key as keyof Item];

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
}
