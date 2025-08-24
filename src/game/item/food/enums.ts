/** biome-ignore-all lint/suspicious/noConstEnum: <My build process will replace this> */

const enum FoodEffect {
	// SECTION - Healing Effects. These also heal the womb by 30%
	HEAL_HP_10 = 1,
	HEAL_HP_25,
	HEAL_HP_50,
	HEAL_HP_75,
	HEAL_HP_100,

	// ANCHOR - These heal the womb primarily, but also heal the player by 30%
	HEAL_WOMB_25,
	HEAL_WOMB_50,
	HEAL_WOMB_75,
	HEAL_WOMB_100,
	// !SECTION

	// SECTION - Mood Effects
	HEAL_MOOD_10,
	HEAL_MOOD_25,
	HEAL_MOOD_50,
	HEAL_MOOD_75,
	HEAL_MOOD_100,
	// !SECTION

	HEAL_HP_AND_MOOD_10,
	HEAL_HP_AND_MOOD_25,
	HEAL_HP_AND_MOOD_50,
	HEAL_HP_AND_MOOD_75,
	HEAL_HP_AND_MOOD_100,

	// SECTION - Hunger Effects. If not explicitly provided, the food item will heal fullness by 10%
	HEAL_FULLNESS_10,
	HEAL_FULLNESS_25,
	HEAL_FULLNESS_50,
	HEAL_FULLNESS_75,
	HEAL_FULLNESS_100,
	// !SECTION

	// SECTION - EXP Effects. These add a percentage of exp relative to the total amount of exp needed to advance to the next level. If not specific, defaults to 1% exp
	ADD_EXP_1,
	ADD_EXP_5,
	ADD_EXP_10,
	ADD_EXP_25,
	ADD_EXP_50,
	ADD_EXP_75,
	ADD_EXP_100,
}

export { FoodEffect };
