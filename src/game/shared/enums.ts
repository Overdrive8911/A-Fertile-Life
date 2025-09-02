/** biome-ignore-all lint/suspicious/noConstEnum: <I think my bundler should cover this> */

/** All the parts of the the body that a clothing can cover */
const enum BodyArea {
	NONE = 0,

	/** Any clothing item with this flag is for the inner body */
	INNER = 1 << 27,
	/** Represents a tattoo on any part of the body. And as such is considered  and ignores `INNER` by default */
	TATTOO = 1 << 28,

	TOP_OF_HEAD = 1 << 0,
	/** Technically, this will represent stuff like Glasses and makeup :p */
	FACE = 1 << 1,
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

	/** Also includes the knees */
	LEFT_THIGH = 1 << 19,
	/** May also include ankles */
	LEFT_CALF = 1 << 20,
	LEFT_ANKLE = 1 << 21,
	LEFT_FOOT = 1 << 22,
	/** Also includes the knees */
	RIGHT_THIGH = 1 << 23,
	/** May also include ankles */
	RIGHT_CALF = 1 << 24,
	RIGHT_ANKLE = 1 << 25,
	RIGHT_FOOT = 1 << 26,

	// 	UPPER_BACK = 1 << 27,
	// LOWER_BACK = 1 << 28,

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

const enum CharacterName {
	DUMMY = "???",

	/** This ain't really the player's name */
	PLAYER = "You",
	GIGI = "G.I.G.I",
}

const enum CharacterEmotion {
	NEUTRAL,
	HAPPY,
	SAD,
	ANGRY,
	SHOCK,
	BORED,
	SURPRISE,
	// Optional
	BRUH,
	EMBARRASSED,
	SUS,
	PANIC,
}

/** To keep track of all used class ids so I don't have issues later */
const enum ClassId {
	DATE_AND_TIME = "dateAndTime",
	BREASTS = "breasts",
	INVENTORY = "inventory",
	BASE_INVENTORY_ITEM = "inventoryItem",
	CONSUMABLE_INVENTORY_ITEM = "consumableInventoryItem",
	EQUIPPABLE_INVENTORY_ITEM = "equippableInventoryItem",
	CLOTHING_INVENTORY_ITEM = "clothingInventoryItem",
	WOMB = "womb",
	PREGNANCY = "preg",
	FETUS = "fetus",
}

const enum PositiveStatusEffect {
	EXP_GAIN_5_PERCENT = 1,
	EXP_GAIN_10_PERCENT,
	EXP_GAIN_25_PERCENT,
	EXP_GAIN_50_PERCENT,
	EXP_GAIN_100_PERCENT,

	HP_GAIN_5_PERCENT,
	HP_GAIN_10_PERCENT,
	HP_GAIN_25_PERCENT,
	HP_GAIN_50_PERCENT,
	HP_GAIN_100_PERCENT,

	WOMB_EXP_GAIN_5_PERCENT,
	WOMB_EXP_GAIN_10_PERCENT,
	WOMB_EXP_GAIN_25_PERCENT,
	WOMB_EXP_GAIN_50_PERCENT,
	WOMB_EXP_GAIN_100_PERCENT,

	WOMB_HP_GAIN_5_PERCENT,
	WOMB_HP_GAIN_10_PERCENT,
	WOMB_HP_GAIN_25_PERCENT,
	WOMB_HP_GAIN_50_PERCENT,
	WOMB_HP_GAIN_100_PERCENT,

	ENERGY_DRAIN_RESIST_5_PERCENT,
	ENERGY_DRAIN_RESIST_10_PERCENT,
	ENERGY_DRAIN_RESIST_25_PERCENT,
	ENERGY_DRAIN_RESIST_50_PERCENT,
	ENERGY_DRAIN_RESIST_100_PERCENT,

	MOOD_DRAIN_RESIST_5_PERCENT,
	MOOD_DRAIN_RESIST_10_PERCENT,
	MOOD_DRAIN_RESIST_25_PERCENT,
	MOOD_DRAIN_RESIST_50_PERCENT,
	MOOD_DRAIN_RESIST_100_PERCENT,
}

export {
	CharacterEmotion,
	CharacterName,
	ClassId,
	PositiveStatusEffect,
	BodyArea,
};
