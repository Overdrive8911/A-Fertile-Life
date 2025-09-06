import { getDominantAverage } from "~/game/shared/utils";
import { getUniqueNumberFromSumOfCharCodes } from "~/utils/string";
import type { Pregnancy } from "../classes/pregnancy";
import { GestationalWeek } from "../enums";

// biome-ignore lint/suspicious/noConstEnum: <Will be inlined>
const enum RiskLevel {
	NORMAL,
	LOW_RISK,
	HIGH_RISK,
	CRITICAL,
}

abstract class BasePregState {
	constructor(protected _pregnancy: Pregnancy) {}

	// TODO: Make this rely on more factors like fetus numbers, overdue, etc
	protected get _riskLvl(): RiskLevel {
		const riskLevels: RiskLevel[] = [];
		const womb = this._pregnancy.womb,
			hpRatio = womb.hpRatio,
			maxCapRatio = womb.maxCapRatio;

		const healthRisk =
			hpRatio >= 0.75
				? RiskLevel.NORMAL
				: hpRatio >= 0.5
					? RiskLevel.LOW_RISK
					: hpRatio >= 0.25
						? RiskLevel.HIGH_RISK
						: RiskLevel.CRITICAL;
		const capacityRisk =
			maxCapRatio <= 0.75
				? RiskLevel.NORMAL
				: maxCapRatio <= 0.8
					? RiskLevel.LOW_RISK
					: maxCapRatio <= 0.9
						? RiskLevel.HIGH_RISK
						: RiskLevel.CRITICAL;

		riskLevels.push(healthRisk, capacityRisk);

		return Math.round(getDominantAverage(...riskLevels));
	}

	protected get _pregStats() {
		return this._pregnancy.averageStats;
	}

	protected get _devRatio() {
		return this._pregStats.devRatio;
	}

	protected get _gestWeek() {
		return this._pregStats.gestWeek;
	}

	private _getBirthReadiness(): number {
		const stats = this._pregStats;
		const pregnancyId = this._pregnancy.id;

		// Base birth readiness: 0% at start, increases with development
		const developmentProgress = stats.devRatio;

		const pregIdNumber = getUniqueNumberFromSumOfCharCodes(pregnancyId);

		// Pregnancy-specific variation (±5% based on ID for consistency)
		const pregnancyVariation = (pregIdNumber % 10) - 5;

		// Small progression variations based on physical stats (±25%)
		const progressionFactor =
			(stats.volume % 30) -
			15 + // ±15% based on weight
			((stats.gestWeek % 20) - 10); // ±10% based on week
		// Conception timing factor (±5%)
		const conceptionFactor = (this._pregnancy.conception.getDate() % 10) - 5;

		const devProgressFactor =
			((developmentProgress + pregIdNumber) %
				(developmentProgress * 0.25 * 2)) -
			developmentProgress * 0.25;

		// +0% / +2% / +8% / +24% Riskier pregnancies are more likely to birth
		const riskLvl = this._riskLvl,
			riskFactor = riskLvl * 2 ** riskLvl;

		// ±35% + (±25% of the development progress) possible change + (0~24%)
		const additiveMultipliers =
			pregnancyVariation +
			progressionFactor +
			conceptionFactor +
			devProgressFactor +
			riskFactor;

		// Combine all factors - only clamp lower bound to 0, allow exceeding 100% for overdue pregnancies
		const chance = developmentProgress + additiveMultipliers;

		return Math.max(0, chance);
	}

	/**
	 * Must be used inside the `canBirth` getter
	 *
	 * @param birthChance a percentage (0% - 100%). Denotes the threshold that the `birthReadiness` must surpass for birth to occur. I.e. lower values == higher chance of birth
	 */
	protected _canBirth(birthChanceThreshold: number): boolean {
		const birthReadiness = this._getBirthReadiness();

		return birthReadiness >= birthChanceThreshold;
	}

	/** Utility method for attempting to enter the Labor state */
	protected _tryToEnterLabor(): Labor | null {
		if (this.canBirth) return new Labor(this._pregnancy);

		return null;
	}

	/** Whether or not the pregnancy is ready for and can be birthed */
	abstract readonly canBirth: boolean;

	/** Try to transition to a new state depending on some checks within.
	 *
	 * @returns a single eligible state to transition to, or itself if no eligible state exists
	 */
	abstract transition(): BasePregState;

	abstract readonly name:
		| "Conception"
		| "Early Term"
		| "Mid Term"
		| "Late Term"
		| "Full Term"
		| "Overdue"
		| "Labor";
}

class Conception extends BasePregState {
	override readonly name = "Conception";

	override readonly canBirth = false;

	override transition(): this | EarlyDevelopment | Labor {
		return this._gestWeek >= GestationalWeek.EARLY_DEVELOPMENT
			? new EarlyDevelopment(this._pregnancy)
			: this;
	}
}

class EarlyDevelopment extends BasePregState {
	override readonly name = "Early Term";

	override readonly canBirth = false;

	override transition() {
		return this._gestWeek >= GestationalWeek.MID_DEVELOPMENT
			? new MidDevelopment(this._pregnancy)
			: this;
	}
}

class MidDevelopment extends BasePregState {
	override readonly name = "Mid Term";

	override get canBirth() {
		return this._canBirth(95);
	}

	override transition() {
		return (
			this._tryToEnterLabor() ??
			(this._gestWeek >= GestationalWeek.LATE_DEVELOPMENT
				? new LateDevelopment(this._pregnancy)
				: this)
		);
	}
}

class LateDevelopment extends BasePregState {
	override readonly name = "Late Term";

	override get canBirth() {
		return this._canBirth(85);
	}

	override transition() {
		return (
			this._tryToEnterLabor() ??
			(this._gestWeek >= GestationalWeek.FULL_TERM
				? new FullTerm(this._pregnancy)
				: this)
		);
	}
}

class FullTerm extends BasePregState {
	override readonly name = "Full Term";

	override get canBirth() {
		return this._canBirth(70);
	}

	override transition() {
		return (
			this._tryToEnterLabor() ??
			(this._gestWeek >= GestationalWeek.OVERDUE
				? new Overdue(this._pregnancy)
				: this)
		);
	}
}

class Overdue extends BasePregState {
	override readonly name = "Overdue";

	override get canBirth() {
		return this._canBirth(55);
	}
	override transition() {
		return this._tryToEnterLabor() ?? this;
	}
}

class Labor extends BasePregState {
	override readonly name = "Labor";

	override readonly canBirth = true;

	override transition() {
		return this;
	}
}

export class PregStateMachine {
	private _pregState: BasePregState;

	constructor(private _pregnancy: Pregnancy) {
		this._pregState = new Conception(this._pregnancy);

		this.updateToLatest();
	}

	/** Updates the current state by transitioning to any eligible one
	 *
	 * @returns the updated pregnancy state
	 */
	private _update() {
		this._pregState = this._pregState.transition();

		return this._pregState;
	}

	/** Continuously updates the state until it can't */
	updateToLatest() {
		let oldState = this._pregState,
			newState = this._update();

		while (oldState !== newState) {
			oldState = this._pregState;
			newState = this._update();
		}
	}

	get stateInfo() {
		const state = this._pregState;

		return {
			name: state.name,
			canBirth: state.canBirth,
			overdue: state instanceof Overdue,
			// // Maybe add current birth chance threshold for UI
			// birthChanceThreshold: this._pregState._getThreshold?.() ?? 0
		};
	}
}
