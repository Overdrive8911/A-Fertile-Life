export const enum CustomEventName {
	TIME_UPDATE = "@timeUpdate",
	SCENE_START = "@sceneStart",
	SCENE_PROGRESS = "@sceneProgress",
	SCENE_END = "@sceneEnd",
}

export const enum CustomMacro {
	METER = "meter",
}

export const enum Default {
	MAX_STAT = 100,
}

// TODO: Add more relevant characters here
export const enum CharacterName {
	DUMMY = "Dummy",
	/** This sin't really the player's name */
	PLAYER = "P",
	GIGI = "G.I.G.I",
}

export const enum CharacterEmotion {
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
}
