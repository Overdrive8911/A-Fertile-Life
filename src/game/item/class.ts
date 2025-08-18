import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import { ItemColor, ItemId, ItemProperties, ItemTag } from "./enums";
import type { ItemCallback, ItemConstructorArgs } from "./types";

/** This class accepts 3 arguments; an object which may have any data of the non-method properties of this class, a function to serve as the handler callback of the item to create, or both in an object described by `allData` which is {data: ..., handler: ...} */
class Item<ItemEffect extends number = number> {
	itemId: ItemId = ItemId.DUMMY;
	name: string = "???";
	/** For the player to obtain it. The selling price is 45% of this value :p */
	price: number = 0;
	/** In grams */
	weight: number = 0;
	description: string = "";
	/** The relative url to its image file in relations to the compiled html file */
	imgUrl: string = "";
	/** For sorting items */
	tags = new Set<ItemTag>([ItemTag.DUMMY]);
	/** Just for aesthetics */
	color: ItemColor = ItemColor.NO_COLOR;

	/**
	 * This is an array of values where each value is either an `effect` to apply, an object consisting of an `effect` to apply and a flag to do the reverse of what the effect normally does, or a function that takes the player as an argument and does something with it that none of the `effect`s can do
	 */
	effect?: (
		| ItemEffect
		| { type: ItemEffect; invert: true }
		| ((user: PlayerV0_0_1) => void)
	)[];

	/**
	 * If the item can be used. If not, it's just a collectible
	 *
	 * //NOTE: **EVERY ITEM IS UNUSABLE UNLESS EXPLICITLY SET OTHERWISE**
	 */
	usable = false;

	// A handler function called when the item is used. Unusable items don't need this. Return data (and parameters) will be an array/iterable/single primitive value and will likely be of the same structure (since the stored data in an inventory item(if any) may be used as arguments). See the getter `callback()`
	customCallBack?: ItemCallback; // NOTE: Add this when initializing a new item and a special "default callback" is required.
	/**
	 *
	 * // ANCHOR: The `defaultCallback()` is simply the default function that should be called when an item in the inventory is used. Like wearing / removing clothing, consuming food or drugs, etc.
	 */
	protected defaultCallback(...args: Parameters<ItemCallback>) {
		// REVIEW - What should the generic item callback be?
		// TODO - Fix this typescript error
		const user = args[0]?.user;

		if (user && this.effect) {
			this.effect.forEach((effect) => {
				if (typeof effect === "function") {
					effect(user);
				} else if (typeof effect === "object") {
					if (effect.invert) {
						// Invert the effect
						this.applyEffect(effect.type, user, true);
					} else {
						this.applyEffect(effect.type, user);
					}
				} else {
					this.applyEffect(effect, user);
				}
			});
		}

		return 0 as ReturnType<ItemCallback>;
	}
	/**
	 * **OVERRIDE ME** on any item that can apply *effects* to the user such as `Food` and `Drug`s
	 */
	protected applyEffect(
		effect: ItemEffect,
		user: PlayerV0_0_1,
		shouldInvert = false,
	) {
		console.log("Default Effect applied aka NOTHING :3. Override this method");
	}

	constructor(data?: ItemConstructorArgs<Item>) {
		const cloneableData = data ? { ...data, tags: new Set(data.tags) } : {};

		Object.assign(this, cloneableData);
	}

	// SECTION - Methods
	addTags(...tagsToAdd: ItemTag[]) {
		tagsToAdd.forEach((tagToAdd) => {
			if (tagToAdd !== ItemTag.ALL) {
				this.tags.add(tagToAdd);
			}
		});
	}

	// Returns an array of the removed tags
	removeTags(...tagsToRemove: ItemTag[]): ItemTag[] {
		return tagsToRemove.map((tag) => {
			this.tags.delete(tag);
			return tag;
		});
	}
}

export { Item };
