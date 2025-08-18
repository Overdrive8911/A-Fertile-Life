/** biome-ignore-all lint/suspicious/noConstEnum: <I think my bundler should cover this> */
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
	INVENTORY_ITEM = "inventoryItem",
	WOMB = "womb",
	PREGNANCY = "preg",
	FETUS = "fetus",
}

export { CharacterEmotion, CharacterName, ClassId };
