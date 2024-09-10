namespace NSInventoryAndItem {
  // type NotFunc<T> = Exclude<T, Function>;
  export class Inventory1 {
    // protected readonly _construct = this.constructor as typeof Inventory1; // Typescript woes
    protected items: Map<number, InventoryItem>;
    #itemLimit = 256;

    constructor(classProperties: Inventory1 = null) {
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
      locationObtained?: NSLocation.MapLocation
    ) {
      // TODO - Using the ids, decide if this item has any dynamic data and handle it properly else just copy over the ID

      itemId = (this.constructor as typeof Inventory1).tryConvertStringItemId(
        itemId,
        `The string data representing an item's id, ${itemId}, is invalid. No item was stored.`
      );
      if (itemId == undefined) return false;

      if (!(this.constructor as typeof Inventory1).validateItemId(itemId))
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
          // storageId: newRandStorageId,
          locationObtained:
            locationObtained != undefined
              ? locationObtained
              : variables().player.locationData.location,
        };

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
        this.constructor as typeof Inventory1
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
      itemId = (this.constructor as typeof Inventory1).tryConvertStringItemId(
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

    get getItemLimit() {
      return this.#itemLimit;
    }

    set setItemLimit(val: number) {
      const size = this.items.size;

      // Don't allow the inventory's limit to go lower than the amount of items the user currently has
      if (val < size) val = size;

      this.#itemLimit = val;
    }

    // Gets all data of the first item in the inventory the id matches. Returns false if no item is present. DOES NOT DELETE ANYTHING
    getItem(
      itemOrStorageId: ItemId | string | number,
      useUniqueStorageId = false
    ) {
      itemOrStorageId = (
        this.constructor as typeof Inventory1
      ).tryConvertStringItemId(
        itemOrStorageId,
        `The string data representing an item's id, ${itemOrStorageId}, is invalid. No item was retrieved.`
      );
      if (itemOrStorageId == undefined) return false;

      if (useUniqueStorageId) {
        return gInGameItems[this.items.get(itemOrStorageId).itemId];
        // TODO - Handle dynamic data
      }

      let inGameItem: Item | false = false;
      this.items.forEach((item, key) => {
        const id = item.itemId;
        if (id == itemOrStorageId) {
          inGameItem = gInGameItems[id];
          // TODO - Handle dynamic data
        }
      });

      return inGameItem;
    }

    // Returns static data from `Item` as well as dynamic data in the form of handlers on `InventoryItem` itself
    // REVIEW - Properly deal with cases where there are multiple items with different handler properties
    static getItemData(itemId: ItemId | string) {
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

      const itemTags = (this.getItemData(itemId) as Item).tags;

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
      return new (this.constructor as typeof Inventory1)(this);
    }

    toJSON() {
      const ownData: { [key: string]: any } = {};

      Object.keys(this).forEach((prop) => {
        ownData[prop] = clone(this[prop as any as keyof Inventory1]);
      }, this);

      return JSON.reviveWrapper(
        `new ${(this.constructor as typeof Inventory1).name}($ReviveData$)`,
        ownData
      );
    }
  }
  // @ts-expect-error
  window[`${Inventory1.name}`] = Inventory1; // Attach the class to the window object to ensure that sugarcube always finds it

  // @ts-expect-error
  window.test = new Inventory1();
  // @ts-expect-error
  window.test2 = Inventory1;
  // @ts-expect-error
  window.testFunc = () => {
    // @ts-expect-error
    const lim = test.getItemLimit;
    for (let i = 0; i < lim; i++) {
      // @ts-expect-error
      window.test.storeItem(i);
    }
  };
}
