import { signalify } from "classy-solid";
import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { AVERAGE_WALKING_SPEED } from "../shared/constants";
import { ClassId } from "../shared/enums";
import { getRandomFloatInRange } from "../shared/utils";

type DateData = {
	day: Extract<(typeof days)[keyof typeof days], string>;
	/** Number in month */
	date: number;
	month: Extract<(typeof months)[keyof typeof months], string>;
	year: number;
	/** 24-hour style */
	hours: number;
	minutes: number;
};

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const months = [
	"JAN",
	"FEB",
	"MAR",
	"APR",
	"MAY",
	"JUN",
	"JUL",
	"AUG",
	"SEP",
	"OCT",
	"NOV",
	"DEC",
] as const;

/**
 * Mostly just the `Date` class with a few utility methods sprinkled in
 */
class GameDateAndTime implements SugarBoxCompatibleClassInstance<number> {
	date: Date;

	// Mimic the constructor arguments for the regular date class
	constructor();
	constructor(value: number | string | Date);
	constructor(
		year: number,
		month: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number,
	);
	constructor(...args: Parameters<typeof Date>) {
		this.date = new Date(...args);

		signalify(this);
	}

	static classId = ClassId.DATE_AND_TIME;

	static fromJSON(data: number): GameDateAndTime {
		return new GameDateAndTime(data);
	}

	toJSON(): number {
		return this.date.getTime();
	}

	/** Simpler way to get relevant data */
	get data(): DateData {
		return {
			date: this.date.getUTCDate(),
			day: days[this.date.getUTCDay()] ?? "MON",
			hours: this.date.getUTCHours(),
			month: months[this.date.getUTCMonth()] ?? "JAN",
			minutes: this.date.getUTCMinutes(),
			year: this.date.getUTCFullYear(),
		};
	}

	/**
	 * In case you need to assign the value of another date or increment the data
	 *
	 * @param dateOrValueToIncrementBy a new date to replace the current date with or the time in milliseconds to increment the current date by
	 *
	 * @returns a new instance of `GameDateAndTime` with the updated time (useful in cases where you want to chain the method or force reactivity)
	 */
	update(dateOrValueToIncrementBy: Date | number) {
		this.date.setTime(
			dateOrValueToIncrementBy instanceof Date
				? dateOrValueToIncrementBy.getTime()
				: this.date.getTime() + dateOrValueToIncrementBy,
		);

		this.date = new Date(this.date.getTime());
	}

	updateTimeWithDistance(
		dist: number,

		/* in metres per second*/
		movementSpeed?: number,
	) {
		const averageWalkingSpeed = AVERAGE_WALKING_SPEED[0];
		const lowerBound = averageWalkingSpeed * 10 - 1;
		const upperBound = averageWalkingSpeed * 10 + 1;

		// Get the time to travel in seconds
		const timeToTravel = Math.floor(
			(dist / (movementSpeed ?? averageWalkingSpeed)) *
				getRandomFloatInRange(lowerBound, upperBound),
		);

		return this.update(timeToTravel * 1000);
	}

	/** Skip forward `day` times to the specified time (in hrs and minutes) */
	skipTimeToSpecificTime(days: number, hours: number, minutes: number) {
		hours++;

		if (hours < 0) {
			hours = 0;
		}
		hours = hours % 24;

		if (minutes < 0) {
			minutes = 0;
		}
		minutes = minutes % 60;

		return this.update(
			new Date(
				this.date.getFullYear(),
				this.date.getUTCMonth(),
				this.date.getUTCDate() + days,
				hours,
				minutes,
			),
		);
	}
	/** Skip to the next day and stop at the particular hour(0 till 23) and minutes(0 till 59) */
	skipToNextDayWithSpecificTime(hours: number, minutes: number) {
		return this.skipTimeToSpecificTime(1, hours, minutes);
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Enforce static props>
type ClassCheck = SugarBoxCompatibleClassConstructorCheck<
	number,
	typeof GameDateAndTime
>;

export { GameDateAndTime };
