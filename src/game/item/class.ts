import type { JSX } from "solid-js/jsx-runtime";
import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import { GAME_ENGINE } from "../engine/engine";
import { BodyArea } from "../shared/enums";
import { ItemColor, ItemId, ItemTag } from "./enums";
import {
	type BaseInventoryItem,
	ConsumableInventoryItem,
	EquippableInventoryItem,
} from "./inventory-item/class";
import type {
	GenericInvertedItemEffect,
	GenericItemEffect,
	ItemConstructorArgs,
} from "./types";

abstract class BaseItem<TEffectType extends number = 0> {
	id = ItemId.DUMMY;

	name = "???";

	/** For the player to obtain it. The selling price is 45% of this value :p */
	price = 1;

	/** In grams */
	weight = 1;

	/** The reason it's a JSX element is so we can use styles like `bold` */
	description: JSX.Element = "???";

	/** The relative url to its image file in relations to the compiled html file */
	img = "";

	/** For sorting items */
	tags = new Set([ItemTag.DUMMY]);

	/** Just for aesthetics */
	color = ItemColor.NO_COLOR;

	constructor(data?: ItemConstructorArgs<BaseItem<TEffectType>>) {
		const cloneableData = data ? { ...data, tags: new Set(data.tags) } : {};

		Object.assign(this, cloneableData);
	}
}

abstract class ItemWithEffects<
	TEffectType extends number = 0,
> extends BaseItem<TEffectType> {
	/**
	 * This is an array of values where each value is either an object consisting of an `effect` to apply and a flag to do the reverse of what the effect normally does, or a custom callback that takes the player as an argument and does something with it that none of the `effect`s can do
	 */
	effects: ReadonlyArray<GenericItemEffect<TEffectType>>;

	constructor(data?: ItemConstructorArgs<ItemWithEffects<TEffectType>>) {
		super(data);

		this.effects = [];
	}

	abstract createInventoryItem(
		...args: ConstructorParameters<typeof BaseInventoryItem>
	): BaseInventoryItem;
}

/** Use this explicitly for consumables */
abstract class ConsumableItem<
	TEffectType extends number = 0,
> extends ItemWithEffects<TEffectType> {
	/**
	 * The time in seconds that should pass before the consumable expires and can no longer be used.
	 *
	 * A value of 0 means it never expires.
	 */
	readonly expiresIn: number = 0;

	protected abstract _applyEffect(
		effect: GenericItemEffect<TEffectType>,
		user: PlayerV0_0_1,
	): void;

	override createInventoryItem(
		...args: ConstructorParameters<typeof ConsumableInventoryItem>
	): ConsumableInventoryItem {
		return new ConsumableInventoryItem(...args);
	}

	/** Since custom effects are, well custom, this is just a utility method to deal with that */
	protected _applyCustomEffectFromGenericUnion(
		effect: GenericItemEffect<TEffectType>,
		user: PlayerV0_0_1,
	): asserts effect is GenericInvertedItemEffect<TEffectType> | TEffectType {
		if (typeof effect !== "function") return;

		effect(user);
	}

	/** Applies the effect(s) of the item to the player */
	use() {
		GAME_ENGINE.setVars((state) => {
			this.effects.forEach((effect) => {
				this._applyEffect(effect, state.player);
			});
		});
	}
}

/** Use this explicitly for equippables.
 *
 * PS: Effects aren't handled by the class itself. Equipping an item simply adds the effects to a property on the player, and other classes / callbacks decide what to do with those effects.
 */
abstract class EquippableItem<
	TEffectType extends number = 0,
> extends ItemWithEffects<TEffectType> {
	readonly maxDurability: number = 100;

	readonly bodyArea: BodyArea = BodyArea.NONE;

	/** Effects for this type of item typically apply temporary percentage or chunk bonuses like a 10% boost to all earned exp, a +50 boost to charisma, a 25% reduced energy drain, etc.
	 *
	 * The most important fact is that the effect can be revoked at any time.
	 *
	 * Also PS: Durability itself is not an effect.
	 */
	override effects: ReadonlyArray<
		TEffectType | GenericInvertedItemEffect<TEffectType>
	> = [];

	override createInventoryItem(
		...args: ConstructorParameters<typeof EquippableInventoryItem>
	): EquippableInventoryItem {
		return new EquippableInventoryItem(...args);
	}

	coversBodyPart(bodyPart: BodyArea): boolean {
		return this.bodyArea !== BodyArea.NONE
			? bodyPart === (this.bodyArea & bodyPart)
			: false;
	}

	get type(): "inner" | "outer" | "tattoo" {
		if (this.bodyArea & BodyArea.INNER) return "inner";

		if (this.bodyArea & BodyArea.TATTOO) return "tattoo";

		return "outer";
	}
}

export { BaseItem, ConsumableItem, EquippableItem };
