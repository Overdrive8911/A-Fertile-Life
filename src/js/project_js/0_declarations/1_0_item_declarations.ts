enum ItemId {
  DUMMY,

  // Food
  FOOD_CHEESE,
  FOOD_MOULDY_CHEESE,

  // Key Cards
  //
  KEY_CARD_LVL_1, // Basic rooms like cleaning supplies and the PC office. PC gets handed this at the beginning
  KEY_CARD_LVL_2, // Better prices at the shops and better food (just an upgrade)
  KEY_CARD_LVL_3, // Allowed into major places like the Nursery
  KEY_CARD_LVL_4, // Access to all drugs and items as well as the Underground
  KEY_CARD_LVL_5, // Dunno. Will be unobtainable irl for a while

  // Player House
  PLAYER_HOUSE_KEY,

  // Drugs
  DRUG_CONTRACEPTIVE,
  DRUG_FERTILITY_BOOST_1,
  DRUG_FERTILITY_BOOST_2,
  DRUG_FERTILITY_BOOST_3,
}

enum ItemTag {
  DUMMY,
  ALL, // Don't give this tag to anything. It applies to every item already
  KEY_ITEMS,
  FOOD,
  CLOTHING,
  MISCELLANEOUS,
  DRUGS,
  PLAYER,
}

enum ItemProperties {
  PRICE_CANNOT_BE_BOUGHT = -1,
}

// This will store ALL the available info for every item. All the PC will keep in their inventory is the ID of the item so the required data can be linked back here. If an item has dynamic data, then that would be stored with the PC
const gInGameItems: { [key in ItemId]?: Item } = {
  [ItemId.DUMMY]: {
    itemId: ItemId.DUMMY,
    name: "Dummy",
    price: 0,
    weight: 0,
    description: "Dummy",
    imageUrl: "assets/img/items/dummy.webp",
    tags: [ItemTag.DUMMY],
    handler: function () {},
  },
  [ItemId.FOOD_CHEESE]: {
    itemId: ItemId.FOOD_CHEESE,
    name: "Cheese",
    price: 100,
    weight: 300,
    description: `A piece of soft yellow divine goodness from heaven itself.`,
    imageUrl: "assets/img/items/cheese.webp",
    tags: [ItemTag.FOOD],
  },
  [ItemId.FOOD_MOULDY_CHEESE]: {
    itemId: ItemId.FOOD_MOULDY_CHEESE,
    name: "Mouldy Cheese",
    price: 10000,
    weight: 350,
    description: `An antiquated piece of "food" that should've been discarded long ago.`,
    imageUrl: "assets/img/items/mouldy_cheese.webp",
    tags: [ItemTag.FOOD],
  },
  [ItemId.KEY_CARD_LVL_1]: {
    itemId: ItemId.KEY_CARD_LVL_1,
    name: "Key Card",
    price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
    weight: 20,
    description: `It looks like lowest level out of its set. It probably has no use beyond accessing closets…`,
    imageUrl: "assets/img/items/keycard_lvl_1.webp",
    tags: [ItemTag.KEY_ITEMS],
  },
  [ItemId.KEY_CARD_LVL_2]: {
    itemId: ItemId.KEY_CARD_LVL_2,
    name: "Key Card",
    price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
    weight: 20,
    description: `The defacto card for employees. You have access to everything your co-workers have. Looks like you're fitting in just nicely.`,
    imageUrl: "assets/img/items/keycard_lvl_2.webp",
    tags: [ItemTag.KEY_ITEMS],
  },
  [ItemId.KEY_CARD_LVL_3]: {
    itemId: ItemId.KEY_CARD_LVL_3,
    name: "Key Card",
    price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
    weight: 20,
    description: `Seems like you've been given much elevated permissions. You now have proper access to places like <b>The Nursery</b>.`,
    imageUrl: "assets/img/items/keycard_lvl_3.webp",
    tags: [ItemTag.KEY_ITEMS],
  },
  [ItemId.KEY_CARD_LVL_4]: {
    itemId: ItemId.KEY_CARD_LVL_4,
    name: "Key Card",
    price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
    weight: 20,
    description: `With the authority of a top-ranking researcher, you now have access to all items sold, and locations in the hospital. Including <b>The Underground</b>`,
    imageUrl: "assets/img/items/keycard_lvl_4.webp",
    tags: [ItemTag.KEY_ITEMS],
  },
  [ItemId.KEY_CARD_LVL_5]: {
    itemId: ItemId.KEY_CARD_LVL_5,
    name: "Key Card",
    price: ItemProperties.PRICE_CANNOT_BE_BOUGHT,
    weight: 20,
    description: `You really shouldn't have this. I don't know what to do with this item :p`,
    imageUrl: "assets/img/items/keycard_lvl_5.webp",
    tags: [ItemTag.KEY_ITEMS],
  },
};
