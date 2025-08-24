import { Womb } from "~/game/pregnancy/classes/womb";
import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import { ConsumableItem } from "../class";
import { ItemTag } from "../enums";
import type { GenericItemEffect, ItemConstructorArgs } from "../types";
import { FoodEffect } from "./enums";

export // REVIEW - Types of food that reduce fullness and may give certain buffs or nerf?
class Food extends ConsumableItem<FoodEffect> {
	constructor(data?: ItemConstructorArgs<Food>) {
		super(data);

		this.tags.add(ItemTag.FOOD);
	}

	override _applyEffect(
		effect: GenericItemEffect<FoodEffect>,
		user: PlayerV0_0_1,
	): void {
		this._applyCustomEffectFromGenericUnion(effect, user);

		const { effect: foodEffect, invert } =
			typeof effect === "object" ? effect : { effect, invert: false };

		let hpChange = 0,
			wombHpChange = 0,
			moodChange = 0,
			fullnessChange = 0,
			expChange = 0;

		switch (foodEffect) {
			case FoodEffect.HEAL_HP_10:
				hpChange += 10;
				break;
			case FoodEffect.HEAL_HP_25:
				hpChange += 25;
				break;
			case FoodEffect.HEAL_HP_50:
				hpChange += 50;
				break;
			case FoodEffect.HEAL_HP_75:
				hpChange += 75;
				break;
			case FoodEffect.HEAL_HP_100:
				hpChange += 100;
				break;
			case FoodEffect.HEAL_WOMB_25:
				wombHpChange += 25;
				break;
			case FoodEffect.HEAL_WOMB_50:
				wombHpChange += 50;
				break;
			case FoodEffect.HEAL_WOMB_75:
				wombHpChange += 75;
				break;
			case FoodEffect.HEAL_WOMB_100:
				wombHpChange += 100;
				break;
			case FoodEffect.HEAL_MOOD_10:
				moodChange += 10;
				break;
			case FoodEffect.HEAL_MOOD_25:
				moodChange += 25;
				break;
			case FoodEffect.HEAL_MOOD_50:
				moodChange += 50;
				break;
			case FoodEffect.HEAL_MOOD_75:
				moodChange += 75;
				break;
			case FoodEffect.HEAL_MOOD_100:
				moodChange += 100;
				break;
			case FoodEffect.HEAL_FULLNESS_10:
				fullnessChange += 10;
				break;
			case FoodEffect.HEAL_FULLNESS_25:
				fullnessChange += 25;
				break;
			case FoodEffect.HEAL_FULLNESS_50:
				fullnessChange += 50;
				break;
			case FoodEffect.HEAL_FULLNESS_75:
				fullnessChange += 75;
				break;
			case FoodEffect.HEAL_FULLNESS_100:
				fullnessChange += 100;
				break;
			case FoodEffect.ADD_EXP_1:
				expChange += 1;
				break;
			case FoodEffect.ADD_EXP_5:
				expChange += 5;
				break;
			case FoodEffect.ADD_EXP_10:
				expChange += 10;
				break;
			case FoodEffect.ADD_EXP_25:
				expChange += 25;
				break;
			case FoodEffect.ADD_EXP_50:
				expChange += 50;
				break;
			case FoodEffect.ADD_EXP_75:
				expChange += 75;
				break;
			case FoodEffect.ADD_EXP_100:
				expChange += 100;
				break;
		}

		if (invert) {
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
