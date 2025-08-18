import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import {
	cloneClass,
	getRandomFloatInRange,
	getRandomIntegerInRange,
	getWeightedAverage,
} from "~/game/shared/utils";
import { either } from "~/utils/iterable";
import { clamp } from "~/utils/math";
import { FertilityLevel, WombHealth } from "../enums";
import type {
	BellyStateType,
	PregPerkDynamicData,
	PregPerkStaticData,
	PregPerksObject,
	PregSideEffectDynamicData,
	PregSideEffectStaticData,
	PregSideEffectsObject,
} from "../types";
import {
	BellyState,
	gChanceOfNaturalMultipleOvaFertilization,
	gChanceOfNaturalOvaSplit,
	gDefaultMaxWombHP,
	gElasticityPerkCapacityMaxBoost,
	gElasticityPerkMaxExpBoost,
	gExpPerSingleBirth,
	gExpPerSingleFetusGestation,
	gFortifiedWombPerkMaxCapacityBoost,
	gFortifiedWombPerkMaxNaturalBirthDelay,
	gFortifiedWombPerkMaxPassiveHPDrainNerf,
	gHealthyWombPerkMaxHPDecrementNerf,
	gHealthyWombPerkMaxHPIncrementBuff,
	gMaxDevelopmentState,
	gMaxWombLevel,
	gMinWombLevel,
	gPostpartumPeriod,
	WombExpLimit,
} from "../variables";
import type { Fetus } from "./fetus";
import { Pregnancy } from "./pregnancy";

/* Womb, Pregnancy and Birth */
/* A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions */
/* A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has */
/* The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has */

/* Capacity is in cubic centimetres(CCs) */
/**
 * NOTE - This will be changed, depending on whether the mother is the player, genetic conditions, and/or drugs, as well as the growthRate of the fetus
 */
// const gActualPregnancyLength = gDefaultPregnancyLength;
export class Womb implements SugarBoxCompatibleClassInstance<SerializedWomb> {
	/**
	 * Unhealthy wombs gestate slower. It slowly reduces with time while pregnant but will only get critically low if the user doesn't take care of themselves. Going beyond womb.comfortCapacity, and to a much higher extent with womb.maxCapacity, consumes more hp. The PC's womb will give out at 0hp. Heals overnight while sleeping, with drugs, womb treatments, or eating
	 */
	hp = gDefaultMaxWombHP;
	maxHp = gDefaultMaxWombHP;

	fertility = either(
		FertilityLevel.POOR_FERTILITY,
		FertilityLevel.AVERAGE_FERTILITY,
		FertilityLevel.HIGH_FERTILITY,
	);

	// These capacity variables also refer to the "size too"
	// NOTE - Use `effectiveComfortCapacity` and `effectiveMaxCapacity` over the private values here when trying to READ. Since the variables here are write-only.
	/**
	 * Determines the size of her pregnancy, going too far beyond womb.maxCapacity can cause the babies to be 'skin-wrapped'
	 */
	curCapacity: BellyStateType = BellyState.FLAT;
	/**
	 * How big she can get without losing any comfort. Slowly increases as womb.exp increases
	 */
	comfortCapacity: BellyStateType = BellyState.FULL_TERM;
	/**
	 * How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks
	 */
	maxCapacity = BellyState.FULL_TERM + BellyState.LATE_PREGNANCY;

	/**
   * Increases when pregnant; the amount depends on size and number of fetuses, `womb.curCapacity`, `womb.comfortCapacity` and `womb.maxCapacity`. Increases faster once `womb.curCapacity` nears womb.comfortCapacity and even faster when it goes beyond it; basically the ratio of `womb.curCapacity`/`womb.comfortCapacity` (and `womb.curCapacity`/`womb.maxCapacity` when the former is high enough) decides how fast exp increases. Once it surpasses the limit for `womb.lvl`, levels up her womb. Some types of food, drugs, treatments and perks increase its rate of gain. Slowly decreases when not pregnant.

      Higher levels have higher capacities, the ability to use stronger and higher level perks, and a lower rate of hp loss. Exp levels can be found in the enum `WombExpLimit`
   */
	exp = 0;

	/**
	 * 0 -> Can get pregnant, >= 1 -> Postpartum. This variable is set to `gPostpartumPeriod` (can be influenced by some perks) once the user gives birth to all her children
	 */
	postpartumCounter = 0;
	onContraceptives = false;
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

	naturalGrowthMod = 1; // A multiplier that affects the growth rate of the fetuses, the player's own is x10

	perks: PregPerksObject<PregPerkDynamicData> = {};
	sideEffects: PregSideEffectsObject<PregSideEffectDynamicData> = {};
	pregnancies: Map<number /* pregID */, Pregnancy> = new Map();

	static isWombDamageEnabled = false;
	static perks: Required<PregPerksObject<PregPerkStaticData>> = {
		/* Its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant. */
		/* Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility */
		/* Each perk is an object of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level */
		/*TODO - Change the prices later to something more reasonable. Also, add more perks */

		// NOTE - Only store these if they're active
		gestator: {
			// currLevel: 1,
			price: 5000,
			maxLevel: 10,
		} /* Increases the speed of pregnancies, but makes and keeps the user hungrier. At the maximum level, pregnancy duration sped up by `gGestatorPerkMaxSpeedBoost` and additional hunger drain is always 30% of that. */,
		hyperFertility: {
			// currLevel: 1,
			price: 3000,
			maxLevel: 5,
		} /* Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */,
		superFet: {
			// currLevel: 1,
			price: 15000,
			maxLevel: 5,
		} /* Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */,
		elasticity: {
			// currLevel: 1,
			price: 7000,
			maxLevel: 10,
		} /* Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */,
		immunityBoost: {
			// currLevel: 1,
			price: 2000,
			maxLevel: 5,
		} /* Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */,
		motherlyHips: {
			// currLevel: 1,
			price: 5000,
			maxLevel: 5,
		} /* Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */,
		motherlyBoobs: {
			// currLevel: 1,
			price: 5000,
			maxLevel: 5,
		} /* Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */,
		ironSpine: {
			// currLevel: 1,
			price: 7000,
			maxLevel: 5,
		} /* Can carry bigger pregnancies and more weight before becoming bed bound */,
		sensitiveWomb: {
			// currLevel: 1,
			price: 6000,
			maxLevel: 5,
		} /* Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */,
		healthyWomb: {
			// currLevel: 1,
			price: 3000,
			maxLevel: 10,
		} /* Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */,
		fortifiedWomb: {
			// currLevel: 1,
			price: 10000,
			maxLevel: 5,
		} /* Raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */,
		noPostpartum: {
			// currLevel: 1,
			price: 2000,
			maxLevel: 10,
		} /* Reduces the postpartum period, completely erasing it at max FertilityLevel. Is only useful when activated before giving birth, that is, activating this perk during the postpartum period does nothing (Note that the PC has a recovery period of a week) */,
		polyhydramnios: {
			price: 1500,
			maxLevel: 10,
		} /* Increases amniotic fluid production per fetus */,
	};
	static sideEffects: Required<
		PregSideEffectsObject<PregSideEffectStaticData>
	> = {
		/* Most can occur anytime in a pregnancy after 20% of fetal development is achieved and usually reduce performance or do some other undesirable stuff until they leave. Upgrading some perks can cause them to become stronger. */
		/* They are objects containing 2 values; the first decides if the user is afflicted with them and how long the condition (in seconds) will last while the second is an array storing the amount of days the side effect can last (if the latter is 0, it means the during depends entirely on other things). */
		/* TODO - Add more side effects */

		cravingCrisis: {
			// currDuration: 0,
			maxDuration: [1, 2],
		} /* Constantly reduces some stats and benefits of food until a randomly generated craving is satisfied. */,
		motherHunger: {
			// currDuration: 0,
			maxDuration: [1, 2, 3],
		} /* Reduces the amount of fullness food gives and allows fullness to be exceeded to a randomly generated extent. The user suffers penalties in stats and productivity if their . */,
		restlessBrood: {
			// currDuration: 0,
			maxDuration: [2, 3],
		} /* Drains energy faster and increases the energy cost of actions. Also reduces concentration and efficiency at work. The user will have to temporarily soother their children a lot. */,
		heavyWomb: {
			// currDuration: 0,
			maxDuration: [3, 5, 7],
		} /* Reduces non-vehicle movement speed and drains energy faster. Trying to do work in this condition may extend it. */,
		contractions: {
			// currDuration: 0,
			maxDuration: [1, 2, 3, 5],
		} /* Happens randomly around the user's due date and takes a small cut out of their stats. It also has the user stunned in place temporarily. */,
		labour: {
			// currDuration: 0,
			maxDuration: [3],
		} /* Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */,
		sexCraving: {
			// currDuration: 0,
			maxDuration: [1, 3],
		} /* Maxes out arousal once a day and keeps it above 75 */,
		growthSpurt: {
			// currDuration: 0,
			maxDuration: [1, 2, 3],
		} /* Can happen whenever the user does a lot of stuff that attributes to the growth of their pregnancy. This will happen around 12pm or 12am */,
	};

	static classId = ClassId.WOMB;

	static fromJSON(data: SerializedWomb): Womb {
		return Object.assign(new Womb(), data);
	}

	constructor(wombData?: Partial<SerializedWomb> | null) {
		Object.assign(this, wombData ?? {});
	}

	toJSON(): SerializedWomb {
		return { ...this };
	}

	get isPregnant() {
		// There is at least one pregnancy
		if (this.pregnancies.size > 0) return true;
		else return false;
	}

	get isPostPartum(): boolean {
		return !!this.postpartumCounter;
	}

	// get fetuses() {
	//   return this.fetuses;
	// }

	// get generateUnusedFetusId() {
	//   // Check all fetuses in the womb (if any) and generate a random 16-bit number that isn't shared with any other existing fetus
	//   let newFetusId = random(0, gNumOfPossibleFetusIds - 1);

	//   this.fetuses.forEach((fetus) => {
	//     const existingFetusId = fetus.id;

	//     if (newFetusId == existingFetusId) {
	//       // Restart the function
	//       this.generateUnusedFetusId;
	//     }
	//   });

	//   return newFetusId;
	// }

	// Just a check to see if pregnancy can be started
	#tryToImpregnate(
		virility: number,
		fertility: number,
		areContraceptivesActive: boolean,
		virilityBonus: number | undefined,
		fertilityBonus: number | undefined,
	): boolean {
		// Both parameters have a range of 0 - 100 in most cases. Even when both sides have a 100, conception might still fail, although with a very minute chance. If for some reason, either value is above 100, conception is guaranteed (the PC can get a fertility above 100)

		// The respective bonuses are capped at 30 each and reduced to 30~50% of their original value , before being added to 'pregChance'

		// Having a virility or fertility above 100 makes one basically a fertility idol and guarantees pregnancies
		if (virility > 100 || fertility > 100) return true;

		// Contraceptives greatly reduce the chance for pregnancy by 90%
		if (areContraceptivesActive && getRandomIntegerInRange(0, 100) < 10)
			return false;

		// Virility has more a bit more importance than fertility
		const virileChance = getRandomFloatInRange(0.85, 1.1);
		const fertileChance = getRandomFloatInRange(0.8, 1.05);

		let pregChance =
			virility * virileChance +
			fertility * fertileChance -
			(virility * virileChance - fertility * fertileChance) * 0.1;

		// This would me mostly out of the player's control
		if (virilityBonus) {
			if (virilityBonus > 30) {
				virilityBonus = 30;
			}
			pregChance += virilityBonus * (getRandomIntegerInRange(30, 50) / 100);
		}
		if (fertilityBonus) {
			if (fertilityBonus > 30) {
				fertilityBonus = 30;
			}
			pregChance += fertilityBonus * (getRandomIntegerInRange(30, 50) / 100);
		}

		pregChance /= 200;

		if (getRandomFloatInRange(0, 1) < pregChance) return true;
		else return false;
	}

	// ANCHOR - Call this to create a pregnancy
	tryCreatePregnancy(
		virility: number,
		virilityBonus: number | undefined,
		numOfFetusesToForceToSpawn?: number, // Note that if this is present, a pregnancy will be forced regardless of other variables
	) {
		if (this.isPostPartum) return false;
		if (!virilityBonus) virilityBonus = 0;
		const fertilityBonus = 0;
		// TODO - calculate all the fertility bonuses from the womb
		// const isPregnancySuccessful =

		// Only allow if the impregnation chance comes up true and the womb health is >= 80 OR if a designated number of fetuses to spawn has been given.
		if (
			(this.#tryToImpregnate(
				virility,
				this.fertility,
				this.onContraceptives,
				virilityBonus,
				fertilityBonus,
			) &&
				(this.hp / this.maxHp) * WombHealth.FULL_VITALITY >
					WombHealth.HEALTHY) ||
			numOfFetusesToForceToSpawn
		) {
			let i = 0,
				j = 0;

			// TODO - Deal with the sperm stuff later
			// NOTE - The bonuses should be capped at 30 somewhere. They can be obtained from drugs, conditions, randomly, etc
			// Assume `virility` = 70, and `virilityBonus` = 30. A but on the high side but eh
			const totalVirility = virility + virilityBonus * 0.5;
			const totalFertility = this.fertility + fertilityBonus;

			// SECTION - Decide how many offspring to create
			let numOfFoetusToSpawn = 1;

			// The chance of more than 1 sperm fertilizing an egg. It's not really much :p
			while (i < gChanceOfNaturalMultipleOvaFertilization.length) {
				// Use the virility bonus to boost the chance a bit, like by ~0.3...
				const chance =
					(gChanceOfNaturalMultipleOvaFertilization[i] ?? 0) +
					(totalVirility * 0.1) / virility +
					(virility * 0.25) / 100;
				console.log(`virile chance: ${chance}`);

				if (parseFloat(getRandomFloatInRange(0, 1).toFixed(2)) < chance) {
					numOfFoetusToSpawn++;
				} else {
					// Once it fails, quit making more fetuses
					break;
				}
				i++;
			}

			// The ova splitting part
			while (j < gChanceOfNaturalOvaSplit.length) {
				let chance =
					(gChanceOfNaturalOvaSplit[i] ?? 0) +
					(totalFertility * 0.1) / this.fertility +
					(this.fertility * 0.1) / 100 +
					(fertilityBonus * 0.75) / 100; // 0.455 is the extra bonus gotten with 100 fertility and 30 fertilityBonus

				// TODO - Add drugs that directly increase the chance for multiples, separate from the fertilityBonus stat. Also, these calculations need extra tweaking

				// SECTION - The player has the hyper fertility perk
				const perks = this.perks || {};
				if (perks?.hyperFertility) {
					// Give a large multiplier to the chance for multiples.
					chance *= 1.55;

					// Gently add a flat increase it with every extra level
					let k = 1;
					while (k < (perks.hyperFertility?.currLevel ?? 0)) {
						chance += 0.055;
						k++;
					}
				}
				// !SECTION

				// SECTION - Superfetation's ability to allow pregnancy during pregnancy.
				if (this.isPregnant) {
					if (perks?.superFet) {
						const superFetPerk = perks.superFet;
						// REVIEW - Half the chance plus a bit extra per perk level. That should be enough, right?
						chance *= 0.5;
						chance +=
							(Womb.perks.superFet.maxLevel - superFetPerk.currLevel) * 0.08;
					} else {
						// No chance to make more babies :p
						chance = 0;
						numOfFoetusToSpawn = 0;

						if (numOfFetusesToForceToSpawn) {
							console.warn(
								`Although currently pregnant and lacking the superfetation perk, this womb will still be impregnated with ${numOfFetusesToForceToSpawn} ${
									numOfFetusesToForceToSpawn === 1 ? "fetus" : "fetuses"
								}`,
							);
						}
					}
				}
				// !SECTION

				console.log(`fertile chance: ${chance}`);
				// This is on the woman's side so superfet genes affect this chance
				if (parseFloat(getRandomFloatInRange(0, 1).toFixed(2)) < chance) {
					// If the probability passes, add another fetus
					numOfFoetusToSpawn++;
				} else {
					// Once it fails, quit making more fetuses
					break;
				}

				j++;
			}

			// If this parameter is given, override the regular number of fetuses to spawn
			if (numOfFetusesToForceToSpawn && numOfFetusesToForceToSpawn > 0)
				numOfFoetusToSpawn = numOfFetusesToForceToSpawn;

			// NOTE - For now, the max amount of offspring is limited to the max capacity of the womb so
			const maxFetusNumber = this.#getMinimumNumOfFullTermFetusesAtBellyState(
				this.effectiveMaxCapacity,
			);
			if (numOfFoetusToSpawn > 0) {
				numOfFoetusToSpawn =
					numOfFoetusToSpawn > maxFetusNumber
						? maxFetusNumber
						: numOfFoetusToSpawn;

				// SECTION - Create the babies and push them into the womb. Not much data about them is needed since the player can't keep them anyway
				// for (i = 0; i < numOfFoetusToSpawn; i++) {
				//   // NOTE - the ID is used to generate these stuff. I may add another random chance if I'm feeling like but for now, having the same ID will create the same stats
				//   const id = this.generateUnusedFetusId;
				//   this.addFetus(new Fetus(id), id);
				// }
				Pregnancy.init(this, numOfFoetusToSpawn);
				// !SECTION

				// Update specific data for the womb
				this.lastFertilized = GAME_VARIABLES().gameDateAndTime;
				return true;
			} else {
				return false;
			}
		}
	}

	// Accepts any value from the enum BellyState but will only work with members that have `FULL_TERM` appended. Returns the minimum number of full grown, non-overdue fetuses that can achieve the inputted size
	#getMinimumNumOfFullTermFetusesAtBellyState(bellyState: BellyStateType) {
		if (bellyState < BellyState.FULL_TERM) return 0;

		return Math.floor(bellyState / BellyState.FULL_TERM);
	}

	// Returns a negative value
	calculateHealthDamage() {
		const womb = this as Womb;
		if (!Womb.isWombDamageEnabled) return 0;
		// Don't allow negative values
		if ((womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY < WombHealth.RIP) {
			womb.hp = WombHealth.RIP;
			return 0;
		}

		let wombDamage = 0;

		// Calculate the damage per each fetus
		this.pregnancies.forEach((pregnancy) => {
			const developmentProgressSinceLastUpdate =
				pregnancy.devRatio - pregnancy.lastDevRatio;

			// Every 1% progress in pregnancy development does 0.25 damage.
			wombDamage +=
				Math.round((developmentProgressSinceLastUpdate / 1) * 0.25 * 100) / 100;
		});

		// Consider if the fortified womb perk is active
		const perks = this.perks || {};
		const fortifiedWombPerk = perks.fortifiedWomb;
		if (perks && fortifiedWombPerk) {
			wombDamage -=
				(perks?.fortifiedWomb?.currLevel ??
					0 / Womb.perks.fortifiedWomb.maxLevel) *
				gFortifiedWombPerkMaxPassiveHPDrainNerf *
				wombDamage;
		}

		return -wombDamage;
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
		} else if (
			hpRatio > WombHealth.VERY_HEALTHY &&
			hpRatio >= WombHealth.HEALTHY
		) {
			hpToAdd = 4;
		} else if (hpRatio > WombHealth.HEALTHY && hpRatio >= WombHealth.MEDIOCRE) {
			hpToAdd = 3;
		} else if (hpRatio > WombHealth.MEDIOCRE && hpRatio >= WombHealth.POOR) {
			hpToAdd = 2;
		} else if (hpRatio > WombHealth.POOR && hpRatio >= WombHealth.VERY_POOR) {
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
					gHealthyWombPerkMaxHPIncrementBuff *
					mod;
			} else {
				// Nerf health decrements
				mod +=
					(healthyWombPerk.currLevel / Womb.perks.healthyWomb.maxLevel) *
					gHealthyWombPerkMaxHPDecrementNerf *
					mod;
			}
		}

		this.hp += value * mod;
	}

	// SECTION - Preg belly size
	updateBellySize() {
		let combinedWombVolume = 0;
		this.pregnancies.forEach((pregnancy) => {
			combinedWombVolume += pregnancy.volume;
		});
		this.curCapacity = combinedWombVolume;
	}

	// Returns the an index in BellyState to get a rough idea of the size range the character's belly is in
	// TODO - Add a macro for this or just add it to setup
	get lowerBellySizeThreshold(): BellyStateType {
		// Copy over the actual numbers from the enum
		let bellySizeArray = Object.values(BellyState).filter(
			(value) => typeof value === "number",
		) as BellyStateType[];

		// Convert to set and return it back to an array so all duplicates are gone
		bellySizeArray = [...new Set(bellySizeArray)];

		// Loop 👍
		for (let index = 1; index < bellySizeArray.length; index++) {
			const size = bellySizeArray[index];
			const previousSize = bellySizeArray[index - 1];

			if (size > this.curCapacity && previousSize <= this.curCapacity) {
				// In the range for the previous size, so return that
				return previousSize;
			}
		}

		// Size is out of bounds so default to the largest belly state
		return BellyState.PREG_MAX;
	}

	// Called (indirectly) .twee files since it's much easier and human readable to pass strings there
	// If you want to
	isBellySizeInRange(
		lowerRange: BellyStateType | keyof typeof BellyState,
		upperRange?: BellyStateType | keyof typeof BellyState,
	) {
		let value1: BellyStateType | undefined;
		let value2: BellyStateType | undefined;

		if (typeof lowerRange === "string") {
			// `bellyStateInput` is hopefully something like `SAG`
			value1 = BellyState[lowerRange];

			if (value1 === undefined)
				throw new Error(`The lower range, ${lowerRange}, is not valid.`);
		} else {
			value1 = lowerRange;
		}
		// Do the same here
		if (upperRange !== undefined) {
			if (typeof upperRange === "string") {
				value2 = BellyState[upperRange];

				if (value2 === undefined)
					throw new Error(`The upper range, ${upperRange}, is not valid.`);
			} else {
				value2 = upperRange;
			}
		}

		if (upperRange === undefined) {
			if (value1 <= this.curCapacity) return true;
		} else if (
			value2 !== undefined &&
			value1 <= this.curCapacity &&
			this.curCapacity <= value2
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

		if (wombLvl === gMaxWombLevel) {
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
				gExpPerSingleFetusGestation *
				pregnancy.size *
				((pregnancy.devRatio - pregnancy.lastDevRatio) / gMaxDevelopmentState);

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
				gElasticityPerkMaxExpBoost *
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
		console.log(WombExpLimit);

		// // Remove duplicates by converting to a Set and then back to an array
		// wombExpLimitArray = [...new Set(wombExpLimitArray)];

		for (let i = 1; i < wombExpLimitArray.length; i++) {
			const expLimit = wombExpLimitArray[i] ?? 0;
			const previousExpLimit = wombExpLimitArray[i - 1] ?? 0;

			if (expLimit > womb.exp && previousExpLimit <= womb.exp)
				return i as Extract<keyof typeof WombExpLimit, number>;
			else if (womb.exp >= WombExpLimit[gMaxWombLevel]) {
				// The user's womb is at or above the max level and the iteration has ended on the highest possible level
				return gMaxWombLevel;
			}
		}

		// For some reason, the lvl is unavailable
		return gMaxWombLevel;
	}

	// Give it the level and it'll return the appropriate exp cap
	static getExpLimit = (lvl: number) => {
		if (lvl < gMinWombLevel) lvl = gMinWombLevel;
		if (lvl > gMaxWombLevel) lvl = gMaxWombLevel;

		if (lvl === gMaxWombLevel) return 0;

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
	updatePregnancy(elapsedTime: number) {
		// NOTE - `customTime` must be in seconds.

		// The target is pregnant so do everything required under here
		if (this.isPregnant) {
			this.pregnancies.forEach((pregnancy) => {
				pregnancy.updateGrowth(this, elapsedTime);
			});
			return true;
		}
		return false;
	}
	// !SECTION

	// SECTION - Birth methods
	triggerBirth() {
		// This is what will expunge the fetuses from the womb (except in the case for superfetation)
		const birthedChildren: Fetus[] = [];

		// Handle postpartum, birth scenes, etc

		// Give exp
		let expToAdd = 0;
		this.pregnancies.forEach((pregnancy) => {
			if (pregnancy.canBirth) {
				// Longer gestating babies give more exp
				expToAdd +=
					(pregnancy.devRatio / gMaxDevelopmentState) *
					(gExpPerSingleBirth * pregnancy.size);

				// Also add it to an array that will be returned, containing data of all birthed children.
				birthedChildren.push(
					...pregnancy.fetuses.values().map((val) => cloneClass(val)),
				);

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
		this.postpartumCounter = gPostpartumPeriod / this.naturalGrowthMod;
		// Reduce postpartum duration if the appropriate perk is active
		const perks = this.perks || {};
		const noPostpartumPerk = perks.noPostpartum;
		if (perks && noPostpartumPerk) {
			this.postpartumCounter -=
				this.postpartumCounter *
				(noPostpartumPerk.currLevel / Womb.perks.noPostpartum.maxLevel);
		}
		this.lastBirth = GAME_VARIABLES().gameDateAndTime;
		// Get the data of born children. We can use this to determine birth stats and other scene data.
		return birthedChildren.map((child) => cloneClass(child));
	}

	// NOTE - THIS METHOD MUST BE CALLED RESPONSIBLY SINCE IT MAY RETURN A DIFFERENT ANSWER ON EACH RUN
	get isLiableForBirth() {
		// This will check to see if an inputted womb is ready to giving birth, regardless of the actual chance of a successful delivery
		// NOTE - Drugs and conditions may affect this

		if (!this.isPregnant) return false;

		let chanceOfBirth = 0;

		// If the womb's current capacity is within 90% of the max capacity, force birth ASAP else check other conditions
		if (this.curCapacity >= this.effectiveMaxCapacity * 0.9) return true;
		else {
			// Check whether if all the pregnancies are in the development range for birthing. If false, prevent birth so long as the womb's max capacity has not been exceeded/near. If true, create a random choice that decides whether it's time to birth. Increase the chance as gestational weeks progress
			let eligiblePregnancyDevRatio: number[] = [];

			this.pregnancies.forEach((pregnancy) => {
				// All pregnancies must be at or above a particular threshold for birth to occur
				if (!pregnancy.canBirth) return;

				eligiblePregnancyDevRatio.push(pregnancy.devRatio);
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
								(gMaxDevelopmentState -
									ratio *
										gFortifiedWombPerkMaxNaturalBirthDelay *
										gMaxDevelopmentState)
							);
						},
					);
				}
			}

			const averageDevelopmentOfFetus = getWeightedAverage(
				...eligiblePregnancyDevRatio,
			);

			chanceOfBirth += (averageDevelopmentOfFetus / gMaxDevelopmentState) * 100;

			// Further increase the birth chance when overdue
			chanceOfBirth +=
				((averageDevelopmentOfFetus - gMaxDevelopmentState) /
					gMaxDevelopmentState) *
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
				gFortifiedWombPerkMaxCapacityBoost *
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
				gElasticityPerkCapacityMaxBoost *
				mod;
		}

		return mod;
	}
	// !SECTION

	/**
	 * How big she can get without losing any comfort. Slowly increases as womb.exp increases
	 */
	get effectiveComfortCapacity() {
		let mod = 1;

		// Consider if the elasticity perk is active
		mod *= this.elasticityPerkCapacityBoost;

		return this.comfortCapacity * mod;
	}

	/**
	 * How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks
	 */
	get effectiveMaxCapacity() {
		let mod = 1;

		// Consider if the elasticity perk is active
		mod *= this.elasticityPerkCapacityBoost;

		// Consider if the fortified womb perk is active
		mod *= this.fortifiedWombPerkCapacityBoost;

		return this.maxCapacity * mod;
	}
}

type SerializedWomb = {
	hp: number;
	maxHp: number;
	fertility: FertilityLevel;
	curCapacity: BellyStateType;
	comfortCapacity: BellyStateType;
	maxCapacity: BellyStateType;
	exp: number;
	postpartumCounter: number;
	onContraceptives: boolean;
	birthRecord: number;
	lastFertilized: Date | null;
	lastBirth: Date | null;
	naturalGrowthMod: number;
	perks: PregPerksObject<PregPerkDynamicData>;
	sideEffects: PregSideEffectsObject<PregSideEffectDynamicData>;
	pregnancies: Map<number, Pregnancy>;
};

// biome-ignore lint/correctness/noUnusedVariables: <Static prop check>
type ClassCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedWomb,
	typeof Womb
>;
