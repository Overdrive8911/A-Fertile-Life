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

    // Clothing
    SIMPLE_HAT,
    SIMPLE_SHIRT,
    SIMPLE_SKIRT,
    SIMPLE_BOOTS,
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

  // Maybe I could turn these to numbers and use a method to generate the appropriate strings?
  export const enum ItemColor {
    NO_COLOR = "",
    RED = "red",
    GREEN = "green",
    BLUE = "blue",
    YELLOW = "yellow",
    PINK = "pink",
    PURPLE = "purple",
    WHITE = "white",
    BLACK = "black",
    GREY = "grey",
    BROWN = "brown",
    ORANGE = "orange",
  }

  export namespace ItemType {
    // ANCHOR - Clothing
    // TODO - Implement clothing
    // REVIEW - Consider creating namespaces for each item type
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
      SHOULDERS = LEFT_SHOULDER | RIGHT_SHOULDER,

      UPPER_BODY = ENTIRE_HEAD | TORSO | ENTIRE_ARMS,

      LEFT_LEG = LEFT_THIGH | LEFT_CALF,
      LEFT_ENTIRE_LEG = LEFT_LEG | LEFT_ANKLE | LEFT_FOOT,
      RIGHT_LEG = RIGHT_THIGH | RIGHT_CALF,
      RIGHT_ENTIRE_LEG = RIGHT_LEG | RIGHT_ANKLE | RIGHT_FOOT,
      LEGS = LEFT_LEG | RIGHT_LEG,
      ENTIRE_LEGS = LEFT_ENTIRE_LEG | RIGHT_ENTIRE_LEG,
      THIGHS = LEFT_THIGH | RIGHT_THIGH,
      CALVES = LEFT_CALF | RIGHT_CALF,
      ANKLES = RIGHT_ANKLE | LEFT_ANKLE,
      FEET = LEFT_FOOT | RIGHT_FOOT,

      PRIVATES = WAIST | INNER,

      LOWER_BODY = WAIST | ENTIRE_LEGS,

      ENTIRE_BODY = UPPER_BODY | LOWER_BODY,

      // Other combinations
      HAT_AREA = TOP_OF_HEAD,
      SHIRT_AREA = TORSO | SHOULDERS,
      SKIRT_AREA = WAIST | THIGHS,
      SHOE_AREA = FEET | ANKLES,
      BOOT_AREA = SHOE_AREA | CALVES,
    }
    export const enum ClothingState {
      // The different states of clothing that can be stored as `dynamicData` in the Inventory
      NOT_IN_USE = 0,
      IN_USE = 1 << 0,

      // ANCHOR - Clothing Durability Levels
      DURABILITY_LVL_1 = 1 << 1,
      DURABILITY_LVL_2 = 1 << 2,
      DURABILITY_LVL_3 = 1 << 3,
      DURABILITY_LVL_4 = 1 << 4,
      DURABILITY_LVL_5 = 1 << 5,
      DURABILITY_LVL_6 = 1 << 6,
      DURABILITY_LVL_7 = 1 << 7,
      DURABILITY_LVL_8 = 1 << 8,
      DURABILITY_LVL_9 = 1 << 9,
      DURABILITY_LVL_10 = 1 << 10,
      DURABILITY_LVL_11 = 1 << 11,
      DURABILITY_LVL_12 = 1 << 12,
      DURABILITY_LVL_13 = 1 << 13,
      DURABILITY_LVL_14 = 1 << 14,
      DURABILITY_LVL_15 = 1 << 15,
      DURABILITY_LVL_16 = 1 << 16,
      DURABILITY_LVL_17 = 1 << 17,
      DURABILITY_LVL_18 = 1 << 18,
      DURABILITY_LVL_19 = 1 << 19,
      DURABILITY_LVL_20 = 1 << 20,
      DURABILITY_LVL_21 = 1 << 21,
      DURABILITY_LVL_22 = 1 << 22,
      DURABILITY_LVL_23 = 1 << 23,
      DURABILITY_LVL_24 = 1 << 24,
      DURABILITY_LVL_25 = 1 << 25,
      DURABILITY_LVL_26 = 1 << 26,
      DURABILITY_LVL_27 = 1 << 27,
      DURABILITY_LVL_28 = 1 << 28,
      DURABILITY_LVL_29 = 1 << 29,
      DURABILITY_LVL_30 = 1 << 30,

      DURABILITY_STAGE_1 = DURABILITY_LVL_5 |
        DURABILITY_LVL_4 |
        DURABILITY_LVL_3 |
        DURABILITY_LVL_2 |
        DURABILITY_LVL_1,
      DURABILITY_STAGE_2 = DURABILITY_LVL_10 |
        DURABILITY_LVL_9 |
        DURABILITY_LVL_8 |
        DURABILITY_LVL_7 |
        DURABILITY_LVL_6,
      DURABILITY_STAGE_3 = DURABILITY_LVL_15 |
        DURABILITY_LVL_14 |
        DURABILITY_LVL_13 |
        DURABILITY_LVL_12 |
        DURABILITY_LVL_11,
      DURABILITY_STAGE_4 = DURABILITY_LVL_20 |
        DURABILITY_LVL_19 |
        DURABILITY_LVL_18 |
        DURABILITY_LVL_17 |
        DURABILITY_LVL_16,
      DURABILITY_STAGE_5 = DURABILITY_LVL_25 |
        DURABILITY_LVL_24 |
        DURABILITY_LVL_23 |
        DURABILITY_LVL_22 |
        DURABILITY_LVL_21,
      DURABILITY_STAGE_6 = DURABILITY_LVL_30 |
        DURABILITY_LVL_29 |
        DURABILITY_LVL_28 |
        DURABILITY_LVL_27 |
        DURABILITY_LVL_26,

      DURABILITY_WORN_OUT = DURABILITY_STAGE_1,
      DURABILITY_POOR = DURABILITY_STAGE_2 | DURABILITY_WORN_OUT,
      DURABILITY_OKAY = DURABILITY_STAGE_3 | DURABILITY_POOR,
      DURABILITY_GOOD = DURABILITY_STAGE_4 | DURABILITY_OKAY,
      DURABILITY_HIGH = DURABILITY_STAGE_5 | DURABILITY_GOOD,
      DURABILITY_EXCELLENT = DURABILITY_STAGE_6 | DURABILITY_HIGH,

      DEFAULT = DURABILITY_EXCELLENT | NOT_IN_USE,
    }
  }
}
