import { ReactiveMap } from "@solid-primitives/map";
import { createMutable } from "solid-js/store";
import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import type { Player } from "~/game/character/class/player";
import { GAME_RANDOM, GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import {
	getDominantAverage,
	getRandomFloatInRange,
	getRandomIntegerInRange,
} from "~/game/shared/utils";
import type { UUID } from "~/types/uuid";
import { either } from "~/utils/iterable";
import { clamp } from "~/utils/math";
import { FertilityLevel, PregConstants, WombHealth } from "../enums";
import { WombStateMachine } from "../state-machine/womb-stage";
import type {
	PregPerkDynamicData,
	PregPerkStaticData,
	PregPerksObject,
	PregSideEffectDynamicData,
	PregSideEffectStaticData,
	PregSideEffectsObject,
} from "../types";
import { BellySize, WombExpLimit } from "../variables";
import type { Fetus } from "./fetus";
import { Pregnancy } from "./pregnancy";

/**
 * Pregnancy capacity and duration guidelines:
 * - A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions
 * - A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has
 * - The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has
 * - Capacity is in cubic centimetres(CCs)
 */
export class Womb implements SugarBoxCompatibleClassInstance<SerializedWomb> {
	/**
	 * Unhealthy wombs gestate slower. It slowly reduces with time while pregnant but will only get critically low if the user doesn't take care of themselves. Going beyond womb.comfortCapacity, and to a much higher extent with womb.maxCapacity, consumes more hp. The PC's womb will give out at 0hp. Heals overnight while sleeping, with drugs, womb treatments, or eating
	 */
	hp: number = PregConstants.DEFAULT_MAX_WOMB_HP;
	maxHp: number = PregConstants.DEFAULT_MAX_WOMB_HP;

	private _fertility = FertilityLevel.AVERAGE_FERTILITY;

	// These capacity variables also refer to the "size too"
	/**
	 * Determines the size of her pregnancy, going too far beyond womb.maxCapacity can cause the babies to be 'skin-wrapped'
	 */
	curCap: BellySize = BellySize.FLAT;
	/**
	 * How big she can get without losing any comfort. Slowly increases as womb.exp increases
	 */
	private _comfortCap: BellySize = BellySize.FULL_TERM;
	/**
	 * How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks
	 */
	private _maxCap = BellySize.FULL_TERM + BellySize.LATE_PREGNANCY;

	/**
   * Increases when pregnant; the amount depends on size and number of fetuses, `womb.curCapacity`, `womb.comfortCapacity` and `womb.maxCapacity`. Increases faster once `womb.curCapacity` nears womb.comfortCapacity and even faster when it goes beyond it; basically the ratio of `womb.curCapacity`/`womb.comfortCapacity` (and `womb.curCapacity`/`womb.maxCapacity` when the former is high enough) decides how fast exp increases. Once it surpasses the limit for `womb.lvl`, levels up her womb. Some types of food, drugs, treatments and perks increase its rate of gain. Slowly decreases when not pregnant.

      Higher levels have higher capacities, the ability to use stronger and higher level perks, and a lower rate of hp loss. Exp levels can be found in the enum `WombExpLimit`
   */
	exp = 0;

	/**
	 * Time in seconds until the womb is no longer in post partum.
	 *
	 * Postpartum only occurs if the womb is empty after a birth.
	 */
	postpartum = 0;

	birthControl = false;

	/**
	 * Number of times the user has given birth
	 */
	birthRecord = 0;

	/**
	 * The date when the womb was last impregnated
	 */
	lastFertilized: Date | null = null;
	/**
	 * The date of the last birth
	 */
	lastBirth: Date | null = null;

	/** A multiplier that affects the growth rate of the fetuses, the player's own is x10 */
	growthMod = 1;

	perks: PregPerksObject<PregPerkDynamicData> = {};

	sideEffects: PregSideEffectsObject<PregSideEffectDynamicData> = {};

	pregnancies = new ReactiveMap<UUID, Pregnancy>();

	private _stateMachine = new WombStateMachine(this);

	static classId = ClassId.WOMB;

	/** Its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant.
	 *
	 * Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility.
	 *
	 * Each perk is an object of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level.
	 *
	 * TODO - Change the prices later to something more reasonable. Also, add more perks
	 */
	static readonly perks = {
		/** Increases the speed of pregnancies, but makes and keeps the user hungrier. At the maximum level, pregnancy duration sped up by `gGestatorPerkMaxSpeedBoost` and additional hunger drain is always 30% of that. */
		gestator: {
			price: 5000,
			maxLevel: 10,
		},
		/** Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */
		hyperFertility: {
			price: 3000,
			maxLevel: 5,
		},
		/** Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */
		superFet: {
			price: 15000,
			maxLevel: 5,
		},
		/** Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */
		elasticity: {
			price: 7000,
			maxLevel: 10,
		},
		/** Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */
		immunityBoost: {
			price: 2000,
			maxLevel: 5,
		},
		/** Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */
		motherlyHips: {
			price: 5000,
			maxLevel: 5,
		},
		/** Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */
		motherlyBoobs: {
			price: 5000,
			maxLevel: 5,
		},
		/** Can carry bigger pregnancies and more weight before becoming bed bound */
		ironSpine: {
			price: 7000,
			maxLevel: 5,
		},
		/** Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */
		sensitiveWomb: {
			price: 6000,
			maxLevel: 5,
		},
		/** Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */
		healthyWomb: {
			price: 3000,
			maxLevel: 10,
		},
		/** Raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */
		fortifiedWomb: {
			price: 10000,
			maxLevel: 5,
		},
		/** Reduces the postpartum period, completely erasing it at max. Is only useful when activated before giving birth, that is, activating this perk during the postpartum period does nothing (Note that the PC has a recovery period of a week) */
		noPostpartum: {
			price: 2000,
			maxLevel: 10,
		},
		/** Increases amniotic fluid production per fetus */
		polyhydramnios: {
			price: 1500,
			maxLevel: 10,
		},
	} as const satisfies Required<PregPerksObject<PregPerkStaticData>>;

	/** Most can occur anytime in a pregnancy after 20% of fetal development is achieved and usually reduce performance or do some other undesirable stuff until they leave. Upgrading some perks can cause them to become stronger.
	 *
	 * TODO - Add more side effects
	 */
	static readonly sideEffects = {
		/* Constantly reduces some stats and benefits of food until a randomly generated craving is satisfied. */
		cravingCrisis: {
			maxDuration: [1, 2],
		},

		/* Reduces the amount of fullness food gives and allows fullness to be exceeded to a randomly generated extent. The user suffers penalties in stats and productivity if their . */
		motherHunger: {
			maxDuration: [1, 2, 3],
		},

		/* Drains energy faster and increases the energy cost of actions. Also reduces concentration and efficiency at work. The user will have to temporarily soother their children a lot. */
		restlessBrood: {
			maxDuration: [2, 3],
		},

		/* Reduces non-vehicle movement speed and drains energy faster. Trying to do work in this condition may extend it. */
		heavyWomb: {
			maxDuration: [3, 5, 7],
		},

		/* Happens randomly around the user's due date and takes a small cut out of their stats. It also has the user stunned in place temporarily. */
		contractions: {
			maxDuration: [1, 2, 3, 5],
		},

		/* Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */
		labour: {
			maxDuration: [3],
		},

		// /* Maxes out arousal once a day and keeps it above 75 */
		// sexCraving: {
		// 	maxDuration: [1, 3],
		// },

		/* Can happen whenever the user does a lot of stuff that attributes to the growth of their pregnancy. This will happen around 12pm or 12am */
		growthSpurt: {
			maxDuration: [1, 2, 3],
		},
	} as const satisfies Required<
		PregSideEffectsObject<PregSideEffectStaticData>
	>;

	private _setDataFromSerializedWomb(data: Partial<SerializedWomb>) {
		const {
			birthRecord = this.birthRecord,
			comfortCap = this._comfortCap,
			curCap = this.curCap,
			exp = this.exp,
			fertility = this._fertility,
			growthMod = this.growthMod,
			hp = this.hp,
			lastBirth = this.lastBirth,
			lastFertilized = this.lastFertilized,
			maxCap = this._maxCap,
			maxHp = this.maxHp,
			birthControl = this.birthControl,
			perks = this.perks,
			postpartum = this.postpartum,
			pregnancies,
			sideEffects = this.sideEffects,
		} = data;

		this._comfortCap = comfortCap;
		this._maxCap = maxCap;
		this.birthRecord = birthRecord;
		this.curCap = curCap;
		this.exp = exp;
		this._fertility = fertility;
		this.growthMod = growthMod;
		this.hp = hp;
		this.lastBirth = lastBirth;
		this.lastFertilized = lastFertilized;
		this.maxHp = maxHp;
		this.birthControl = birthControl;
		this.perks = perks;
		this.postpartum = postpartum;

		if (pregnancies)
			this.pregnancies = new ReactiveMap(
				pregnancies
					.entries()
					.map(([pregId, serializedPreg]) => [
						pregId,
						Pregnancy.fromJSON(this, serializedPreg),
					]),
			);
		this.sideEffects = sideEffects;
	}

	static fromJSON(data: SerializedWomb): Womb {
		const womb = new Womb();

		womb._setDataFromSerializedWomb(data);

		return womb;
	}

	constructor(wombData?: Partial<Womb>) {
		if (wombData) {
			this._setDataFromSerializedWomb(wombData);
		}

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	toJSON(): SerializedWomb {
		return {
			hp: this.hp,
			maxHp: this.maxHp,
			fertility: this._fertility,
			curCap: this.curCap,
			comfortCap: this._comfortCap,
			maxCap: this._maxCap,
			exp: this.exp,
			postpartum: this.postpartum,
			birthControl: this.birthControl,
			birthRecord: this.birthRecord,
			lastFertilized: this.lastFertilized,
			lastBirth: this.lastBirth,
			growthMod: this.growthMod,
			perks: this.perks,
			sideEffects: this.sideEffects,
			pregnancies: new Map(
				this.pregnancies
					.entries()
					.map(([pregId, preg]) => [pregId, preg.toJSON()]),
			),
		};
	}

	/** A floating number between 0 and 1 */
	get hpRatio() {
		return this.hp / this.maxHp;
	}

	get isPregnant() {
		// There is at least one pregnancy
		if (this.pregnancies.size > 0) return true;
		else return false;
	}

	get isPostPartum(): boolean {
		return !!this.postpartum;
	}

	/**
	 * Attempts to create a pregnancy of fetus(es)
	 *
	 * @param virility - 0 to 100
	 * @param virilityBonus - 0 to 50
	 * @param forcedFetusCount - if given, pregnancy is forced regardless
	 * @returns
	 */
	tryCreatePregnancy(
		virility: number,
		virilityBonus = 0,
		forcedFetusCount = 0,
	): boolean {
		if (this.isPostPartum) return false;

		// Skip all checks if forcing pregnancy
		if (forcedFetusCount > 0) {
			return this._createPregnancy(forcedFetusCount);
		}

		// Simple conception check
		if (!this._canConcieve(virility, virilityBonus)) {
			return false;
		}

		// Determine number of fetuses
		const fetusCount = this._determineFetusCount(virility, virilityBonus);

		return this._createPregnancy(fetusCount);
	}

	private _canConcieve(virility: number, virilityBonus: number): boolean {
		const fertility = this.fertility;

		if (!fertility || !virility) return false;

		// Simple conception formula: combine virility and fertility
		const totalPotency = virility + virilityBonus * 0.5;
		const conceptionChance = (totalPotency + this.fertility) / 200; // Max 100% with perfect stats

		return GAME_RANDOM() < conceptionChance;
	}

	private _determineFetusCount(
		virility: number,
		virilityBonus: number,
	): number {
		const fetusCount = this._calculateNumberOfFetuses(virility, virilityBonus);

		const availableCapacity = this.maxCap - this.curCap;
		const maxFetuses =
			getMaximumNumberOfFullTermFetusesAtBellyState(availableCapacity);

		return Math.min(fetusCount, Math.max(maxFetuses, 1)); // Always allow at least 1
	}

	/**
	 *
	 * @param virility
	 * @param virilityBonus
	 * @returns a float from 1 up, deciding how many fetuses to spawn
	 */
	private _calculateNumberOfFetuses(
		virility: number,
		virilityBonus: number,
	): number {
		const totalPotency = virility + virilityBonus * 0.5;

		// At 100 virility and fertility (not considering bonuses), the chance should be 1
		const chance = (totalPotency + this.fertility) / 200;

		const modifiedChance = chance * this._stateInfo.multiplesMod;

		// Get a random value within a ±25% range
		const modifiedChancePlusRNG = getRandomFloatInRange(
			modifiedChance * 0.75,
			modifiedChance * 1.25,
		);

		return Math.max(Math.round(modifiedChancePlusRNG), 1);
	}

	private _createPregnancy(fetusCount: number): boolean {
		if (fetusCount <= 0) return false;

		const pregnancy = new Pregnancy(this, fetusCount);
		this.pregnancies.set(pregnancy.id, pregnancy);
		this.lastFertilized = GAME_VARIABLES.gameDateAndTime.date;

		return true;
	}

	/**
	 *
	 * @param timeElapsed time passed in milliseconds
	 * @returns the amount of damage to be subtracted from the womb's hp
	 */
	calcHpDrain(timeElapsed: number) {
		return this._stateInfo.wombHpDrain * (timeElapsed / 1000 / 60 / 60 / 24);
	}

	// Every gHoursBetweenPregUpdate, the womb will heal by this much depending on how much hp it already had
	gradualWombHealthIncreaser() {
		const womb = this as Womb;
		// Don't allow too large values
		if (womb.hp > womb.maxHp) {
			womb.hp = womb.maxHp;
			return 0;
		}

		const hpRatio = (womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY;
		let hpToAdd = 0;
		if (hpRatio >= WombHealth.VERY_HEALTHY) {
			hpToAdd = 5;
		} else if (hpRatio >= WombHealth.HEALTHY) {
			hpToAdd = 4;
		} else if (hpRatio >= WombHealth.MEDIOCRE) {
			hpToAdd = 3;
		} else if (hpRatio >= WombHealth.POOR) {
			hpToAdd = 2;
		} else if (hpRatio >= WombHealth.VERY_POOR) {
			hpToAdd = 1;
		} else hpToAdd = 0.5;

		if (womb.hp + hpToAdd > womb.maxHp) return 0;
		else return hpToAdd;
	}

	// NOTE - INCREASING OR REDUCING THE WOMB HP VALUE MUST BE CALLED USING THIS METHOD
	addHp(value: number) {
		let mod = 1;

		const perks = this.perks || {};
		const healthyWombPerk = perks.healthyWomb;
		if (perks && healthyWombPerk) {
			if (value >= 0) {
				// Buff health increments
				mod +=
					(healthyWombPerk.currLevel / Womb.perks.healthyWomb.maxLevel) *
					PregConstants.HEALTHY_WOMB_PERK_MAX_HP_INCREMENT_BUFF *
					mod;
			} else {
				// Nerf health decrements
				mod +=
					(healthyWombPerk.currLevel / Womb.perks.healthyWomb.maxLevel) *
					PregConstants.HEALTHY_WOMB_PERK_MAX_HP_DECREMENT_NERF *
					mod;
			}
		}

		this.hp += value * mod;
	}

	// SECTION - Preg belly size
	updateBellySize() {
		let combinedWombVolume = 0;
		this.pregnancies.forEach((pregnancy) => {
			combinedWombVolume += pregnancy.averageStats.volume;
		});
		this.curCap = combinedWombVolume;
	}

	/** Returns the an index in `BellySize` to get a rough idea of the size range the character's belly is in */
	get lowerBellySizeThreshold(): BellySize {
		const currBellySize = this.curCap;

		let bellySizeObjKey: keyof typeof BellySize | undefined,
			previousBellySizeIterationValue: BellySize = BellySize.FLAT;

		for (bellySizeObjKey in BellySize) {
			if (bellySizeObjKey) {
				const currBellySizeIterationValue = BellySize[bellySizeObjKey];

				if (
					previousBellySizeIterationValue <= currBellySize &&
					currBellySize <= currBellySizeIterationValue
				) {
					break;
				}

				previousBellySizeIterationValue = currBellySizeIterationValue;
			}
		}

		// Size is out of bounds so default to the largest belly state
		return bellySizeObjKey
			? (BellySize[bellySizeObjKey] ?? BellySize.PREG_MAX)
			: BellySize.PREG_MAX;
	}

	// Called (indirectly) .twee files since it's much easier and human readable to pass strings there
	// If you want to
	isBellySizeInRange(lowerRange: BellySize, upperRange?: BellySize) {
		let value1: BellySize | undefined;
		let value2: BellySize | undefined;

		if (typeof lowerRange === "string") {
			// `bellyStateInput` is hopefully something like `SAG`
			value1 = BellySize[lowerRange];

			if (value1 === undefined)
				throw new Error(`The lower range, ${lowerRange}, is not valid.`);
		} else {
			value1 = lowerRange;
		}
		// Do the same here
		if (upperRange !== undefined) {
			if (typeof upperRange === "string") {
				value2 = BellySize[upperRange];

				if (value2 === undefined)
					throw new Error(`The upper range, ${upperRange}, is not valid.`);
			} else {
				value2 = upperRange;
			}
		}

		if (upperRange === undefined) {
			if (value1 <= this.curCap) return true;
		} else if (
			value2 !== undefined &&
			value1 <= this.curCap &&
			this.curCap <= value2
		)
			return true;

		return false;
	}
	// !SECTION

	// SECTION - Exp update code

	/* How should the womb exp system work?
    - The awarded exp increases depending on the fetal development and number
    - Exp is only awarded every gHoursBetweenPregUpdate as long as the PC is expecting
    - A huge chunk of the exp (40%) is awarded at birth depending on the size and number of fetuses (i think this implies that the exp gained during pregnancy would be relatively small)
    - updateWombExp shouldn't grant more exp if it was called more often
    - On average, it'd take (2*LVL + Math.floor(LVL/2)) full term singleton pregnancies to gain enough exp to reach the next level (i.e 2 from LVL_1 to LVL_2, 5 from LVL_2 to LVL_3, 7 from LVL_3 to LVL_4, 10 from LVL_4 to LVL_5)
    - Each singleton full-term, non-overdue pregnancy gives about a 1000exp without bonuses
    */

	updateExpValue() {
		let expToAdd = 0;
		const wombLvl = this.lvl;

		if (wombLvl === PregConstants.MAX_WOMB_LEVEL) {
			// At max lvl, return no exp
			return 0;
		}

		// 1000 exp = 1 single pregnancy and 400 exp = birth
		// 600 exp = 10 gestational months or gDefaultPregnancyLength/gActualPregnancyLength
		// if 600/10 exp = 10/10 gest. months then
		// ??? exp = 600 * (gHoursBetweenPregUpdate * 3600)/gActualPregnancyLength
		// We're only getting a max of 92.05% >~<

		// SECTION - Actual exp stuff
		this.pregnancies.forEach((pregnancy) => {
			// Calculate the exp for each fetus separately. Each fetus can produce up to 1000 exp in total at term (with 40% only give on birth so its actually 600 exp). Going overdue will add an extra 20% to the regular exp gain the fetus will provide
			// TODO - Make it so that exp starts off really small (x0.1), at a "normal" rate halfway through (x1), and then is much more abundant(x10) with greater development
			expToAdd +=
				PregConstants.EXP_PER_SINGLE_FETUS_GESTATION *
				pregnancy.size *
				((pregnancy.averageStats.devRatio -
					pregnancy.averageStats.lastDevRatio) /
					PregConstants.MAX_DEVELOPMENT_STATE);

			// Add a random chance to bump it up or down by a random percentage between 1% and 10% because :3
			const randPercentage = getRandomIntegerInRange(1, 10) / 100;
			expToAdd = getRandomIntegerInRange(0, 1)
				? expToAdd + expToAdd * randPercentage
				: expToAdd - expToAdd * randPercentage;
		});
		// !SECTION

		// SECTION - Boost it if the elasticity perk is active
		if (this.perks?.elasticity) {
			const perkData = this.perks.elasticity;
			expToAdd +=
				(perkData.currLevel / Womb.perks.elasticity.maxLevel) *
				PregConstants.ELASTICITY_PERK_MAX_EXP_BOOST *
				expToAdd;
		}
		// !SECTION

		console.log(
			`womb exp limit: ${Womb.getExpLimit(wombLvl)}, wombLvl: ${wombLvl}`,
		);
		console.log(`expToAdd: ${expToAdd}`);

		return expToAdd;
	}

	// Get's the lvl of the womb using its max exp limit. Returns a number between 1 and 15 inclusive
	get lvl(): Extract<keyof typeof WombExpLimit, number> {
		const womb = this as Womb;
		// Fill up an intermediary array with all the levels in WombExpLimit, while ignoring any member with a negative value
		const wombExpLimitArray = Object.values(WombExpLimit);

		// // Remove duplicates by converting to a Set and then back to an array
		// wombExpLimitArray = [...new Set(wombExpLimitArray)];

		for (let i = 1; i < wombExpLimitArray.length; i++) {
			const expLimit = wombExpLimitArray[i] ?? 0;
			const previousExpLimit = wombExpLimitArray[i - 1] ?? 0;

			if (expLimit > womb.exp && previousExpLimit <= womb.exp)
				return i as Extract<keyof typeof WombExpLimit, number>;
			else if (womb.exp >= WombExpLimit[PregConstants.MAX_WOMB_LEVEL]) {
				// The user's womb is at or above the max level and the iteration has ended on the highest possible level
				return PregConstants.MAX_WOMB_LEVEL;
			}
		}

		// For some reason, the lvl is unavailable
		return PregConstants.MAX_WOMB_LEVEL;
	}

	// Give it the level and it'll return the appropriate exp cap
	static getExpLimit = (lvl: number) => {
		if (lvl < PregConstants.MIN_WOMB_LEVEL) lvl = PregConstants.MIN_WOMB_LEVEL;
		if (lvl > PregConstants.MAX_WOMB_LEVEL) lvl = PregConstants.MAX_WOMB_LEVEL;

		if (lvl === PregConstants.MAX_WOMB_LEVEL) return 0;

		// The members of WombExpLimit include LVL_1, LVL_2, LVL_3, etc
		return WombExpLimit[lvl as Extract<keyof typeof WombExpLimit, number>];
	};
	// !SECTION

	// SECTION - Pregnancy update code
	/**
	 * This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
	 *
	 * REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidVolume by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
	 *
	 * TODO - Add side effects to womb health
	 *
	 * @param elapsedTime - in seconds
	 */
	updatePregnancy(newTime: Date, user: Player) {
		// NOTE - `customTime` must be in seconds.

		// The target is pregnant so do everything required under here
		if (this.isPregnant) {
			this.pregnancies.forEach((pregnancy) => {
				pregnancy.updateGrowth(newTime, user);
			});
			return true;
		}
		return false;
	}
	// !SECTION

	// SECTION - Birth methods
	/** This is what will expunge the fetuses from the womb (except in the case for superfetation) */
	triggerBirth() {
		const birthedChildren: Fetus[] = [];

		// Handle postpartum, birth scenes, etc

		// Give exp
		let expToAdd = 0;
		this.pregnancies.forEach((pregnancy) => {
			if (pregnancy.canBirth) {
				// Longer gestating babies give more exp
				expToAdd +=
					(pregnancy.averageStats.devRatio /
						PregConstants.MAX_DEVELOPMENT_STATE) *
					(PregConstants.EXP_PER_SINGLE_BIRTH * pregnancy.size);

				// Also add it to an array that will be returned, containing data of all birthed children.
				birthedChildren.push(...pregnancy.fetuses.values());

				// Remove the fetus since we're done with it. Note that the key of the fetus in the map, fetuses, is the same as its id.
				this.pregnancies.delete(pregnancy.id);
			}
		});

		// Sometimes, `isLiableForBirth()` returns true but no fetuses are ready :p
		if (!birthedChildren.length) return false;

		this.exp += expToAdd;

		this.updateBellySize();
		this.sideEffects = {}; // Remove all side effects
		this.birthRecord++;
		this.postpartum = PregConstants.POSTPARTUM_PERIOD / this.growthMod;

		// Reduce postpartum duration if the appropriate perk is active
		const perks = this.perks;
		const noPostpartumPerk = perks.noPostpartum;
		if (noPostpartumPerk) {
			this.postpartum -=
				this.postpartum *
				(noPostpartumPerk.currLevel / Womb.perks.noPostpartum.maxLevel);
		}
		this.lastBirth = GAME_VARIABLES.gameDateAndTime.date;

		// Get the data of born children. We can use this to determine birth stats and other scene data.
		return birthedChildren;
	}

	// NOTE - THIS METHOD MUST BE CALLED RESPONSIBLY SINCE IT MAY RETURN A DIFFERENT ANSWER ON EACH RUN
	get isLiableForBirth() {
		// This will check to see if an inputted womb is ready to giving birth, regardless of the actual chance of a successful delivery
		// NOTE - Drugs and conditions may affect this

		if (!this.isPregnant) return false;

		let chanceOfBirth = 0;

		// If the womb's current capacity is within 90% of the max capacity, force birth ASAP else check other conditions
		if (this.curCap >= this.maxCap * 0.9) return true;
		else {
			// Check whether if all the pregnancies are in the development range for birthing. If false, prevent birth so long as the womb's max capacity has not been exceeded/near. If true, create a random choice that decides whether it's time to birth. Increase the chance as gestational weeks progress
			let eligiblePregnancyDevRatio: number[] = [];

			this.pregnancies.forEach((pregnancy) => {
				// All pregnancies must be at or above a particular threshold for birth to occur
				if (!pregnancy.canBirth) return;

				eligiblePregnancyDevRatio.push(pregnancy.averageStats.devRatio);
			});

			// Reduce the development progress of each pregnancy to effectively reduce the chance of / delay birth if the fortified womb perk is active and has been upgraded to at least half of its maximum level
			const perks = this.perks;

			if (perks?.fortifiedWomb) {
				const ratio =
					perks.fortifiedWomb.currLevel / Womb.perks.fortifiedWomb.maxLevel;
				if (ratio >= 0.5) {
					eligiblePregnancyDevRatio = eligiblePregnancyDevRatio.map(
						(devRatio) => {
							return (
								devRatio -
								(PregConstants.MAX_DEVELOPMENT_STATE -
									ratio *
										PregConstants.FORTIFIED_WOMB_PERK_MAX_NATURAL_BIRTH_DELAY *
										PregConstants.MAX_DEVELOPMENT_STATE)
							);
						},
					);
				}
			}

			const averageDevelopmentOfFetus = getDominantAverage(
				...eligiblePregnancyDevRatio,
			);

			chanceOfBirth +=
				(averageDevelopmentOfFetus / PregConstants.MAX_DEVELOPMENT_STATE) * 100;

			// Further increase the birth chance when overdue
			chanceOfBirth +=
				((averageDevelopmentOfFetus - PregConstants.MAX_DEVELOPMENT_STATE) /
					PregConstants.MAX_DEVELOPMENT_STATE) *
				100 *
				0.2;
		}

		// Unhealthy wombs are at slightly higher risk of birthing, however, clamp the increased chance at 33%
		chanceOfBirth += clamp(
			(this.maxHp / this.hp) * (this.maxHp - this.hp) * 0.15,
			0,
			33,
		);

		// Let's just reduce it by a bit
		chanceOfBirth *= 0.8;

		// Using `chanceOfBirth`, check if the character should birth or not
		if (getRandomFloatInRange(0, 100) <= chanceOfBirth) return true;
		else return false;
	}
	// !SECTION

	// SECTION - Perks and Side effects
	applyPerk(perk: keyof typeof this.perks) {
		if (Womb.perks[perk] && !this.isPerkActive(perk)) {
			this.perks[perk] = { currLevel: 1 };
			return true;
		}
		return false;
	}

	isPerkActive(perk: keyof typeof this.perks) {
		return !!this.perks[perk];
	}

	upgradePerk(perk: keyof typeof this.perks, lvlToAdd: number) {
		if (this.isPerkActive(perk)) {
			const perkData = this.perks[perk] as PregPerkDynamicData;
			perkData.currLevel = clamp(
				perkData.currLevel + lvlToAdd,
				1,
				Womb.perks[perk].maxLevel,
			);

			return perkData.currLevel;
		}
		return false;
	}
	removePerk(perk: keyof typeof this.perks) {
		if (this.isPerkActive(perk)) {
			delete this.perks[perk];
			return true;
		}
		return false;
	}

	isPerkAtMaxLvl(perk: keyof typeof this.perks) {
		return this.perks[perk]?.currLevel === Womb.perks[perk].maxLevel;
	}

	//

	applySideEffect(sideEffect: keyof typeof this.sideEffects) {
		const selectedSideEffect = Womb.sideEffects[sideEffect];
		if (selectedSideEffect && !this.isSideEffectActive(sideEffect)) {
			// Set the duration in seconds
			this.sideEffects[sideEffect] = {
				currDuration: either(...selectedSideEffect.maxDuration) * 24 * 60 * 60,
			};
			return true;
		}
		return false;
	}

	isSideEffectActive(sideEffect: keyof typeof this.sideEffects) {
		return !!this.sideEffects[sideEffect];
	}

	removeSideEffect(sideEffect: keyof typeof this.sideEffects) {
		if (this.isSideEffectActive(sideEffect)) {
			delete this.sideEffects[sideEffect];
			return true;
		}
		return false;
	}

	get fortifiedWombPerkCapacityBoost() {
		let mod = 1;
		const perks = this.perks || {};
		const fortifiedWombPerk = perks.fortifiedWomb;

		if (perks && fortifiedWombPerk) {
			mod +=
				(fortifiedWombPerk.currLevel / Womb.perks.fortifiedWomb.maxLevel) *
				PregConstants.FORTIFIED_WOMB_PERK_MAX_CAPACITY_BOOST *
				mod;
		}

		return mod;
	}
	get elasticityPerkCapacityBoost() {
		let mod = 1;
		const perks = this.perks || {};
		const elasticityPerk = perks.elasticity;

		if (perks && elasticityPerk) {
			mod +=
				(elasticityPerk.currLevel / Womb.perks.elasticity.maxLevel) *
				PregConstants.ELASTICITY_PERK_CAPACITY_MAX_BOOST *
				mod;
		}

		return mod;
	}
	// !SECTION

	get fertility() {
		return this._fertility * this._stateInfo.fertilityMod;
	}

	/**
	 * How big she can get without losing any comfort. Slowly increases as womb.exp increases
	 */
	get comfortCap() {
		let mod = 1;

		// Consider if the elasticity perk is active
		mod *= this.elasticityPerkCapacityBoost;

		return this._comfortCap * mod;
	}

	/**
	 * How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks
	 */
	get maxCap() {
		let mod = 1;

		// Consider if the elasticity perk is active
		mod *= this.elasticityPerkCapacityBoost;

		// Consider if the fortified womb perk is active
		mod *= this.fortifiedWombPerkCapacityBoost;

		return this._maxCap * mod;
	}

	/** Between 0 and 1. Ratio between the current capacity and the maximum capacity of the womb */
	get maxCapRatio() {
		return this.curCap / this.maxCap;
	}

	get mostAdvancedPregnancy(): Pregnancy | null {
		return this.pregnancies.values().reduce<Pregnancy | null>((acc, val) => {
			if (!acc) {
				acc = val;
				return acc;
			}

			// I considered using their conception dates, but pregnancies can advance at different rates :p
			if (val.averageStats.devRatio > acc.averageStats.devRatio) acc = val;

			return acc;
		}, null);
	}

	get fetusCount() {
		return this.pregnancies.values().reduce((acc, val) => acc + val.size, 0);
	}

	/** Average stats of all pregnancies */
	get averageStats() {
		return this.pregnancies.values().reduce<Pregnancy["averageStats"]>(
			(acc, val) => {
				const {
					devRatio,
					fluid,
					gestWeek,
					gestDuration,
					growthMod,
					growthRate,
					height,
					hp,
					lastDevRatio,
					volume,
					weight,
				} = val.averageStats;

				acc.devRatio += devRatio;
				acc.fluid += fluid;
				acc.gestWeek += gestWeek;
				acc.gestDuration += gestDuration;
				acc.growthMod += growthMod;
				acc.growthRate += growthRate;
				acc.height += height;
				acc.hp += hp;
				acc.lastDevRatio += lastDevRatio;
				acc.volume += volume;
				acc.weight += weight;

				return acc;
			},
			{
				devRatio: 0,
				fluid: 0,
				gestWeek: 0,
				gestDuration: 0,
				growthMod: 0,
				growthRate: 0,
				height: 0,
				hp: 0,
				lastDevRatio: 0,
				volume: 0,
				weight: 0,
			},
		);
	}

	private get _stateInfo() {
		this._stateMachine.updateToLatest();

		return this._stateMachine.stateInfo;
	}
}

/** Accepts any value from the enum BellyState but will only work with members that have `FULL_TERM` appended. Returns the minimum number of full grown, non-overdue fetuses that can achieve the inputted size */
function getMaximumNumberOfFullTermFetusesAtBellyState(bellySize: BellySize) {
	if (bellySize < BellySize.FULL_TERM) return 0;

	return Math.floor(bellySize / BellySize.FULL_TERM);
}

type SerializedWomb = {
	hp: number;
	maxHp: number;
	fertility: FertilityLevel;
	curCap: BellySize;
	comfortCap: BellySize;
	maxCap: BellySize;
	exp: number;
	postpartum: number;
	birthControl: boolean;
	birthRecord: number;
	lastFertilized: Date | null;
	lastBirth: Date | null;
	growthMod: number;
	perks: PregPerksObject<PregPerkDynamicData>;
	sideEffects: PregSideEffectsObject<PregSideEffectDynamicData>;
	pregnancies: Map<UUID, ReturnType<typeof Pregnancy.prototype.toJSON>>;
};

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type ClassCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedWomb,
	typeof Womb
>;
