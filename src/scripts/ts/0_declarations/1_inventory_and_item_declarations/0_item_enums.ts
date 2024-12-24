namespace NSInventoryAndItem {
  export enum ItemId {
    DUMMY,

    // Food
    CHEESE,
    MOULDY_CHEESE,

    // Key Cards
    //
    KEYCARD_LVL_1, // Basic rooms like cleaning supplies and the PC office. PC gets handed this at the beginning
    KEYCARD_LVL_2, // Better prices at the shops and better food (just an upgrade)
    KEYCARD_LVL_3, // Allowed into major places like the Nursery
    KEYCARD_LVL_4, // Access to all drugs and items as well as the Underground
    KEYCARD_LVL_5, // Dunno. Will be unobtainable irl for a while

    // Player House
    PLAYER_HOUSE_KEY,

    // Drugs
    CONTRACEPTIVE,
    FERTILITY_BOOST_1,
    FERTILITY_BOOST_2,
    FERTILITY_BOOST_3,
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
