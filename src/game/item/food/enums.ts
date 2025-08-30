/** biome-ignore-all lint/suspicious/noConstEnum: <My build process will replace this> */

const enum FoodEffect {
	// SECTION - Healing Effects. These also heal the womb by 30%
	HEAL_HP_1 = 1,
	HEAL_HP_5,
	HEAL_HP_10,
	HEAL_HP_25,
	HEAL_HP_50,
	HEAL_HP_75,
	HEAL_HP_100,

	// ANCHOR - These heal the womb primarily, but also heal the player by 30%
	HEAL_WOMB_1,
	HEAL_WOMB_5,
	HEAL_WOMB_10,
	HEAL_WOMB_25,
	HEAL_WOMB_50,
	HEAL_WOMB_75,
	HEAL_WOMB_100,
	// !SECTION

	// SECTION - Draining Effects. These also drain the womb by 30%
	DRAIN_HP_1,
	DRAIN_HP_5,
	DRAIN_HP_10,
	DRAIN_HP_25,
	DRAIN_HP_50,
	DRAIN_HP_75,
	DRAIN_HP_100,

	// ANCHOR - These drain the womb primarily, but also drain the player by 30%
	DRAIN_WOMB_1,
	DRAIN_WOMB_5,
	DRAIN_WOMB_10,
	DRAIN_WOMB_25,
	DRAIN_WOMB_50,
	DRAIN_WOMB_75,
	DRAIN_WOMB_100,
	// !SECTION

	// SECTION - Mood Effects
	HEAL_MOOD_1,
	HEAL_MOOD_5,
	HEAL_MOOD_10,
	HEAL_MOOD_25,
	HEAL_MOOD_50,
	HEAL_MOOD_75,
	HEAL_MOOD_100,
	// !SECTION

	// SECTION - Mood Draining Effects
	DRAIN_MOOD_1,
	DRAIN_MOOD_5,
	DRAIN_MOOD_10,
	DRAIN_MOOD_25,
	DRAIN_MOOD_50,
	DRAIN_MOOD_75,
	DRAIN_MOOD_100,

	// SECTION - Hunger Effects. If not explicitly provided, the food item will heal fullness by 10%
	HEAL_FULLNESS_1,
	HEAL_FULLNESS_5,
	HEAL_FULLNESS_10,
	HEAL_FULLNESS_25,
	HEAL_FULLNESS_50,
	HEAL_FULLNESS_75,
	HEAL_FULLNESS_100,
	// !SECTION

	// SECTION - Hunger Draining Effects
	DRAIN_FULLNESS_1,
	DRAIN_FULLNESS_5,
	DRAIN_FULLNESS_10,
	DRAIN_FULLNESS_25,
	DRAIN_FULLNESS_50,
	DRAIN_FULLNESS_75,
	DRAIN_FULLNESS_100,
	// !SECTION

	// SECTION - EXP Effects. These add a percentage of exp relative to the total amount of exp needed to advance to the next level. If not specific, defaults to 1% exp
	ADD_EXP_1,
	ADD_EXP_5,
	ADD_EXP_10,
	ADD_EXP_25,
	ADD_EXP_50,
	ADD_EXP_75,
	ADD_EXP_100,

	// SECTION - EXP Draining Effects. These remove a percentage of exp relative to the total amount of exp needed to advance to the next level
	DRAIN_EXP_1,
	DRAIN_EXP_5,
	DRAIN_EXP_10,
	DRAIN_EXP_25,
	DRAIN_EXP_50,
	DRAIN_EXP_75,
	DRAIN_EXP_100,
}

export { FoodEffect };
