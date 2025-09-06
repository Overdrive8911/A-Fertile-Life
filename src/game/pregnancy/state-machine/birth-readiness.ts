/** biome-ignore-all lint/suspicious/noConstEnum: <will be inlined> */
import type { EnumToArray } from "~/types/generics";
import type { UUID } from "~/types/uuid";
import { getUniqueNumberFromSumOfCharCodes } from "~/utils/string";
import { PregConstants } from "../enums";

const enum BirthReadinessState {
	NOT_READY,
	VERY_PREEMIE_POSSIBLE,
	PREEMIE_POSSIBLE,
	EARLY_TERM_POSSIBLE,
	FULL_TERM_READY,
	OVERDUE,
}

const birthReadinessValues = [
	BirthReadinessState.NOT_READY,
	BirthReadinessState.VERY_PREEMIE_POSSIBLE,
	BirthReadinessState.PREEMIE_POSSIBLE,
	BirthReadinessState.EARLY_TERM_POSSIBLE,
	BirthReadinessState.FULL_TERM_READY,
	BirthReadinessState.OVERDUE,
] as const satisfies EnumToArray<BirthReadinessState>;

type BirthReadinessContext = {
	devRatio: number;
	pregId: UUID;
	currentTime: number;
};

type BirthReadinessStateTransition = {
	from: BirthReadinessState;
	to: BirthReadinessState;
	condition: (context: BirthReadinessContext) => boolean;
};

const transitions = [
	{
		from: BirthReadinessState.NOT_READY,
		to: BirthReadinessState.VERY_PREEMIE_POSSIBLE,
		condition: (ctx) =>
			ctx.devRatio >= PregConstants.VERY_PREEMIE_BIRTH_THRESHOLD,
	},
	{
		from: BirthReadinessState.VERY_PREEMIE_POSSIBLE,
		to: BirthReadinessState.PREEMIE_POSSIBLE,
		condition: (ctx) => ctx.devRatio >= PregConstants.PREEMIE_BIRTH_THRESHOLD,
	},
	{
		from: BirthReadinessState.PREEMIE_POSSIBLE,
		to: BirthReadinessState.EARLY_TERM_POSSIBLE,
		condition: (ctx) =>
			ctx.devRatio >= PregConstants.MIN_NORMAL_BIRTH_THRESHOLD,
	},
	{
		from: BirthReadinessState.EARLY_TERM_POSSIBLE,
		to: BirthReadinessState.FULL_TERM_READY,
		condition: (ctx) => ctx.devRatio >= PregConstants.MAX_DEVELOPMENT_STATE,
	},
	{
		from: BirthReadinessState.FULL_TERM_READY,
		to: BirthReadinessState.OVERDUE,
		condition: (ctx) => ctx.devRatio > PregConstants.MAX_DEVELOPMENT_STATE,
	},
] as const satisfies BirthReadinessStateTransition[];

const birthChances = {
	[BirthReadinessState.NOT_READY]: 0,
	[BirthReadinessState.VERY_PREEMIE_POSSIBLE]: 10,
	[BirthReadinessState.PREEMIE_POSSIBLE]: 10,
	[BirthReadinessState.EARLY_TERM_POSSIBLE]: 25,
	[BirthReadinessState.FULL_TERM_READY]: 75,
	[BirthReadinessState.OVERDUE]: 90,
} as const satisfies Record<BirthReadinessState, number>;

class BirthReadinessStateMachine {
	private _currentState: BirthReadinessState = BirthReadinessState.NOT_READY;

	constructor(initialContext?: BirthReadinessContext) {
		if (initialContext) this.update(initialContext);
	}

	/**
	 * Updates the state machine based on current pregnancy context
	 */
	update(context: BirthReadinessContext): void {
		// Find the highest state we can transition to
		let targetState = this._currentState;

		for (const transition of transitions) {
			if (this.canTransition(transition, context)) {
				targetState = transition.to;
			}
		}

		this._currentState = targetState;
	}

	private canTransition(
		transition: BirthReadinessStateTransition,
		context: BirthReadinessContext,
	): boolean {
		// Can only transition forward or stay in same state
		const currentIndex = birthReadinessValues.indexOf(this._currentState);
		const fromIndex = birthReadinessValues.indexOf(transition.from);
		const toIndex = birthReadinessValues.indexOf(transition.to);

		return (
			currentIndex <= fromIndex &&
			toIndex > fromIndex &&
			transition.condition(context)
		);
	}

	/**
	 * Determines if birth can occur based on current state and probability
	 */
	canBirth(context: BirthReadinessContext): boolean {
		const chanceThreshold = birthChances[this._currentState];

		if (chanceThreshold === 0) {
			return false;
		}

		const randomChance = this.calculateBirthChance(context);
		return randomChance <= chanceThreshold;
	}

	private calculateBirthChance(context: BirthReadinessContext): number {
		const chance =
			(((context.currentTime *
				getUniqueNumberFromSumOfCharCodes(context.pregId)) %
				context.devRatio) /
				context.devRatio) *
			100;
		return chance % 100;
	}

	get state(): BirthReadinessState {
		return this._currentState;
	}

	get stateInfo() {
		return {
			state: this._currentState,
			canBirthChance: birthChances[this._currentState],
			description: this._getStateDescription,
		};
	}

	private get _getStateDescription() {
		switch (this._currentState) {
			case BirthReadinessState.NOT_READY:
				return "Too early for birth";
			case BirthReadinessState.VERY_PREEMIE_POSSIBLE:
				return "Very premature birth possible (high risk)";
			case BirthReadinessState.PREEMIE_POSSIBLE:
				return "Premature birth possible";
			case BirthReadinessState.EARLY_TERM_POSSIBLE:
				return "Early term birth possible";
			case BirthReadinessState.FULL_TERM_READY:
				return "Full term - ready for birth";
			case BirthReadinessState.OVERDUE:
				return "Overdue - birth imminent";
			default:
				return "Unknown state";
		}
	}
}
