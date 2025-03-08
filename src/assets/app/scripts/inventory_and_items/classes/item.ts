import {
  ItemColor,
  ItemId,
  ItemProperties,
  ItemTag,
} from "../declarations/item_enums";
import type {
  ItemCallback,
  ItemConstructorArgs,
} from "../declarations/types_and_interfaces";

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
      `media/img/items/${ItemId[this.itemId].toLocaleLowerCase()}.webp`
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
