import { TinyColor } from "@ctrl/tinycolor";
import { getSugarCubeVariableValue } from "../../../declarations/general_declarations";
import { meterBody } from "./meter.module.css";
import type { SugarcubeVariable } from "../../../declarations/types";
import { CustomMacro } from "../../../declarations/enums";

Macro.add(CustomMacro.METER, {
  handler() {
    const args = this.args;
    const val = args[0];
    const width = args[1];
    const height = args[2];
    const lowColor = args[3];
    const midColor = args[4];
    const highColor = args[5];
    const emptyColor = args[6];

    $(this.output).append(
      createMeter(val, width, height, lowColor, midColor, highColor, emptyColor)
    );
  },
});

/**
 * Can be used as a stat bar or whatever. It can also be styled using the class `.meter-body`
 *
 * @param val - Either a decimal between 0 and 1 inclusively, where 0 is 0% and 1 is 100% or a string representing a valid sugarcube variable name (with the $ or _) that stores the aforementioned decimal (otherwise it defaults to 1). If a variable string is passed, the meter auto-updates when the variable changes.
 * @param width - Defaults to `100%` of the parent container
 * @param height - Defaults to `1rem`
 * @param lowColor - A valid css color representing the `low` percentage. Can be skipped with `""`. Defaults to `red`
 * @param midColor - A valid css color representing the `middle` percentage. Can be skipped with `""`. Defaults to `yellow`
 * @param highColor - A valid css color representing the `high` percentage. Can be skipped with `""`. Defaults to `green`
 * @param emptyColor - A valid css color representing the `empty` area of the meter. Can be skipped with `""`. Defaults to `transparent`
 * @returns
 */
export type MeterArgType = Parameters<typeof createMeter>;
function createMeter(
  val: number | SugarcubeVariable,
  width: string,
  height = "1rem",
  lowColor = "red",
  midColor = "yellow",
  highColor = "green",
  emptyColor: string
) {
  let parsedVal = 1;

  if (typeof val == "number") parsedVal = val;
  else {
    const variableVal = getSugarCubeVariableValue(val);
    if (typeof variableVal == "number") {
      parsedVal = variableVal;
    }
  }
  parsedVal = parsedVal > 1 ? 1 : parsedVal < 0 ? 0 : parsedVal;

  const meterContainer = $(`<div class="${meterBody}">`);

  if (width) meterContainer.css({ width: width });
  if (height) meterContainer.css({ height: height });
  if (emptyColor) meterContainer.css({ "background-color": emptyColor });

  const meterBar = $("<div/>").css({
    width: `${parsedVal * 100}%`,
    height: "100%",
    backgroundColor: getMeterColor(parsedVal, lowColor, midColor, highColor),
  });

  // Add an event listener to dynamically update the meter if a variable is passed
  if (typeof val == "string") {
    $(window).on("change click drop keyup", () => {
      const variableVal = getSugarCubeVariableValue(val) as number;

      if (typeof variableVal == "number") {
        const newWidthPercentage =
          variableVal > 100 ? 1 : variableVal < 0 ? 0 : variableVal * 100;

        // Since the widths would be in pixels
        const meterBarWidthPercentage = Math.round(
          ((meterBar.width() ?? 0) / (meterContainer.width() ?? 1)) * 100
        );

        if (meterBarWidthPercentage != newWidthPercentage) {
          meterBar.css({
            width: `${newWidthPercentage}%`,
            backgroundColor: getMeterColor(
              newWidthPercentage / 100,
              lowColor,
              midColor,
              highColor
            ),
          });
        }
      }
    });
  }

  return meterContainer.append(meterBar);
}

function getMeterColor(
  meterVal: number,
  lowColor: string,
  midColor: string,
  highColor: string
) {
  // Helper: Parse a color string into an RGB object with an alpha channel.
  const parseColor = (color: string) => {
    const tc = new TinyColor(color);
    if (!tc.isValid) {
      throw new Error(`Invalid color string: ${color}`);
    }
    return tc.toRgb(); // returns an object { r, g, b, a }
  };

  // Linear interpolation function
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Choose the interpolation range based on the val.
  const [startColor, endColor] =
    meterVal <= 0.5
      ? [parseColor(lowColor), parseColor(midColor)]
      : [parseColor(midColor), parseColor(highColor)];

  // Normalize t within the current half segment
  const t = meterVal <= 0.5 ? meterVal * 2 : (meterVal - 0.5) * 2;

  // Interpolate each color channel.
  const r = Math.round(lerp(startColor.r, endColor.r, t));
  const g = Math.round(lerp(startColor.g, endColor.g, t));
  const b = Math.round(lerp(startColor.b, endColor.b, t));
  const a = lerp(startColor.a, endColor.a, t);

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` as const;
}
