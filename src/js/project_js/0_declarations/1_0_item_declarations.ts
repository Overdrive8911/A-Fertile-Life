enum ItemId {
  DUMMY,

  // Food
  FOOD_CHEESE,
  FOOD_MOULDY_CHEESE,

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
    weight: 30,
    description: `A piece of soft yellow divine goodness from heaven itself.`,
    imageUrl: "assets/img/items/cheese.webp",
    tags: [ItemTag.FOOD],
  },
  [ItemId.FOOD_MOULDY_CHEESE]: {
    itemId: ItemId.FOOD_MOULDY_CHEESE,
    name: "Mouldy Cheese",
    price: 10000,
    weight: 35,
    description: `An antiquated piece of "food" that should've been discarded long ago.`,
    imageUrl: "assets/img/items/mouldy_cheese.webp",
    tags: [ItemTag.FOOD],
  },
};
