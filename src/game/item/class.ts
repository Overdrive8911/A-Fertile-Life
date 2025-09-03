import type { JSX } from "solid-js/jsx-runtime";
import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import DummyImg from "~/media/img/items/dummy.webp";
import { areAllFlagsSet } from "~/utils/bitfields";
import { GAME_ENGINE } from "../engine/engine";
import { BodyArea } from "../shared/enums";
import { isBodyAreaInner, isBodyAreaTattoo } from "../shared/utils";
import { ItemColor, type ItemId, type ItemTag } from "./enums";
import type { ItemConstructorArgs } from "./types";

abstract class BaseItem<TEffectType extends number = 0> {
	id!: ItemId;

	name = "???";

	/** For the player to obtain it. The selling price is 45% of this value :p */
	price = 1;

	/** In grams */
	weight = 1;

	/** The reason it's a JSX element is so we can use styles like `bold` */
	description: JSX.Element = "???";

	/** The relative url to its image file in relations to the compiled html file */
	img = DummyImg;

	/** For sorting items */
	tags = new Set<ItemTag>();

	/** Just for aesthetics */
	color = ItemColor.NO_COLOR;

	constructor(data: ItemConstructorArgs<BaseItem<TEffectType>>) {
		const cloneableData = { ...data, tags: new Set(data.tags) };

		Object.assign(this, cloneableData);
	}

	/** Utility method for checking if the static item class is consumable */
	isConsumable(): this is ConsumableItem {
		return this instanceof ConsumableItem;
	}

	/** Utility method for checking if the static item class is equippable */
	isEquippable(): this is ConsumableItem {
		return this instanceof ConsumableItem;
	}
}

abstract class ItemWithEffects<
	TEffectType extends number = 0,
> extends BaseItem<TEffectType> {
	/**
	 * This is an array of values where each value is either an object consisting of an `effect` to apply and a flag to do the reverse of what the effect normally does, or a custom callback that takes the player as an argument and does something with it that none of the `effect`s can do
	 */
	effects: ReadonlyArray<TEffectType>;

	constructor(data: ItemConstructorArgs<ItemWithEffects<TEffectType>>) {
		super(data);

		this.effects = data.effects ?? [];
	}
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
		effect: TEffectType,
		user: PlayerV0_0_1,
	): void;

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
	readonly maxDurability: number;

	readonly bodyArea: BodyArea;

	/** Effects for this type of item typically apply temporary percentage or chunk bonuses like a 10% boost to all earned exp, a +50 boost to charisma, a 25% reduced energy drain, etc.
	 *
	 * The most important fact is that the effect can be revoked at any time.
	 *
	 * Also PS: Durability itself is not an effect.
	 */
	override effects: ReadonlyArray<TEffectType> = [];

	constructor(arg: ItemConstructorArgs<EquippableItem<TEffectType>>) {
		super(arg);

		this.maxDurability = arg.maxDurability ?? 100;
		this.bodyArea = arg.bodyArea ?? BodyArea.NONE;
	}

	/** Checks whether a given clothing covers a specific area */
	covers(bodyPart: BodyArea): boolean {
		// Can't wear underwear as regular outerwear :p
		if (this.type !== getTypeOfBodyArea(bodyPart)) return false;

		return areAllFlagsSet(this.bodyArea, bodyPart);
	}

	get type(): "inner" | "outer" {
		return getTypeOfBodyArea(this.bodyArea);
	}

	/** Human-readable string array for all the parts of the body that the item covers */
	get bodyAreaText() {}
}

function getTypeOfBodyArea(bodyArea: BodyArea): "inner" | "outer" {
	if (isBodyAreaInner(bodyArea)) return "inner";

	// Item's can't be tattoos
	// if (isBodyAreaTattoo(bodyArea)) return "tattoo";

	return "outer";
}

export { BaseItem, ConsumableItem, EquippableItem };
