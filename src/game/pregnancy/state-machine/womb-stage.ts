import type { Womb } from "../classes/womb";

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
	  if (this._womb.isPerkAtMaxLvl("noPostpartum")) return null

		if (this._womb.postpartum) return new Postpartum(this._womb);

		return null;
	}

	protected _tryLaborTransition() {
		if (this._relevantPregnancyStageName === "Labor")
			return new Labor(this._womb);

		return null;
	}

	protected get _baseFertilityModifierFromPerksAndSideEffects() {
		let baseModifier = 1;

		const {hyperFertility:hyperFertilityPerk, gestator:gestatorPerk} = this._wombPerks;

		if (hyperFertilityPerk) {
			// Give a large multiplier
			baseModifier *= 1.5;

			// Gently add a smol increase it with every extra level
			let k = 1;
			while (k < hyperFertilityPerk.currLevel) {
				baseModifier *= (1 + (hyperFertilityPerk.currLevel / 20) )
				k++;
			}
		}

		if (gestatorPerk){
		baseModifier *=1.1
		}

		return baseModifier;
	}

	/** Multiplicative modifier for increasing or reducing the womb's fertility.
	 *
	 * Values > 1 increment the fertility, while floats between 0 and 1 decrement the fertility
	 */
	abstract readonly fertilityMod:number

	/** Try to transition to a new state depending on some checks within.
	 *
	 * @returns a single eligible state to transition to, or itself if no eligible state exists
	 */
	abstract transition(): BaseWombState;
}

class Fertile extends BaseWombState {
 	get fertilityMod() {
		return this._baseFertilityModifierFromPerksAndSideEffects;
	}

	override transition(): Conception | Fertile {
		if (this._relevantPregnancyStageName === "Conception")
			return new Conception(this._womb);

		return this;
	}
}

/** Utility abstract class that implements shared functionality of all pregnancy-related states */
abstract class BasePregnancyState extends BaseWombState{

  override get fertilityMod() {
    if (this._wombPerks.superFet) {
      return this._baseFertilityModifierFromPerksAndSideEffects * 0.8;
    }

    return 0;
  }

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
	override get fertilityMod() {return 0}

	override transition() {
		return this._tryPostPartomTransition() ?? this;
	}
}

class Postpartum extends BaseWombState {
	// Can't get pregnant for any reason during postpartum
	override readonly fertilityMod = 0

	override transition() {
		// Perform check to see if fertility has been regained
		if (!this._womb.postpartum || this._womb.isPerkAtMaxLvl("noPostpartum")) return new Fertile(this._womb);

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
		};
	}
}
