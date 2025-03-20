export type Widgets = {
  /**
   * Can be used as a stat bar or whatever.
   *
   * @param value - A decimal between 0 and 1 inclusively, where 0 is 0% and 1 is 100%.
   * @param lowColor - A valid css color representing the `low` percentage. Can be skipped with `""`. Defaults to `red`
   * @param midColor - A valid css color representing the `middle` percentage. Can be skipped with `""`. Defaults to `yellow`
   * @param highColor - A valid css color representing the `high` percentage. Defaults to `green`
   * @param css - An array of 2-value string arrays representing the property and value of css to add directly to the meter
   * @returns
   */
  meter: (
    value: number,
    lowColor?: string,
    midColor?: string,
    highColor?: string,
    ...css: [prop: string, value: string][]
  ) => void;
};
