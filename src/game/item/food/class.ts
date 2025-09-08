import type { Player } from "~/game/character/class/player";
import { Womb } from "~/game/pregnancy/classes/womb";
import { ConsumableItem } from "../class";
import { ItemTag } from "../enums";
import type { ItemConstructorArgs } from "../types";
import { FoodEffectType } from "./enums";
import type { FoodEffect } from "./types";
import { parseFoodEffect } from "./util";

export // REVIEW - Types of food that reduce fullness and may give certain buffs or nerf?
class Food extends ConsumableItem<FoodEffect> {
	constructor(data: ItemConstructorArgs<Food>) {
		super(data);

		this.tags.add(ItemTag.FOOD);
	}

	override _applyEffect(foodEffect: FoodEffect, user: Player): void {
		let hpChange = 0,
			wombHpChange = 0,
			moodChange = 0,
			fullnessChange = 0,
			expChange = 0;

		const { percentage, type } = parseFoodEffect(foodEffect);

		switch (type) {
			case FoodEffectType.HEAL_HP:
				hpChange += percentage;
				break;

			case FoodEffectType.HEAL_WOMB:
				wombHpChange += percentage;
				break;

			case FoodEffectType.DRAIN_HP:
				hpChange -= percentage;
				break;

			case FoodEffectType.DRAIN_WOMB:
				wombHpChange -= percentage;
				break;

			case FoodEffectType.HEAL_MOOD:
				moodChange += percentage;
				break;

			case FoodEffectType.DRAIN_MOOD:
				moodChange -= percentage;
				break;

			case FoodEffectType.HEAL_FULLNESS:
				fullnessChange += percentage;
				break;

			case FoodEffectType.DRAIN_FULLNESS:
				fullnessChange -= percentage;
				break;

			case FoodEffectType.ADD_EXP:
				expChange += percentage;
				break;

			case FoodEffectType.DRAIN_EXP:
				expChange -= percentage;
				break;
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

		user.mood += moodChange;

		// TODO, turn the player into a character class and add setters for these stuff
		user.fullness = Math.min(100, user.fullness + 100 * fullnessChange);

		user.womb.exp += Womb.getExpLimit(user.womb.lvl + 1) * expChange;
	}
}
