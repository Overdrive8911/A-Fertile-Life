import type { SugarcubeVariable } from "../../declarations/types";

export type Widgets = {
  /**
   * Can be used as a stat bar or whatever. It can also be styled using the class `.meter-body`
   *
   * @param value - Either a decimal between 0 and 1 inclusively, where 0 is 0% and 1 is 100% or a string representing a valid sugarcube variable name (with the $ or _) that stores the aforementioned decimal (otherwise it defaults to 1). If a variable string is passed, the meter auto-updates when the variable changes.
   * @param parentElement - The parent element to append the meter to
   * @param width - Defaults to 100% of the parent container
   * @param height - Defaults to 100% of the parent container
   * @param idOrClasses - An array of strings representing the id and/or classes to add to the meter
   * @param lowColor - A valid css color representing the `low` percentage. Can be skipped with `""`. Defaults to `red`
   * @param midColor - A valid css color representing the `middle` percentage. Can be skipped with `""`. Defaults to `yellow`
   * @param highColor - A valid css color representing the `high` percentage. Can be skipped with `""`. Defaults to `green`
   * @param emptyColor - A valid css color representing the `empty` area of the meter. Can be skipped with `""`. Defaults to `transparent`
   * @returns
   */
  meter: (
    value: number | SugarcubeVariable,
    parentElementOrId: JQuery<HTMLElement> | `#${string}`,
    width?: string,
    height?: string,
    idOrClasses?: (`#${string}` | `.${string}`)[],
    lowColor?: string,
    midColor?: string,
    highColor?: string,
    emptyColor?: string
  ) => void;
};
