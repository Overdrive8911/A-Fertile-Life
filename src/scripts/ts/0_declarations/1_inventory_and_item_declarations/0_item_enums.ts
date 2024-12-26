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

  // TODO - Turn this into a const string enum or maybe use a switch case and raw strings as substitutes in the places that require them and then just make this const.
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

  export namespace ItemType {
    // ANCHOR - Clothing
    // TODO - Implement clothing
    export const enum ClothingArea {
      NONE = 0,

      INNER = 1 << 27, // Any clothing item with this flag is for the inner body
      TATTOO = 1 << 28, // Represents a tattoo on any part of the body. And as such is considered  and ignores `INNER` by default

      TOP_OF_HEAD = 1 << 0,
      FACE = 1 << 1, // Technically, this will represent stuff like Glasses and makeup :p
      LEFT_EAR = 1 << 2,
      RIGHT_EAR = 1 << 3,
      // LEFT_CHEEK = 1 << 4,
      // RIGHT_CHEEK = 1 << 5,

      NECK = 1 << 4,
      TONGUE = 1 << 5,

      LEFT_SHOULDER = 1 << 6,
      RIGHT_SHOULDER = 1 << 7,
      CHEST = 1 << 8,
      ABDOMEN = 1 << 9,

      LEFT_UPPER_ARM = 1 << 10,
      LEFT_FORE_ARM = 1 << 11,
      LEFT_WRIST = 1 << 12,
      LEFT_HAND = 1 << 13,
      RIGHT_UPPER_ARM = 1 << 14,
      RIGHT_FORE_ARM = 1 << 15,
      RIGHT_WRIST = 1 << 16,
      RIGHT_HAND = 1 << 17,

      WAIST = 1 << 18,

      LEFT_THIGH = 1 << 19, // Also includes the knees
      LEFT_CALF = 1 << 20, // May also include ankles
      LEFT_ANKLE = 1 << 21,
      LEFT_FOOT = 1 << 22,
      RIGHT_THIGH = 1 << 23, // Also includes the knees
      RIGHT_CALF = 1 << 24, // May also include ankles
      RIGHT_ANKLE = 1 << 25,
      RIGHT_FOOT = 1 << 26,

      // ANCHOR - Area combinations
      EARS = LEFT_EAR | RIGHT_EAR,
      ENTIRE_HEAD = TOP_OF_HEAD | FACE | EARS,
      FACE_MAKEUP = FACE | INNER,

      TORSO = CHEST | ABDOMEN,
      TORSO_INNER = TORSO | INNER,
      CHEST_INNER = CHEST | INNER,
      ABDOMEN_INNER = ABDOMEN | INNER,

      LEFT_ARM = LEFT_UPPER_ARM | LEFT_FORE_ARM,
      LEFT_ENTIRE_ARM = LEFT_ARM | LEFT_WRIST | LEFT_HAND | LEFT_SHOULDER,
      RIGHT_ARM = RIGHT_UPPER_ARM | RIGHT_FORE_ARM,
      RIGHT_ENTIRE_ARM = RIGHT_ARM | RIGHT_WRIST | RIGHT_HAND | RIGHT_SHOULDER,
      ARMS = LEFT_ARM | RIGHT_ARM,
      ENTIRE_ARMS = LEFT_ENTIRE_ARM | RIGHT_ENTIRE_ARM,

      UPPER_BODY = ENTIRE_HEAD | TORSO | ENTIRE_ARMS,

      LEFT_LEG = LEFT_THIGH | LEFT_CALF,
      LEFT_ENTIRE_LEG = LEFT_LEG | LEFT_ANKLE | LEFT_FOOT,
      RIGHT_LEG = RIGHT_THIGH | RIGHT_CALF,
      RIGHT_ENTIRE_LEG = RIGHT_LEG | RIGHT_ANKLE | RIGHT_FOOT,
      LEGS = LEFT_LEG | RIGHT_LEG,
      ENTIRE_LEGS = LEFT_ENTIRE_LEG | RIGHT_ENTIRE_LEG,

      PRIVATES = WAIST | INNER,

      LOWER_BODY = WAIST | ENTIRE_LEGS,

      ENTIRE_BODY = UPPER_BODY | LOWER_BODY,
    }
  }
}
