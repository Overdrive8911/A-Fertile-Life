import { ReactiveMap } from "@solid-primitives/map";
import { createMutable } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { GAME_RANDOM, GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import {
	getRandomFloatInRange,
	getRandomIntegerInRange,
} from "~/game/shared/utils";
import type { PlayerV0_0_1 } from "~/game/types/story-variables/player";
import type { NumberKeys } from "~/types/generics";
import type { UUID } from "~/types/uuid";
import { getRandomUUID } from "~/utils/random";
import { GestationalWeek, PregConstants, WombHealth } from "../enums";
import { PregStateMachine } from "../state-machine/preg-stage";
import { Fetus } from "./fetus";
import { Womb } from "./womb";

type SerializedPregnancy = {
	id: UUID;
	fetuses: Map<number, ReturnType<typeof Fetus.prototype.toJSON>>;
	conception: Date;
	lastUpdate: Date;
};

const GAME_DATE = () => GAME_VARIABLES.gameDateAndTime.date;

type FetusProps = Exclude<NumberKeys<Fetus>, undefined | "id" | "species">;
/**
 * A Pregnancy is simply a collection of fetuses conceived at the same time and allows be to apply effects equally to related fetuses.
 *
 * A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions.
 *
 * A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has.
 *
 * The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has.
 */
export class Pregnancy
	implements SugarBoxCompatibleClassInstance<SerializedPregnancy>
{
	id: UUID;
	womb: Womb;
	fetuses: ReactiveMap<number, Fetus> = new ReactiveMap();
	/** The last time a fetus was generated and added to this class */
	conception: Date = GAME_DATE();
	lastUpdate: Date = this.conception;

	private readonly _pregStateMachine: PregStateMachine;

	static classId = ClassId.PREGNANCY;

	constructor(womb: Womb, numOfFetuses = 1) {
		for (let i = 0; i < numOfFetuses; i++) {
			const fetus = this._generateRandomFetus();

			this._addFetus(fetus);
		}

		const pregnancyId = getRandomUUID();
		this.womb = womb;
		this.id = pregnancyId;

		this._pregStateMachine = new PregStateMachine(this);

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	static fromJSON(womb: Womb, data: SerializedPregnancy): Pregnancy {
		const pregnancy = new Pregnancy(womb),
			{ conception: dateConceived, fetuses, id, lastUpdate } = data;

		pregnancy.conception = dateConceived;
		pregnancy.id = id;
		pregnancy.fetuses = new ReactiveMap(
			fetuses
				.entries()
				.map(([fetusId, serializedFetus]) => [
					fetusId,
					Fetus.fromJSON(pregnancy, serializedFetus),
				]),
		);
		pregnancy.lastUpdate = lastUpdate;
		pregnancy._updateStateMachine();

		return pregnancy;
	}

	toJSON(): SerializedPregnancy {
		return {
			conception: this.conception,
			fetuses: new Map(
				this.fetuses
					.entries()
					.map(([fetusId, fetus]) => [fetusId, fetus.toJSON()]),
			),
			id: this.id,
			lastUpdate: this.lastUpdate,
		};
	}

	private _generateRandomFetus(): Fetus {
		/** A number between 0 and PregConstants.NUM_OF_POSSIBLE_FETUS_IDS */
		const fetusId = Math.floor(
			((GAME_RANDOM() + Math.random()) % 1) *
				PregConstants.NUM_OF_POSSIBLE_FETUS_IDS,
		);

		return new Fetus(this, fetusId);
	}

	private _addFetus(fetus: Fetus): void {
		this.fetuses.set(fetus.id, fetus);

		this.conception = fetus.conception;
	}

	get size() {
		return this.fetuses.size;
	}

	/** Returns the averages of the numeric props of fetuses in the pregnancy */
	get averageStats(): Record<FetusProps, number> {
		let {
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
		}: Record<FetusProps, number> = {
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
		};

		this.fetuses.forEach((fetus) => {
			devRatio += fetus.devRatio;
			fluid += fetus.fluid;
			gestWeek += fetus.gestWeek;
			gestDuration += fetus.gestDuration;
			growthMod += fetus.growthMod;
			growthRate += fetus.growthRate;
			height += fetus.height;
			hp += fetus.hp;
			lastDevRatio += fetus.lastDevRatio;
			volume += fetus.volume;
			weight += fetus.weight;
		});

		// Calculate the average
		const size = this.size;

		return {
			devRatio: devRatio / size,
			fluid: fluid / size,
			gestWeek: gestWeek / size,
			gestDuration: gestDuration / size,
			growthMod: growthMod / size,
			growthRate: growthRate / size,
			height: height / size,
			hp: hp / size,
			lastDevRatio: lastDevRatio / size,
			volume: volume / size,
			weight: weight / size,
		};
	}

	// SECTION - Pregnancy update code
	/**
	 * This function would be run the end of every passage transition (preferably when the player has moved to a different location/sub location) and updates the growth of the children and her belly if she's expecting
	 *
	 * REVIEW - We need to do 5 things; generating the appropriate newHeight, newWeight, and amnioticFluidVolume by each foetus as well as updating the developmentWeek and belly size of the mother. Some genes and drugs will also be able to affect this so there is need to take note
	 *
	 * TODO - Add side effects to womb Health
	 *
	 * @param womb
	 * @param newTime
	 * @param inputUser
	 * @returns
	 */
	updateGrowth(newTime: Date, inputUser: PlayerV0_0_1) {
		const womb = this.womb,
			elapsedTime = newTime.getTime() - this.lastUpdate.getTime();

		this.fetuses.forEach((targetFetus) => {
			// Determine how much to progress the fetus since the last update
			// Also get useful data

			// Get the total gestation time for the fetus
			const gestationPeriod = targetFetus.gestDuration;

			// If, for some reason, time moves backwards, just exit the function (for now at least)
			// TODO - Add a way to reverse growth. I feel like letting it receive negative values would be exactly what I need but eh, feels like something else would break and I'm not in the mood for it yet.
			if (elapsedTime < 0) return;

			// Reduce the duration of sideEffects
			const sideEffects = womb.sideEffects;

			let key: keyof typeof sideEffects;

			for (key in sideEffects) {
				const data = sideEffects[key];

				if (data) data.currDuration -= elapsedTime;
			}

			// SECTION - Determine how much to increase the `developmentRatio` of the fetus
			let additionalDevelopmentProgress =
				(elapsedTime / gestationPeriod) * PregConstants.MAX_DEVELOPMENT_STATE; // NOTE - Just think of this to be like a percentage cus it'll be added to the `developmentRatio` which is also a percentage/ratio

			// SECTION - Apply the effects of relevant perks during pregnancy

			// ANCHOR - GESTATOR PERK
			const perks = womb.perks;
			const gestatorPerk = perks.gestator;
			// Apply the gestator perk boost, if any
			const gestatorPerkSpeedBoost = gestatorPerk
				? (gestatorPerk.currLevel / Womb.perks.gestator.maxLevel) *
					PregConstants.GESTATOR_PERK_MAX_SPEED_BOOST
				: 0;

			additionalDevelopmentProgress +=
				additionalDevelopmentProgress * gestatorPerkSpeedBoost;

			// ANCHOR - IMMUNITY PERK
			const immunityPerk = perks.immunityBoost;
			inputUser.immunity += immunityPerk
				? (immunityPerk.currLevel / Womb.perks.immunityBoost.maxLevel) *
					PregConstants.IMMUNITY_PERK_MAX_BOOST_PER_FETUS *
					additionalDevelopmentProgress
				: 0;
			// !SECTION

			// Add the additional progress into the fetus's data and make sure it doesn't exceed the limit. It can go beyond 100, and that means the fetus is overdue
			const newDevelopmentRatio =
				targetFetus.devRatio + additionalDevelopmentProgress;
			// Save the current development ratio for use later
			const oldDevelopmentRatio = targetFetus.devRatio;

			// Update the data
			targetFetus.devRatio =
				targetFetus.devRatio < newDevelopmentRatio
					? newDevelopmentRatio
					: targetFetus.devRatio;
			// !SECTION

			// SECTION - Determine the newHeight, newWeight, and newFluidVolume (and also the belly size) using newDevelopmentRatio
			// TODO - Add drugs, eating habits and conditions that can also affect these.

			// Get the new gestation week after having the developmentRatio updated
			let newFetalGestationalWeek = targetFetus.gestWeek;
			if (!newFetalGestationalWeek)
				newFetalGestationalWeek = GestationalWeek.One;

			let newWeight = targetFetus.weight;
			let newHeight = targetFetus.height;
			let newFluidVolume = targetFetus.fluid;

			// I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id. This should allow for variation while still having similar values

			let {
				fluid: fluidDiff,
				height: heightDiff,
				weight: weightDiff,
			} = Fetus.calcGrowthStatChange(oldDevelopmentRatio, newDevelopmentRatio);

			// check for the polyhydramnios condition
			if (perks?.polyhydramnios) {
				fluidDiff +=
					(perks.polyhydramnios.currLevel /
						Womb.perks.polyhydramnios.maxLevel) *
					PregConstants.POLYHYDRAMNIOS_PERK_MAX_FLUID_PRODUCTION_BOOST *
					fluidDiff;
			}

			console.log(
				`oldDevelopmentRatio: ${oldDevelopmentRatio}, newDevelopmentRatio: ${newDevelopmentRatio}`,
			);
			console.log(
				`weightDiff: ${weightDiff}, heightDiff: ${heightDiff}, fluidDiff: ${fluidDiff}`,
			);

			// SECTION - Using the fetus's id to alter the gained a bit
			const bitCheck =
				(targetFetus.id & (1 << getRandomIntegerInRange(0, 16))) !== 0; // Randomly pick the index of a bit and check if it's true
			const bitCheck2 =
				(targetFetus.id & (1 << getRandomIntegerInRange(0, 16))) !== 0; // Do it again :3
			const bitCheck3 =
				(targetFetus.id & (1 << getRandomIntegerInRange(0, 16))) !== 0; // And again :D
			// !SECTION

			// WEIGHT
			const weightBonusOrReduction = getRandomFloatInRange(
				weightDiff * 0,
				weightDiff * (Math.abs(Math.sin(targetFetus.id)) / 5),
			);

			// HEIGHT
			const heightBonusOrReduction = getRandomFloatInRange(
				heightDiff * 0.0,
				heightDiff * (Math.abs(Math.sin(targetFetus.id)) / 5),
			);

			// FLUID.
			const fluidBonus = getRandomFloatInRange(
				fluidDiff * 0.0,
				fluidDiff * (Math.abs(Math.sin(targetFetus.id)) / 5),
			);

			// Add the regular diffs before the bonus/reductions
			newWeight += weightDiff;
			newHeight += heightDiff;
			// TODO - Make this amount fluctuate depending on the amount of fetuses in the womb
			newFluidVolume += fluidDiff;

			if (bitCheck) newWeight += weightBonusOrReduction;
			else newWeight -= weightBonusOrReduction;

			if (bitCheck2) newHeight += heightBonusOrReduction;
			else newHeight -= heightBonusOrReduction;

			// For fluid, there will be no deductions, only additions/no change
			if (bitCheck3) newFluidVolume += fluidBonus;
			// !SECTION

			// SECTION - Update relevant values abt the fetus. Make sure that the values don't reduce
			targetFetus.weight =
				targetFetus.weight < newWeight ? newWeight : targetFetus.weight;
			targetFetus.height =
				targetFetus.height < newHeight ? newHeight : targetFetus.height;
			// Amniotic fluid volume is the only one (out of the 3) that can reduce
			if (newFetalGestationalWeek > GestationalWeek.MAX) {
				// Amniotic volume begins to reduce close to the end of the gestational weeks so clamp it somewhere to prevent "absurd" values
				targetFetus.fluid =
					newFluidVolume < PregConstants.MINIMUM_VOLUME_OF_AMNIOTIC_FLUID
						? PregConstants.MINIMUM_VOLUME_OF_AMNIOTIC_FLUID
						: newFluidVolume;
			} else {
				targetFetus.fluid = newFluidVolume;
			}

			// Adjust fetal hp
			targetFetus.hp = (womb.hp / womb.maxHp) * WombHealth.FULL_VITALITY;

			// Consume some of the user's fullness
			// REVIEW -  Every 2% of `additionalDevelopmentProgress` consumes 1 fullness point.
			//        - Every 2kg of fetal weight consumes 1 fullness point.
			//        - However, `additionalDevelopmentProgress` must be above 0 for any calculation to occur. So spamming this function wouldn't lead to unintended issues.
			let fullnessToConsume =
				(additionalDevelopmentProgress * (targetFetus.weight / 1000)) / 2;
			fullnessToConsume += fullnessToConsume * (gestatorPerkSpeedBoost * 0.3);
			inputUser.fullness -= fullnessToConsume;

			// Replace the data of the fetus with the updated one
			this.fetuses.set(targetFetus.id, targetFetus);
		});

		// Apply womb damage
		womb.addHp(-womb.calcHpDrain(elapsedTime));

		// Increase the womb's exp
		womb.exp += womb.updateExpValue();

		// Update belly size during pregnancy
		womb.updateBellySize();

		// Update the dev ratio record for all fetuses
		this.fetuses.forEach((fetus) => {
			fetus.lastDevRatio = fetus.devRatio; // Update it
		});

		this.lastUpdate = newTime;

		return true;
	}

	/** Ensure the state isn't out of sync */
	private _updateStateMachine() {
		this._pregStateMachine.updateToLatest();
	}

	/** Fetches the most up-to-date state */
	private get _stateInfo() {
		this._updateStateMachine();

		return this._pregStateMachine.stateInfo;
	}

	/** Whether the pregnancy is ready for birth */
	get canBirth() {
		return this._stateInfo.canBirth;
	}

	get overdue() {
		return this._stateInfo.overdue;
	}

	get stageName() {
		return this._stateInfo.name;
	}
}
