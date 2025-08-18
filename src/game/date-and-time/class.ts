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
class GameDateAndTime
	extends Date
	implements SugarBoxCompatibleClassInstance<string>
{
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
		super(...args);
		// Ensure the correct prototype is used
		Object.setPrototypeOf(this, GameDateAndTime.prototype);
	}

	static classId = ClassId.DATE_AND_TIME;

	static fromJSON(data: string): GameDateAndTime {
		return new GameDateAndTime(data);
	}

	override toJSON(): string {
		return this.toISOString();
	}

	/** Simpler way to get relevant data */
	get data(): DateData {
		return {
			date: this.getUTCDate(),
			day: days[this.getUTCDay()],
			hours: this.getUTCHours(),
			month: months[this.getUTCMonth()],
			minutes: this.getUTCMinutes(),
			year: this.getUTCFullYear(),
		};
	}

	/**
	 * In case you need to assign the value of another date or increment the data
	 *
	 * @param dateOrValueToIncrementBy a new date to replace the current date with or the time in milliseconds to increment the current date by
	 */
	update(dateOrValueToIncrementBy: Date | number) {
		this.setTime(
			dateOrValueToIncrementBy instanceof Date
				? dateOrValueToIncrementBy.getTime()
				: this.getTime() + dateOrValueToIncrementBy,
		);
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

		this.update(timeToTravel * 1000);
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

		this.update(
			new Date(
				this.getFullYear(),
				this.getUTCMonth(),
				this.getUTCDate() + days,
				hours,
				minutes,
			),
		);
	}
	/** Skip to the next day and stop at the particular hour(0 till 23) and minutes(0 till 59) */
	skipToNextDayWithSpecificTime(hours: number, minutes: number) {
		this.skipTimeToSpecificTime(1, hours, minutes);
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Enforce static props>
type ClassCheck = SugarBoxCompatibleClassConstructorCheck<
	string,
	typeof GameDateAndTime
>;

export { GameDateAndTime };
