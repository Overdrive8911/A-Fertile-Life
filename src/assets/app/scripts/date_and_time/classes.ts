import { attachClassToWindow } from "../declarations/general_declarations";

/**
 * Mostly just the `Date` class with a few utility methods sprinkled in
 */
export class GameDateAndTime extends Date {
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
    ms?: number
  );
  constructor(...args: Parameters<typeof Date>) {
    super(...args);
    // Ensure the correct prototype is used
    Object.setPrototypeOf(this, GameDateAndTime.prototype);
  }

  static days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  static months = [
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

  clone() {
    return new GameDateAndTime(this);
  }

  toJSON() {
    return Serial.createReviver(
      `new ${GameDateAndTime.name}(${this.getTime()})`
    ) as any;
  }

  /**
   * Returns the current time of the day in digital format (hour and minutes)
   *
   * E.g `6:05 AM`
   */
  get timeText() {
    const hours = this.getUTCHours();
    const minutes = this.getUTCMinutes();
    const isAM = hours < 12;

    const formattedHours = (hours % 12 || 12).toLocaleString(undefined, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const formattedMinutes = minutes.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return `${formattedHours}:${formattedMinutes} ${
      isAM ? "AM" : "PM"
    }` as const;
  }

  /**
   * Returns the day (both text and number) and month
   *
   * E.g `WED, 3 FEB`
   */
  get dateText() {
    return `${GameDateAndTime.days[this.getUTCDay()]}, ${this.getUTCDate()} ${
      GameDateAndTime.months[this.getUTCMonth()]
    }` as const;
  }

  /**
   * In case you need to assign the value of another date
   */
  update(date: Date) {
    this.setTime(date.getTime());
  }
}

attachClassToWindow(GameDateAndTime);
