import { Womb } from "~/game/pregnancy/classes/womb";
import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import { Item } from "../class";
import { FoodEffect, ItemTag } from "../enums";
import type { ItemConstructorArgs } from "../types";

export // REVIEW - Types of food that reduce fullness and may give certain buffs or nerf?
class Food extends Item {
	/**
	 * The time in seconds that should pass before the food item expires
	 */
	expiresIn: number = 0;

	constructor(data?: ItemConstructorArgs<Food>) {
		super(data);
		this.usable = true;
		this.addTags(ItemTag.FOOD);
	}

	override applyEffect(
		effect: FoodEffect,
		user: PlayerV0_0_1,
		shouldInvert?: boolean,
	): void {
		let hpChange = 0,
			wombHpChange = 0,
			moodChange = 0,
			fullnessChange = 0,
			expChange = 0;

		if (effect & FoodEffect.HEAL_HP_10) hpChange += 10;
		if (effect & FoodEffect.HEAL_HP_25) hpChange += 25;
		if (effect & FoodEffect.HEAL_HP_50) hpChange += 50;
		if (effect & FoodEffect.HEAL_HP_75) hpChange += 75;
		if (effect & FoodEffect.HEAL_HP_100) hpChange += 100;

		if (effect & FoodEffect.HEAL_WOMB_25) wombHpChange += 25;
		if (effect & FoodEffect.HEAL_WOMB_50) wombHpChange += 50;
		if (effect & FoodEffect.HEAL_WOMB_75) wombHpChange += 75;
		if (effect & FoodEffect.HEAL_WOMB_100) wombHpChange += 100;

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
			wombHpChange *= -1;
			moodChange *= -1;
			fullnessChange *= -1;
			expChange *= -1;
		}

		// Turn them into percentages
		hpChange /= 100;
		wombHpChange /= 100;
		moodChange /= 100;
		fullnessChange /= 100;
		expChange /= 100;

		user.hp += user.maxHp * hpChange + user.womb.maxHp * wombHpChange * 0.3;

		user.womb.addHp(
			user.womb.maxHp * hpChange * 0.3 + user.womb.maxHp * wombHpChange,
		);

		user.mental.mood += moodChange;

		if (fullnessChange) {
			user.fullness += 100 * fullnessChange;
		} else {
			user.fullness += 100 * 10;
		}

		user.womb.exp += Womb.getExpLimit(user.womb.lvl + 1) * expChange;
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
