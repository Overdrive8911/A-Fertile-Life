import CheeseImg from "../../media/img/items/cheese.webp";
import KeycardLvl1Img from "../../media/img/items/keycard_lvl_1.webp";
import KeycardLvl2Img from "../../media/img/items/keycard_lvl_2.webp";
import KeycardLvl3Img from "../../media/img/items/keycard_lvl_3.webp";
import KeycardLvl4Img from "../../media/img/items/keycard_lvl_4.webp";
import KeycardLvl5Img from "../../media/img/items/keycard_lvl_5.webp";
import MouldyCheeseImg from "../../media/img/items/mouldy_cheese.webp";
import SimpleBootsImg from "../../media/img/items/simple_boots.webp";
import SimpleHatImg from "../../media/img/items/simple_hat.webp";
import SimpleShirtImg from "../../media/img/items/simple_shirt.webp";
import SimpleSkirtImg from "../../media/img/items/simple_skirt.webp";
import { BodyArea, PositiveStatusEffect } from "../shared/enums";
import type { BaseItem } from "./class";
import { Clothing } from "./clothing/class";
import { ItemColor, ItemId, ItemTag } from "./enums";
import { Food } from "./food/class";
import { FoodEffect } from "./food/enums";
import { KeyItem } from "./key-item/class";

/** This will store ALL the available info for every item. All the PC will keep in their inventory is the ID of the item so the required data can be linked back here. If an item has dynamic data, then that would be stored with the PC */
const gInGameItems = {
	[ItemId.CHEESE]: new Food({
		description: "A piece of soft yellow divine goodness from heaven itself.",
		effects: [
			FoodEffect.HEAL_HP_10,
			FoodEffect.HEAL_FULLNESS_10,
			FoodEffect.ADD_EXP_10,
		],
		id: ItemId.CHEESE,
		img: CheeseImg,
		name: "Cheese",
		price: 100,
		weight: 300,
	}),

	[ItemId.MOULDY_CHEESE]: new Food({
		description:
			'An antiquated piece of "food" that should\'ve been discarded long ago.',
		effects: [
			FoodEffect.DRAIN_HP_10,
			FoodEffect.DRAIN_FULLNESS_10,
			FoodEffect.ADD_EXP_25,
		],
		id: ItemId.MOULDY_CHEESE,
		img: MouldyCheeseImg,
		name: "Mouldy Cheese",
		price: 10000,
		weight: 350,
	}),

	[ItemId.KEYCARD_LVL_1]: new KeyItem({
		description:
			"It looks like lowest level out of its set. It probably has no use beyond accessing closets…",
		id: ItemId.KEYCARD_LVL_1,
		img: KeycardLvl1Img,
		name: "Key Card",
		tags: [ItemTag.KEY_ITEM],
		weight: 20,
	}),

	[ItemId.KEYCARD_LVL_2]: new KeyItem({
		description:
			"The defacto card for employees. You have access to everything your co-workers have. Looks like you're fitting in just nicely.",
		id: ItemId.KEYCARD_LVL_2,
		img: KeycardLvl2Img,
		name: "Key Card",
		tags: [ItemTag.KEY_ITEM],
		weight: 20,
	}),

	[ItemId.KEYCARD_LVL_3]: new KeyItem({
		description: (
			<span>
				Seems like you've been given much elevated permissions. You now have
				proper access to places like{" "}
				<strong class="font-bold">The Nursery</strong>.
			</span>
		),
		id: ItemId.KEYCARD_LVL_3,
		img: KeycardLvl3Img,
		name: "Key Card",
		tags: [ItemTag.KEY_ITEM],
		weight: 20,
	}),

	[ItemId.KEYCARD_LVL_4]: new KeyItem({
		description: (
			<span>
				With the authority of a top-ranking researcher, you now have access to
				all items sold, and locations in the hospital. Including{" "}
				<strong class="font-bold">The Underground</strong>
			</span>
		),
		id: ItemId.KEYCARD_LVL_4,
		img: KeycardLvl4Img,
		name: "Key Card",
		tags: [ItemTag.KEY_ITEM],
		weight: 20,
	}),

	[ItemId.KEYCARD_LVL_5]: new KeyItem({
		description:
			"You really shouldn't have this. I don't know what to do with this item :p",
		id: ItemId.KEYCARD_LVL_5,
		img: KeycardLvl5Img,
		name: "Key Card",
		tags: [ItemTag.KEY_ITEM],
		weight: 20,
	}),

	[ItemId.SIMPLE_HAT]: new Clothing({
		bodyArea: BodyArea.HAT_AREA,
		color: ItemColor.GREY,
		description: "A nice and plain hat to protect you from the sun.",
		effects: [PositiveStatusEffect.EXP_GAIN_5_PERCENT],
		id: ItemId.SIMPLE_HAT,
		img: SimpleHatImg,
		name: "Simple Hat",
		price: 350,
		weight: 110,
	}),

	[ItemId.SIMPLE_SHIRT]: new Clothing({
		bodyArea: BodyArea.SHIRT_AREA,
		color: ItemColor.GREY,
		description: "A nice and plain shirt that isn't too tight.",
		effects: [PositiveStatusEffect.EXP_GAIN_5_PERCENT],
		id: ItemId.SIMPLE_SHIRT,
		img: SimpleShirtImg,
		name: "Simple Shirt",
		price: 850,
		weight: 330,
	}),

	[ItemId.SIMPLE_SKIRT]: new Clothing({
		bodyArea: BodyArea.SKIRT_AREA,
		color: ItemColor.GREY,
		description: "A nice and plain skirt that's just right.",
		effects: [PositiveStatusEffect.EXP_GAIN_5_PERCENT],
		id: ItemId.SIMPLE_SKIRT,
		img: SimpleSkirtImg,
		name: "Simple Skirt",
		price: 700,
		weight: 300,
	}),

	[ItemId.SIMPLE_BOOTS]: new Clothing({
		bodyArea: BodyArea.BOOT_AREA,
		color: ItemColor.GREY,
		description: "A nice and plain pair of boots that's pretty snug.",
		effects: [PositiveStatusEffect.EXP_GAIN_5_PERCENT],
		id: ItemId.SIMPLE_BOOTS,
		img: SimpleBootsImg,
		name: "Simple Boots",
		price: 500,
		weight: 500,
	}),
} as const satisfies Record<ItemId, BaseItem<FoodEffect | 0>>;

export { gInGameItems };
