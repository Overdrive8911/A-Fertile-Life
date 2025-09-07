import { GAME_RANDOM } from "~/game/engine/engine";
import { Womb } from "../classes/womb";
import { WombHealth } from "../enums";

// COnsider Miscarriages, Infertility, and Menopause
abstract class BaseWombState {
	constructor(protected _womb: Womb) {}

	protected get _wombPerks() {
		return this._womb.perks;
	}

	protected get _wombSideEffects() {
		return this._womb.sideEffects;
	}

	/** The most advanced pregnacy, which is pretty much the only relevant one for simplicity sake */
	protected get _relevantPregnancy() {
		return this._womb.mostAdvancedPregnancy;
	}

	protected get _relevantPregnancyStageName() {
		return this._relevantPregnancy?.stageName;
	}

	protected _tryPostPartomTransition() {
		if (this._womb.isPerkAtMaxLvl("noPostpartum")) return null;

		if (this._womb.postpartum) return new Postpartum(this._womb);

		return null;
	}

	protected _tryLaborTransition() {
		if (this._relevantPregnancyStageName === "Labor")
			return new Labor(this._womb);

		return null;
	}

	private get _baseFertilityModifierFromPerksAndSideEffects() {
		let baseModifier = 1;

		const { hyperFertility, gestator, healthyWomb } = this._wombPerks;
		const {
			hyperFertility: { maxLevel: hyperFertilityMaxLvl },
			gestator: { maxLevel: gestatorMaxLvl },
			healthyWomb: { maxLevel: healthyWombMaxLvl },
		} = Womb.perks;

		if (hyperFertility) {
			// Give a large multiplier
			baseModifier *=
				1.5 + (hyperFertility.currLevel / hyperFertilityMaxLvl) * 0.5;
		}

		if (gestator) {
			baseModifier *= 1.2 + (gestator.currLevel / gestatorMaxLvl) * 0.25;
		}

		if (healthyWomb) {
			baseModifier *= 1.1 + (healthyWomb.currLevel / healthyWombMaxLvl) * 0.2;
		}

		return baseModifier;
	}

	private get _baseFertilityModifierFromBirthControl() {
		return this._womb.birthControl ? 0.1 : 1;
	}

	private get _baseFertilityModifierFromWombHealth() {
		const hpPercentage = this._womb.hpRatio * 100;

		if (hpPercentage >= WombHealth.HEALTHY) return 1;

		if (hpPercentage >= WombHealth.MEDIOCRE) return 0.85;

		return 0.2;
	}

	protected get _baseFertilityModifier() {
		return (
			this._baseFertilityModifierFromPerksAndSideEffects *
			this._baseFertilityModifierFromBirthControl *
			this._baseFertilityModifierFromWombHealth
		);
	}

	private get _baseMultiplesModifierFromWombHealth() {
		const hpPercentage = this._womb.hpRatio * 100;

		if (hpPercentage >= WombHealth.VERY_HEALTHY) return 1.15;

		if (hpPercentage >= WombHealth.HEALTHY) return 1;

		if (hpPercentage >= WombHealth.MEDIOCRE) return 0.85;

		return 0.5;
	}
	private get _baseMultiplesModifierFromPerksAndSideEffects() {
		const { hyperFertility, gestator, healthyWomb, fortifiedWomb } =
			this._wombPerks;
		const {
			hyperFertility: { maxLevel: hyperFertilityMaxLvl },
			gestator: { maxLevel: gestatorMaxLvl },
			healthyWomb: { maxLevel: healthyWombMaxLvl },
			fortifiedWomb: { maxLevel: fortifiedWombMaxLvl },
		} = Womb.perks

		let baseModifier = 1

		if (hyperFertility) {
			// Give a large multiplier
			baseModifier *=
				1.5 + (hyperFertility.currLevel / hyperFertilityMaxLvl) * 3.5;
		}

		if (gestator) {
			baseModifier *= 1.075 + (gestator.currLevel / gestatorMaxLvl) * 0.5;
		}

		if (healthyWomb) {
			baseModifier *= 1.05 + (healthyWomb.currLevel / healthyWombMaxLvl) * 0.25;
		}

		if (fortifiedWomb) {
			baseModifier *= 1 + (fortifiedWomb.currLevel / fortifiedWombMaxLvl) * 0.25;
		}

		return baseModifier
	}

	protected get _baseMultiplesModifier() {
		return this._baseMultiplesModifierFromWombHealth * this._baseMultiplesModifierFromPerksAndSideEffects
	}

	/** Multiplicative modifier for increasing or reducing the womb's fertility.
	 *
	 * Values > 1 increment the fertility, while floats between 0 and 1 decrement the fertility.
	 */
	abstract readonly fertilityMod: number;

	/** Multiplicative modifier for increasing or reducing the chance of concieving multiples per pregnancy. The higher the value, the more multiples that may be concieved. I.e. A value of 3.4 means 3 spawned fetuses., 1.7 means 2 spawned fetuses
	 *
	 * Values > 1 increment it.
		*
		* NOTE: This value can go below 1 so be sure to cap it
	 */
	abstract readonly multiplesMod: number;

	/** Try to transition to a new state depending on some checks within.
	 *
	 * @returns a single eligible state to transition to, or itself if no eligible state exists
	 */
	abstract transition(): BaseWombState;
}

class Fertile extends BaseWombState {
	override get fertilityMod() {
		return this._baseFertilityModifier;
	}

	override get multiplesMod() {
		return this._baseMultiplesModifier;
	}

	override transition(): Conception | Fertile {
		if (this._relevantPregnancyStageName === "Conception")
			return new Conception(this._womb);

		return this;
	}
}

/** Utility abstract class that implements shared functionality of all pregnancy-related states */
abstract class BasePregnancyState extends BaseWombState {
	override get fertilityMod() {
		if (this._wombPerks.superFet) {
			return this._baseFertilityModifier * 0.8;
		}

		return 0;
	}

	override get multiplesMod(){
	// Sharply reduce the chance for multiples when the womb as superfetation
	if (this._wombPerks.superFet) {
		return this._baseMultiplesModifier * (1 /3)
	}

	return 0;}
}

class Conception extends BasePregnancyState {
	override transition() {
		if (this._relevantPregnancyStageName === "Early Stage")
			return new EarlyDevelopment(this._womb);

		return this._tryPostPartomTransition() ?? this;
	}
}

class EarlyDevelopment extends BasePregnancyState {
	override transition() {
		if (this._relevantPregnancyStageName === "Mid Stage")
			return new MidDevelopment(this._womb);

		return this._tryPostPartomTransition() ?? this;
	}
}

class MidDevelopment extends BasePregnancyState {
	override transition() {
		if (this._relevantPregnancyStageName === "Late Stage")
			return new LateDevelopment(this._womb);

		return (
			this._tryLaborTransition() ?? this._tryPostPartomTransition() ?? this
		);
	}
}

class LateDevelopment extends BasePregnancyState {
	override transition() {
		if (this._relevantPregnancyStageName === "Full Term")
			return new FullTerm(this._womb);

		return (
			this._tryLaborTransition() ?? this._tryPostPartomTransition() ?? this
		);
	}
}

class FullTerm extends BasePregnancyState {
	override transition() {
		if (this._relevantPregnancyStageName === "Overdue")
			return new Overdue(this._womb);

		return (
			this._tryLaborTransition() ?? this._tryPostPartomTransition() ?? this
		);
	}
}

class Overdue extends BasePregnancyState {
	override transition() {
		return (
			this._tryLaborTransition() ?? this._tryPostPartomTransition() ?? this
		);
	}
}

class Labor extends BasePregnancyState {
	// Can't get pregnant for any reason during labor
	override get fertilityMod() {
		return 0;
	}

	override transition() {
		return this._tryPostPartomTransition() ?? this;
	}
}

class Postpartum extends BaseWombState {
	// Can't get pregnant for any reason during postpartum
	override readonly fertilityMod = 0;

	override readonly multiplesMod = 0

	override transition() {
		// Perform check to see if fertility has been regained
		if (!this._womb.postpartum || this._womb.isPerkAtMaxLvl("noPostpartum"))
			return new Fertile(this._womb);

		return this;
	}
}

export class WombStateMachine {
	private _wombState: BaseWombState;

	constructor(private _womb: Womb) {
		this._wombState = new Fertile(this._womb);

		this.updateToLatest();
	}

	/** Updates the current state by transitioning to any eligible one
	 *
	 * @returns the updated pregnancy state
	 */
	private _update() {
		this._wombState = this._wombState.transition();

		return this._wombState;
	}

	/** Continuously updates the state until it can't */
	updateToLatest() {
		let oldState = this._wombState,
			newState = this._update();

		while (oldState !== newState) {
			oldState = this._wombState;
			newState = this._update();
		}
	}

	get stateInfo() {
		const state = this._wombState;

		return {
			fertilityMod: state.fertilityMod,
			multiplesMod:state.multiplesMod
		};
	}
}
