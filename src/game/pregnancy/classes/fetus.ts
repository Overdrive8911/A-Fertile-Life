import QuickLRU from "quick-lru";
import { createMutable } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import { getRandomFloatInRange } from "~/game/shared/utils";
import { clamp, isFloat, withinBounds } from "~/utils/math";
import {
	FetusSpecies,
	GestationalWeek,
	PregConstants,
	WombHealth,
} from "../enums";
import type { FetalGrowthStats, Gender } from "../types";
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
		return Object.assign(new Fetus(pregnancy, data.id), data);
	}

	constructor(pregnancy: Pregnancy, fetusId: number) {
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

	/** Readonly growth rate of a fetus decided by it's id */
	get growthRate() {
		// biome-ignore lint/style/noNonNullAssertion: <Will not be null>
		return growthRateValues[this.id % growthRateValues.length]!;
	}

	private get _pregDurationModifier() {
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

	/** Gestation Duration. The effective total time it takes for the fetus to mature fully */
	get gestDuration() {
		return this._pregDurationModifier * PregConstants.DEFAULT_PREGNANCY_LENGTH;
	}

	/** Gestational week, rounded down */
	get gestWeek() {
		return Math.floor(
			(this.devRatio / PregConstants.MAX_DEVELOPMENT_STATE) *
				PregConstants.NUM_OF_GESTATIONAL_WEEKS,
		);
	}

	/** This is the "real" space a fetus consumes in the womb */
	get volume() {
		return getWombVolumeFromFetusStats(this.height, this.weight, this.fluid);
	}

	/**
	 * To know how much to add to a fetus's stats between 2 development ratios
	 *
	 * @returns an object containing the difference in stats
	 */
	static calcGrowthStatChange(
		oldDevRatio: DevelopmentRatio,
		newDevRatio: DevelopmentRatio,
	): FetalGrowthStats {
		if (oldDevRatio === newDevRatio) return { fluid: 0, height: 0, weight: 0 };

		const oldStat = getFetusStatsAtDevelopmentRatio(oldDevRatio);
		const newStat = getFetusStatsAtDevelopmentRatio(newDevRatio);

		return {
			fluid: newStat.fluid - oldStat.fluid,
			height: newStat.height - oldStat.height,
			weight: newStat.weight - oldStat.weight,
		};
	}
}

const overdueStatCache = new QuickLRU<number, FetalGrowthStats>({
	maxSize: 250,
});

/**
 * @param gestationalWeek must be an integer
 */
function getFetusStatsAtSpecificGestationalWeek(
	gestationalWeek: number,
): FetalGrowthStats {
	if (isFloat(gestationalWeek))
		throw Error(`Gestatinal week ${gestationalWeek} is not a float`);

	if (withinBounds(gestationalWeek, GestationalWeek.MIN, GestationalWeek.MAX)) {
		return gFetalGrowthOverGestationalWeeks[gestationalWeek as GestationalWeek];
	}

	// Overdue stat calculations
	const cachedOverdueStats = overdueStatCache.get(gestationalWeek);

	if (cachedOverdueStats) return cachedOverdueStats;

	const WEEK_RANGE = 8;

	// Get the stats from the last eight weeks and calculate the average stat change
	const lastEightWeekStats = Array.from({ length: WEEK_RANGE }, (_, i) =>
		getFetusStatsAtSpecificGestationalWeek(gestationalWeek - (i + 1)),
	);

	const {
		fluid: cumulativeFluidSum,
		height: cumulativeHeightSum,
		weight: cumulativeWeightSum,
	} = lastEightWeekStats.reduce<FetalGrowthStats>(
		(acc, { fluid, height, weight }) => {
			acc.fluid += fluid;
			acc.height += height;
			acc.weight += weight;

			return acc;
		},
		{ fluid: 0, height: 0, weight: 0 },
	);

	const {
		fluid: averagedFluidStat,
		height: averagedHeightStat,
		weight: averagedWeightStat,
	}: FetalGrowthStats = {
		fluid: cumulativeFluidSum / WEEK_RANGE,
		height: cumulativeHeightSum / WEEK_RANGE,
		weight: cumulativeWeightSum / WEEK_RANGE,
	};

	// Boost the stats by a bit
	const tweakedStats: FetalGrowthStats = {
		fluid:
			averagedFluidStat +
			averagedFluidStat *
				getRandomFloatInRange(0, PregConstants.OVERDUE_STAT_MULTIPLIER),
		height:
			averagedHeightStat +
			averagedHeightStat *
				getRandomFloatInRange(0, PregConstants.OVERDUE_STAT_MULTIPLIER),
		weight:
			averagedWeightStat +
			averagedWeightStat *
				getRandomFloatInRange(0, PregConstants.OVERDUE_STAT_MULTIPLIER),
	};

	// Cache the stats
	overdueStatCache.set(gestationalWeek, tweakedStats);

	return tweakedStats;
}

function getFetusStatsAtDevelopmentRatio(devRatio: number): FetalGrowthStats {
	const gestationalWeekAsFloat =
		(devRatio / PregConstants.MAX_DEVELOPMENT_STATE) *
		PregConstants.NUM_OF_GESTATIONAL_WEEKS;

	// // This situation will likely be too uncommon
	// if (!isFloat(gestationalWeekAsFloat)) return getFetusStatsAtSpecificGestationalWeek(gestationalWeekAsFloat)

	const gestationalWeekRoundedDown = Math.floor(gestationalWeekAsFloat);

	const roundingDiff = gestationalWeekAsFloat - gestationalWeekRoundedDown;

	const gestationalWeekRoundedDownStat = getFetusStatsAtSpecificGestationalWeek(
			gestationalWeekRoundedDown,
		),
		gestationalWeekRoundedUpStat = getFetusStatsAtSpecificGestationalWeek(
			gestationalWeekRoundedDown + 1,
		);

	const roundingStatDiff: FetalGrowthStats = {
		fluid:
			(gestationalWeekRoundedUpStat.fluid -
				gestationalWeekRoundedDownStat.fluid) *
			roundingDiff,
		height:
			(gestationalWeekRoundedUpStat.height -
				gestationalWeekRoundedDownStat.height) *
			roundingDiff,
		weight:
			(gestationalWeekRoundedUpStat.weight -
				gestationalWeekRoundedDownStat.weight) *
			roundingDiff,
	};

	return {
		fluid: gestationalWeekRoundedDownStat.fluid + roundingStatDiff.fluid,
		height: gestationalWeekRoundedDownStat.height + roundingStatDiff.height,
		weight: gestationalWeekRoundedDownStat.weight + roundingStatDiff.weight,
	};
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
