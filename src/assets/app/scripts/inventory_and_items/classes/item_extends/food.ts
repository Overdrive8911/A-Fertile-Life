import { Item } from "../item";
import { ItemTag } from "../../declarations/item_enums";
import type { ItemConstructorArgs } from "../../declarations/types_and_interfaces";

export const enum FoodEffect {
  // SECTION - Healing Effects. These also heal the womb by 50%
  HEAL_HP_10 = 1 << 0,
  HEAL_HP_25 = 1 << 1,
  HEAL_HP_50 = 1 << 2,
  HEAL_HP_75 = 1 << 3,
  HEAL_HP_100 = HEAL_HP_25 + HEAL_HP_75,
  // !SECTION

  // SECTION - Mood Effects
  HEAL_MOOD_10 = 1 << 4,
  HEAL_MOOD_25 = 1 << 5,
  HEAL_MOOD_50 = 1 << 6,
  HEAL_MOOD_75 = 1 << 7,
  HEAL_MOOD_100 = HEAL_MOOD_25 + HEAL_MOOD_75,
  // !SECTION

  HEAL_HP_AND_MOOD_10 = HEAL_HP_10 | HEAL_MOOD_10,
  HEAL_HP_AND_MOOD_25 = HEAL_HP_25 | HEAL_MOOD_25,
  HEAL_HP_AND_MOOD_50 = HEAL_HP_50 | HEAL_MOOD_50,
  HEAL_HP_AND_MOOD_75 = HEAL_HP_75 | HEAL_MOOD_75,
  HEAL_HP_AND_MOOD_100 = HEAL_HP_100 | HEAL_MOOD_100,

  // SECTION - Hunger Effects. If not explicitly provided, the food item will heal hunger by 10%
  HEAL_HUNGER_10 = 1 << 8,
  HEAL_HUNGER_25 = 1 << 9,
  HEAL_HUNGER_50 = 1 << 10,
  HEAL_HUNGER_75 = 1 << 11,
  HEAL_HUNGER_100 = HEAL_HUNGER_25 + HEAL_HUNGER_75,
  // !SECTION

  // SECTION - EXP Effects. These add a percentage of exp relative to the total amount of exp needed to advance to the next level. If not specific, defaults to 1% exp
  ADD_EXP_1 = 1 << 12,
  ADD_EXP_5 = 1 << 13,
  ADD_EXP_10 = 1 << 14,
  ADD_EXP_25 = 1 << 15,
  ADD_EXP_50 = 1 << 16,
  ADD_EXP_75 = 1 << 17,
  ADD_EXP_100 = ADD_EXP_25 + ADD_EXP_75,
}
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
