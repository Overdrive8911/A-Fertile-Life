import { ReactiveMap } from "@solid-primitives/map";
import { createMutable } from "solid-js/store";
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import type { GameDateAndTime } from "~/game/date-and-time/class";
import { GAME_VARIABLES } from "~/game/engine/engine";
import { ClassId } from "~/game/shared/enums";
import {
	getRandomFloatInRange,
	getRandomIntegerInRange,
} from "~/game/shared/utils";
import type { NumberKeys } from "~/types/generics";
import type { UUID } from "~/types/uuid";
import { getRandomUUID } from "~/utils/random";
import {
	FetalGrowthStatsEnum,
	GestationalWeek,
	PregConstants,
	WombHealth,
} from "../enums";
import { Fetus } from "./fetus";
import { Womb } from "./womb";

type SerializedPregnancy = {
	id: UUID;
	fetuses: Map<number, ReturnType<typeof Fetus.prototype.toJSON>>;
	dateConceived: GameDateAndTime;
};

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
	dateConceived = GAME_VARIABLES.gameDateAndTime;

	static classId = ClassId.PREGNANCY;

	constructor(womb: Womb, numOfFetuses = 1) {
		for (let i = 0; i < numOfFetuses; i++) {
			new Fetus(this);
		}

		// Connect this pregnancy to the womb
		const pregnancyId = getRandomUUID();
		this.womb = womb;
		this.id = pregnancyId;
		womb.pregnancies.set(pregnancyId, this);

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	static fromJSON(womb: Womb, data: SerializedPregnancy): Pregnancy {
		const pregnancy = new Pregnancy(womb),
			{ dateConceived, fetuses, id } = data;

		pregnancy.dateConceived = dateConceived;
		pregnancy.id = id;
		pregnancy.fetuses = new ReactiveMap(
			fetuses
				.entries()
				.map(([fetusId, serializedFetus]) => [
					fetusId,
					Fetus.fromJSON(pregnancy, serializedFetus),
				]),
		);

		return pregnancy;
	}

	toJSON(): SerializedPregnancy {
		return {
			dateConceived: this.dateConceived,
			fetuses: new Map(
				this.fetuses
					.entries()
					.map(([fetusId, fetus]) => [fetusId, fetus.toJSON()]),
			),
			id: this.id,
		};
	}

	get size() {
		return this.fetuses.size;
	}

	/** Returns the averages of the numeric props of fetuses in the pregnancy */
	get averageStats(): Record<FetusProps, number> {
		let {
			devRatio,
			fluid,
			gestationalWeek,
			gestationDuration,
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
			gestationalWeek: 0,
			gestationDuration: 0,
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
			gestationalWeek += fetus.gestationalWeek;
			gestationDuration += fetus.gestationDuration;
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
			gestationalWeek: gestationalWeek / size,
			gestationDuration: gestationDuration / size,
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
	 * @param elapsedTime - in seconds
	 * @param inputUser
	 * @returns
	 */
	updateGrowth(elapsedTime: number, inputUser = GAME_VARIABLES.player) {
		const womb = this.womb;

		this.fetuses.forEach((targetFetus) => {
			// Determine how much to progress the fetus since the last update
			// Also get useful data

			// Get the total gestation time for the fetus
			const gestationPeriod = targetFetus.gestationDuration;

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
			let newFetalGestationalWeek = targetFetus.gestationalWeek;
			if (!newFetalGestationalWeek)
				newFetalGestationalWeek = GestationalWeek.One;

			let newWeight = targetFetus.weight;
			let newHeight = targetFetus.height;
			let newFluidVolume = targetFetus.fluid;

			let weightDiff: number = 0;
			let heightDiff: number = 0;
			let fluidDiff: number = 0;

			// I'm not going to use the stats from gFetalGrowthOverGestationalWeeks directly. Rather, I'll calculate the difference in stats between the previous gestational week and alter them a bit based on the fetus's id. This should allow for variation while still having similar values

			// To remove repetition
			const getStatDiff = (stat: FetalGrowthStatsEnum) => {
				return Fetus.calcGrowthStatChange(
					oldDevelopmentRatio,
					newDevelopmentRatio,
					stat,
				);
			};

			weightDiff = getStatDiff(FetalGrowthStatsEnum.WEIGHT);
			heightDiff = getStatDiff(FetalGrowthStatsEnum.HEIGHT);
			fluidDiff = getStatDiff(FetalGrowthStatsEnum.AMNIOTIC_FLUID);

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
		womb.addHp(womb.calculateHealthDamage());

		// Increase the womb's exp
		womb.exp += womb.updateExpValue();

		// Update belly size during pregnancy
		womb.updateBellySize();

		// Update the dev ratio record for all fetuses
		this.fetuses.forEach((fetus) => {
			fetus.lastDevRatio = fetus.devRatio; // Update it
		});

		return true;
	}
	// !SECTION

	/**
	 * I could probably use the current time in milliseconds / seconds and the day and / or maybe their id. Instead of relying on random values.
	 */
	get canBirth() {
		if (this.isOverdue) return true;

		const devRatio = this.averageStats.devRatio;

		const chance =
			((((GAME_VARIABLES.gameDateAndTime.date.getTime() / 1000) *
				this.id.charCodeAt(0)) %
				devRatio) /
				devRatio) *
			100;

		return devRatio >= PregConstants.MAX_DEVELOPMENT_STATE
			? true
			: devRatio >= PregConstants.MIN_NORMAL_BIRTH_THRESHOLD &&
					chance % 100 <= 25
				? true
				: devRatio >= PregConstants.PREEMIE_BIRTH_THRESHOLD &&
						chance % 100 <= 10
					? true
					: devRatio >= PregConstants.VERY_PREEMIE_BIRTH_THRESHOLD &&
						chance % 100 <= 10;
	}

	get isOverdue() {
		return this.averageStats.devRatio > PregConstants.MAX_DEVELOPMENT_STATE;
	}
}
