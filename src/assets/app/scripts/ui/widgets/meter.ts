import { TinyColor } from "@ctrl/tinycolor";
import { getSugarCubeVariableValue } from "../../declarations/general_declarations";

const enum MeterContainer {
  CLASS = "meter-body",
  WIDTH = "100%",
  HEIGHT = "100%",
  EMPTY_COLOR = "transparent",
}

// Dynamically create a class for the meter container
$("<style>")
  .prop("type", "text/css")
  .html(
    `.${MeterContainer.CLASS}{width:${MeterContainer.WIDTH};height:${MeterContainer.HEIGHT};background-color:${MeterContainer.EMPTY_COLOR};border:1px solid black};box-sizing:border-box`
  )
  .appendTo("head");

setup.widget.meter = (
  val,
  parent,
  width = MeterContainer.WIDTH,
  height = "1rem",
  idOrClasses = [],
  lowColor = "red",
  midColor = "yellow",
  highColor = "green",
  emptyColor = MeterContainer.EMPTY_COLOR
) => {
  let parsedVal = 1;

  if (typeof val == "number") parsedVal = val;
  else {
    const variableVal = getSugarCubeVariableValue(val);
    if (typeof variableVal == "number") {
      parsedVal = variableVal;
    }
  }
  parsedVal = parsedVal > 1 ? 1 : parsedVal < 0 ? 0 : parsedVal;

  const meterContainer = $("<div/>").addClass(MeterContainer.CLASS).css({
    width: width,
    height: height,
    "background-color": emptyColor,
  });

  idOrClasses.forEach((idOrClass) =>
    idOrClass.match(/^#/)
      ? meterContainer.attr("id", idOrClass.slice(1))
      : meterContainer.addClass(idOrClass.slice(1))
  );

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

  typeof parent == "string"
    ? $(parent).append(meterContainer.append(meterBar))
    : parent.append(meterContainer.append(meterBar));
};

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
