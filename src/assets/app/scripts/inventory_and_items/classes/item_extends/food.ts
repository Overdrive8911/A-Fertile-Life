import { Item } from "../item";
import { ItemTag } from "../../declarations/item_enums";
import type { ItemConstructorArgs } from "../../declarations/types_and_interfaces";

export // REVIEW - Types of food that reduce hunger and may give certain buffs or nerf?
class Food extends Item {
  /**
   * The time in seconds that should pass before the food item expires
   */
  expiresIn: number = 0;
  effect: [] = [];
  constructor(data?: ItemConstructorArgs<Food>) {
    super(data);
    this.addTags(ItemTag.FOOD);
  }
}

// export class Trash extends Item {
//   constructor(data?: Partial<Item>) {
//     super(data);
//   }
// }

// export class Miscellaneous extends Item {
//   constructor(data?: Partial<Item>) {
//     super(data);
//   }
// }
