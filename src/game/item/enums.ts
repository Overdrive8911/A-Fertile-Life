/** biome-ignore-all lint/suspicious/noConstEnum: <:3> */
const enum ItemId {
	DUMMY,

	// Food
	CHEESE,
	MOULDY_CHEESE,

	// Key Cards
	/** Basic rooms like cleaning supplies and the PC office. PC gets handed this at the beginning */
	KEYCARD_LVL_1,
	/** Better prices at the shops and better food (just an upgrade) */
	KEYCARD_LVL_2,
	/** Allowed into major places like the Nursery */
	KEYCARD_LVL_3,
	/** Access to all drugs and items as well as the Underground */
	KEYCARD_LVL_4,
	/** Dunno. Will be unobtainable irl for a while */
	KEYCARD_LVL_5,

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
const enum ItemTag {
	DUMMY,
	ALL, // Don't give this tag to anything. It applies to every item already
	KEY_ITEM,
	FOOD,
	CLOTHING,
	MISCELLANEOUS,
	DRUGS,
	TRASH,
}

// Maybe I could turn these to numbers and use a method to generate the appropriate strings?
const enum ItemColor {
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

export { ItemColor, ItemId, ItemTag };
