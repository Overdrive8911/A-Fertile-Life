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

// This will store ALL the available info for every item. All the PC will keep in their inventory is the ID of the item so the required data can be linked back here. If an item has dynamic data, then that would be stored with the PC
const gInGameItems: { [key in ItemId]?: Item } = {
  [ItemId.DUMMY]: {
    itemId: ItemId.DUMMY,
    itemIdString: "DUMMY",
    name: "Dummy",
    price: 0,
    weight: 0,
    description: "Dummy",
    imageUrl: "assets/img/items/dummy.webp",
    handler: function () {},
  },
  [ItemId.FOOD_CHEESE]: {
    itemId: ItemId.FOOD_CHEESE,
    itemIdString: "FOOD_CHEESE",
    name: "Cheese",
    price: 100,
    weight: 30,
    description: `A piece of soft yellow divine goodness from heaven.`,
    imageUrl: "assets/img/items/cheese.webp",
  },
};
