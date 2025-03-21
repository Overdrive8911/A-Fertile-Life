export type Widgets = {
  /**
   * Can be used as a stat bar or whatever
   *
   * @param value - A decimal between 0 and 1 inclusively, where 0 is 0% and 1 is 100%.
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
    value: number,
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
