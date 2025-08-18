import { Item } from "./class";
import { Clothing } from "./clothing/class";
import {
	ClothingArea,
	FoodEffect,
	ItemColor,
	ItemId,
	ItemProperties,
	ItemTag,
} from "./enums";
import { Food } from "./food/class";

/** This will store ALL the available info for every item. All the PC will keep in their inventory is the ID of the item so the required data can be linked back here. If an item has dynamic data, then that would be stored with the PC */
const gInGameItems: Partial<Record<ItemId, Item>> = {
	[ItemId.DUMMY]: new Item(),

	[ItemId.CHEESE]: new Food({
		itemId: ItemId.CHEESE,
		// name: "Cheese",
		price: 100,
		weight: 300,
		description: "A piece of soft yellow divine goodness from heaven itself.",
		// imageUrl: "media/img/items/cheese.webp",
		// tags: [ItemTag.FOOD],
		effect: [FoodEffect.HEAL_HP_10, FoodEffect.ADD_EXP_10],
	}),

	[ItemId.MOULDY_CHEESE]: new Food({
		itemId: ItemId.MOULDY_CHEESE,
		// name: "Mouldy Cheese",
		price: 10000,
		weight: 350,
		description:
			'An antiquated piece of "food" that should\'ve been discarded long ago.',
		// imageUrl: "media/img/items/mouldy_cheese.webp",
		// tags: [ItemTag.FOOD],
		effect: [{ type: FoodEffect.HEAL_HP_10, invert: true }],
	}),

	[ItemId.KEYCARD_LVL_1]: new Item({
		itemId: ItemId.KEYCARD_LVL_1,
		name: "Key Card",
		price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
		weight: 20,
		description:
			"It looks like lowest level out of its set. It probably has no use beyond accessing closets…",
		// imageUrl: "media/img/items/keycard_lvl_1.webp",
		tags: [ItemTag.KEY_ITEMS],
	}),

	[ItemId.KEYCARD_LVL_2]: new Item({
		itemId: ItemId.KEYCARD_LVL_2,
		name: "Key Card",
		price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
		weight: 20,
		description:
			"The defacto card for employees. You have access to everything your co-workers have. Looks like you're fitting in just nicely.",
		// imageUrl: "media/img/items/keycard_lvl_2.webp",
		tags: [ItemTag.KEY_ITEMS],
	}),

	[ItemId.KEYCARD_LVL_3]: new Item({
		itemId: ItemId.KEYCARD_LVL_3,
		name: "Key Card",
		price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
		weight: 20,
		description:
			"Seems like you've been given much elevated permissions. You now have proper access to places like <b>The Nursery</b>.",
		// imageUrl: "media/img/items/keycard_lvl_3.webp",
		tags: [ItemTag.KEY_ITEMS],
	}),

	[ItemId.KEYCARD_LVL_4]: new Item({
		itemId: ItemId.KEYCARD_LVL_4,
		name: "Key Card",
		price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
		weight: 20,
		description:
			"With the authority of a top-ranking researcher, you now have access to all items sold, and locations in the hospital. Including <b>The Underground</b>",
		// imageUrl: "media/img/items/keycard_lvl_4.webp",
		tags: [ItemTag.KEY_ITEMS],
	}),

	[ItemId.KEYCARD_LVL_5]: new Item({
		itemId: ItemId.KEYCARD_LVL_5,
		name: "Key Card",
		price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
		weight: 20,
		description:
			"You really shouldn't have this. I don't know what to do with this item :p",
		// imageUrl: "media/img/items/keycard_lvl_5.webp",
		tags: [ItemTag.KEY_ITEMS],
	}),

	[ItemId.SIMPLE_HAT]: new Clothing({
		itemId: ItemId.SIMPLE_HAT,
		price: 350,
		weight: 110,
		description: "A nice and plain hat to protect you from the sun.",
		color: ItemColor.GREY,
		bodyArea: ClothingArea.HAT_AREA,
	}),

	[ItemId.SIMPLE_SHIRT]: new Clothing({
		itemId: ItemId.SIMPLE_SHIRT,
		price: 850,
		weight: 330,
		description: "A nice and plain shirt that isn't too tight.",
		color: ItemColor.GREY,
		bodyArea: ClothingArea.SHIRT_AREA,
	}),

	[ItemId.SIMPLE_SKIRT]: new Clothing({
		itemId: ItemId.SIMPLE_SKIRT,
		price: 700,
		weight: 300,
		description: "A nice and plain skirt that's just right.",
		color: ItemColor.GREY,
		bodyArea: ClothingArea.SKIRT_AREA,
	}),

	[ItemId.SIMPLE_BOOTS]: new Clothing({
		itemId: ItemId.SIMPLE_BOOTS,
		price: 500,
		weight: 500,
		description: "A nice and plain pair of boots that's pretty snug.",
		color: ItemColor.GREY,
		bodyArea: ClothingArea.BOOT_AREA,
	}),
};

export { gInGameItems };
