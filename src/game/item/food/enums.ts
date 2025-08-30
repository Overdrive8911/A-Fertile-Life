/** biome-ignore-all lint/suspicious/noConstEnum: <My build process will replace this> */

export const enum FoodEffectType {
	/** Also heals the womb by 30% */
	HEAL_HP = 1,

	/** Heal the womb primarily, but also heal the player by 30% */
	HEAL_WOMB,

	/** Also drain the womb by 30% */
	DRAIN_HP,

	/** Drains the womb primarily, but also drain the player by 30% */
	DRAIN_WOMB,

	/** Heals mood */
	HEAL_MOOD,

	/** Drains mood */
	DRAIN_MOOD,

	/** Heals fullness*/
	HEAL_FULLNESS,

	/** Drains fullness */
	DRAIN_FULLNESS,

	/** Adds experience relative to the total amount of exp needed to advance to the next level. */
	ADD_EXP,

	/** Removes experience relative to the total amount of exp needed to advance to the next level */
	DRAIN_EXP,
}
