import { createMutable } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { GAME_ENGINE, GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import { getRandomIntegerInRange } from "~/game/shared/utils";
import { clamp } from "~/utils/math";
import {
	type FetalGrowthStatsEnum,
	FetusSpecies,
	GestationalWeek,
	PregConstants,
	WombHealth,
} from "../enums";
import type { Gender } from "../types";
import { getWombVolumeFromFetusStats } from "../utils";
import {
	type DevelopmentRatio,
	gFetalGrowthOverGestationalWeeks,
} from "../variables";
import type { Pregnancy } from "./pregnancy";

/**
 * A value of 1 produces "normal" growth
 */
const growthRateValues = [
	0.97, 0.975, 0.98, 0.985, 0.99, 0.995, 1, 1, 1, 1, 1, 1.005, 1.01, 1.015,
	1.02, 1.025, 1.03, 1.035,
] as const;

export class Fetus implements SugarBoxCompatibleClassInstance<SerializedFetus> {
	/**
	 * decides the gender, growthRate, weight, and height
	 */
	readonly id: number;

	/**
	 * scales with the womb's health. don't let it get to zero
	 */
	hp: number;

	/** When this fetus was created */
	conception: Date;

	/** Development Ratio
	 *
	 * e.g 50%, 23%, 87%, 100%
	 */
	devRatio: DevelopmentRatio;

	/** Only useful when trying to update the fetus's stats as time passes */
	lastDevRatio: DevelopmentRatio = 0;

	/**
	 * A modifier multiplied to the fetus's growth rate. Comes from other sources
	 */
	growthMod = 1;

	// NOTE - ANY CHANGES TO THE FOLLOWING THREE PROPERTIES MUST BE REFLECTED IN `FetalGrowthStatsEnum`

	/**
	 * in grams e.g 360, 501, 600
	 */
	weight: number;

	/**
	 * in cm e.g 11.38, 10.94
	 */
	height: number;

	/**
	 * The amount of amniotic fluid generated per fetus. It is successively less with more fetuses and used to finally calculate the belly size
	 */
	fluid: number;
	/**
	 * In the off-chance that I add non-human preg, this will store values from an enum containing the possible species to be impregnated with
	 */
	species = FetusSpecies.HUMAN;

	/** The pregnancy that spawned this fetus */
	readonly pregnancy: Pregnancy;

	static classId = ClassId.FETUS;

	static fromJSON(pregnancy: Pregnancy, data: SerializedFetus): Fetus {
		return Object.assign(new Fetus(pregnancy), data);
	}

	constructor(pregnancy: Pregnancy) {
		/** A number between 0 and PregConstants.NUM_OF_POSSIBLE_FETUS_IDS */
		const fetusId =
			((GAME_ENGINE.random + Math.random()) % 1) *
			PregConstants.NUM_OF_POSSIBLE_FETUS_IDS;

		pregnancy.fetuses.set(fetusId, this);

		this.pregnancy = pregnancy;

		this.id = fetusId;

		this.hp = WombHealth.FULL_VITALITY;

		this.devRatio = PregConstants.MIN_DEVELOPMENT_STATE;

		const val = fetusId / 10 ** 9;

		// Just trying to get an arbitrarily small number
		this.height = val;
		this.weight = val;
		this.fluid = val;
		this.conception = GAME_VARIABLES.gameDateAndTime.date;

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	toJSON(): SerializedFetus {
		return {
			conception: this.conception,
			devRatio: this.devRatio,
			lastDevRatio: this.lastDevRatio,
			fluid: this.fluid,
			height: this.height,
			hp: this.hp,
			id: this.id,
			species: this.species,
			weight: this.weight,
			growthMod: this.growthMod,
		};
	}

	get gender(): Gender {
		const id = this.id;

		if (id < 0.05 * (PregConstants.NUM_OF_POSSIBLE_FETUS_IDS - 1)) return "I";
		else if (
			id >= 0.05 * (PregConstants.NUM_OF_POSSIBLE_FETUS_IDS - 1) &&
			id < 0.5 * (PregConstants.NUM_OF_POSSIBLE_FETUS_IDS - 1)
		)
			return "F";
		else return "M";
	}

	get growthRate() {
		// biome-ignore lint/style/noNonNullAssertion: <Will not be null>
		return growthRateValues[this.id % growthRateValues.length]!;
	}

	get #pregDurationModifier() {
		const womb = this.pregnancy.womb;

		/** NOTE - A steady growth rate of ~1.0 means roughly 10 months (26,280,028.8) of gestation while one of ~10 would mean roughly 1 (2,628,002.88) month of gestation. So a rate of 1.2 would mean (26,280,028.8 / 1.2) seconds */
		let modifier = 1;

		// Account for the fetus's growth rate
		modifier /= this.growthRate;

		//  Account for the womb health. Lower hp make pregnancies slightly longer
		modifier *= clamp(Math.sqrt(womb.maxHp / womb.hp), 1, 1.2);

		// x10 faster pregnancies for the player since the player's own is 10
		modifier /= womb.growthMod;

		// Account for the fetus's own growth mod
		modifier /= this.growthMod;

		return modifier;
	}

	/** The effective total time it takes for the fetus to mature fully */
	get gestationDuration() {
		return this.#pregDurationModifier * PregConstants.DEFAULT_PREGNANCY_LENGTH;
	}

	get gestationalWeek() {
		return Math.floor(
			(this.devRatio / PregConstants.MAX_DEVELOPMENT_STATE) *
				PregConstants.NUM_OF_GESTATIONAL_WEEKS,
		);
	}

	/** This is the "real" space a fetus consumes in the womb */
	get volume() {
		return getWombVolumeFromFetusStats(this.height, this.weight, this.fluid);
	}

	/** Give it 2 development ratios (with the 2nd one always being larger) and the required stat, and then it'll return how much of that particular stat should be increased.
	 *
	 * // NOTE - What this function basically does is (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) which will usually give non-integer values. When Math.floor()'d, it gives up the most recent gestational week and we can pick a stat from there (call this value X). However, in order to be truly accurate, we also consider the truncated non-integer component of (developmentRatio/gMaxDevelopmentState * gNumOfGestationalWeeks) by having the truncated value be subtracted from the regular result of that expression (e.g 7.8673029 - 7) and multiply this result with the difference of the required stats for the gestational week in use and the next one (e.g gestational week 7 and gestational week 8. Also call this value Y). Now, adding X and Y should give something quite accurate, so do this for both development ratios and return the difference between their values.*/
	static calcGrowthStatChange(
		oldDevRatio: DevelopmentRatio,
		newDevRatio: DevelopmentRatio,
		stat: FetalGrowthStatsEnum,
	) {
		if (oldDevRatio === newDevRatio) return 0;
		let oldStat = 0;
		let newStat = 0;

		oldStat = getAccurateFetalStatForDevelopmentStage(stat, oldDevRatio);
		newStat = getAccurateFetalStatForDevelopmentStage(stat, newDevRatio);

		return newStat - oldStat;
	}
}

function getStatForGestationalWeekInOverduePregnancy(
	overdueGestWeek: number,
	stat: FetalGrowthStatsEnum,
) {
	// Use the average stat difference (and a bit of variation) to get a result for overdue pregnancies that don't have an entry in gFetalGrowthOverGestationalWeeks[]

	let averageStatDiffInLastFourWeeksOfPregnancy = 0;
	let overdueStatDiffToAdd = 0;
	const numOfWeeksToGetAverageFor = 4;

	if (overdueGestWeek <= GestationalWeek.MAX)
		overdueGestWeek = GestationalWeek.MAX + 1;

	// Get the average stat gain over the last 4~5 weeks
	for (let i = 0; i <= numOfWeeksToGetAverageFor; i++) {
		const gestationalWeekArrayIndex: GestationalWeek = GestationalWeek.MAX - i;
		const precedingGestationalWeekArrayIndex: GestationalWeek =
			GestationalWeek.MAX - (i + 1);

		averageStatDiffInLastFourWeeksOfPregnancy +=
			gFetalGrowthOverGestationalWeeks[gestationalWeekArrayIndex][stat] -
			gFetalGrowthOverGestationalWeeks[precedingGestationalWeekArrayIndex][
				stat
			];
	}
	averageStatDiffInLastFourWeeksOfPregnancy /= numOfWeeksToGetAverageFor;

	// Reduce it by around 66% since growth now would be much slower. This deduction is just to make things more believable
	averageStatDiffInLastFourWeeksOfPregnancy *=
		PregConstants.OVERDUE_STAT_MULTIPLIER;

	// Multiply the average with the extra weeks that have passed while overdue
	overdueStatDiffToAdd =
		averageStatDiffInLastFourWeeksOfPregnancy *
		(overdueGestWeek - GestationalWeek.MAX);

	// Add some variation
	overdueStatDiffToAdd = getRandomIntegerInRange(
		overdueStatDiffToAdd - overdueStatDiffToAdd * 0.15,
		overdueStatDiffToAdd + overdueStatDiffToAdd * 0.15,
	);

	return (
		gFetalGrowthOverGestationalWeeks[GestationalWeek.MAX][stat] +
		overdueStatDiffToAdd
	);
}

function getAccurateFetalStatForDevelopmentStage(
	stat: FetalGrowthStatsEnum,
	devRatio: DevelopmentRatio,
) {
	let fetalStat = 0;

	const gestationalWeek: GestationalWeek =
		(devRatio / PregConstants.MAX_DEVELOPMENT_STATE) *
		PregConstants.NUM_OF_GESTATIONAL_WEEKS;

	const gestationalWeekFloor: GestationalWeek = Math.floor(gestationalWeek);

	// Need a better name for this
	const extraDurationAsFloat = gestationalWeek - gestationalWeekFloor;

	if (gestationalWeek < GestationalWeek.One) {
		return 0;
	} else if (
		gestationalWeek < PregConstants.NUM_OF_GESTATIONAL_WEEKS &&
		gestationalWeek + 1 < PregConstants.NUM_OF_GESTATIONAL_WEEKS
	) {
		const gestationalWeekStat =
			gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][stat];
		fetalStat =
			gestationalWeekStat +
			(gFetalGrowthOverGestationalWeeks[
				(gestationalWeekFloor + 1) as GestationalWeek
			][stat] -
				gestationalWeekStat) *
				extraDurationAsFloat;
	} else if (
		gestationalWeek <= PregConstants.NUM_OF_GESTATIONAL_WEEKS &&
		gestationalWeek + 1 > PregConstants.NUM_OF_GESTATIONAL_WEEKS
	) {
		const gestationalWeekStat =
			gFetalGrowthOverGestationalWeeks[gestationalWeekFloor][stat];
		fetalStat =
			gestationalWeekStat +
			(getStatForGestationalWeekInOverduePregnancy(
				gestationalWeekFloor + 1,
				stat,
			) -
				gestationalWeekStat) *
				extraDurationAsFloat;
	} else if (gestationalWeek > PregConstants.NUM_OF_GESTATIONAL_WEEKS) {
		const gestationalWeekStat = getStatForGestationalWeekInOverduePregnancy(
			gestationalWeekFloor,
			stat,
		);
		fetalStat =
			gestationalWeekStat +
			(getStatForGestationalWeekInOverduePregnancy(
				gestationalWeekFloor + 1,
				stat,
			) -
				gestationalWeekStat) *
				extraDurationAsFloat;
	}
	console.log(
		`devRatio: ${devRatio}, gestationalWeek: ${gestationalWeekFloor}, fetalStat: ${fetalStat}`,
	);

	return fetalStat;
}

type SerializedFetus = {
	id: number;
	hp: number;
	conception: Date;
	devRatio: DevelopmentRatio;
	lastDevRatio: DevelopmentRatio;
	growthMod: number;
	weight: number;
	height: number;
	fluid: number;
	species: FetusSpecies;
};
