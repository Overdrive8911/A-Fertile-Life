import { Item } from "../item";
import { ItemTag } from "../../declarations/item_enums";
import type {
  AnyItemDynamicData,
  FoodDynamicData,
  ItemCallback,
  ItemConstructorArgs,
} from "../../declarations/types_and_interfaces";
import type { Player } from "../../../declarations/player_declarations";

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

  // SECTION - Hunger Effects. If not explicitly provided, the food item will heal fullness by 10%
  HEAL_FULLNESS_10 = 1 << 8,
  HEAL_FULLNESS_25 = 1 << 9,
  HEAL_FULLNESS_50 = 1 << 10,
  HEAL_FULLNESS_75 = 1 << 11,
  HEAL_FULLNESS_100 = HEAL_FULLNESS_25 + HEAL_FULLNESS_75,
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
export // REVIEW - Types of food that reduce fullness and may give certain buffs or nerf?
class Food extends Item {
  /**
   * The time in seconds that should pass before the food item expires
   */
  expiresIn: number = 0;

  constructor(data?: ItemConstructorArgs<Food>) {
    super(data);
    this.addTags(ItemTag.FOOD);
  }

  applyEffect(effect: FoodEffect, user: Player, shouldInvert?: boolean): void {
    let hpChange = 0,
      moodChange = 0,
      fullnessChange = 0,
      expChange = 0;

    if (effect & FoodEffect.HEAL_HP_10) hpChange += 10;
    if (effect & FoodEffect.HEAL_HP_25) hpChange += 25;
    if (effect & FoodEffect.HEAL_HP_50) hpChange += 50;
    if (effect & FoodEffect.HEAL_HP_75) hpChange += 75;
    if (effect & FoodEffect.HEAL_HP_100) hpChange += 100;

    if (effect & FoodEffect.HEAL_MOOD_10) moodChange += 10;
    if (effect & FoodEffect.HEAL_MOOD_25) moodChange += 25;
    if (effect & FoodEffect.HEAL_MOOD_50) moodChange += 50;
    if (effect & FoodEffect.HEAL_MOOD_75) moodChange += 75;
    if (effect & FoodEffect.HEAL_MOOD_100) moodChange += 100;

    if (effect & FoodEffect.HEAL_FULLNESS_10) fullnessChange += 10;
    if (effect & FoodEffect.HEAL_FULLNESS_25) fullnessChange += 25;
    if (effect & FoodEffect.HEAL_FULLNESS_50) fullnessChange += 50;
    if (effect & FoodEffect.HEAL_FULLNESS_75) fullnessChange += 75;
    if (effect & FoodEffect.HEAL_FULLNESS_100) fullnessChange += 100;

    if (effect & FoodEffect.ADD_EXP_1) expChange += 1;
    if (effect & FoodEffect.ADD_EXP_5) expChange += 5;
    if (effect & FoodEffect.ADD_EXP_10) expChange += 10;
    if (effect & FoodEffect.ADD_EXP_25) expChange += 25;
    if (effect & FoodEffect.ADD_EXP_50) expChange += 50;
    if (effect & FoodEffect.ADD_EXP_75) expChange += 75;
    if (effect & FoodEffect.ADD_EXP_100) expChange += 100;

    if (shouldInvert) {
      hpChange *= -1;
      moodChange *= -1;
      fullnessChange *= -1;
      expChange *= -1;
    }

    user.hp += user.maxHp * hpChange;
    user.womb.addHp((user.womb.maxHp * hpChange) / 2);
    user.mentalStats.mood += 100 * moodChange;
    fullnessChange ? (user.fullness += fullnessChange) : (user.fullness += 10);
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
