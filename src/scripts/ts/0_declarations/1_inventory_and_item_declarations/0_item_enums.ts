namespace NSInventoryAndItem {
  export enum ItemId {
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

  export enum ItemTag {
    DUMMY,
    ALL, // Don't give this tag to anything. It applies to every item already
    KEY_ITEMS,
    FOOD,
    CLOTHING,
    MISCELLANEOUS,
    DRUGS,
    TRASH,
  }

  export const enum ItemProperties {
    PRICE_CANNOT_BE_BOUGHT = 0,
    WEIGHTLESS = 0,
  }
}
