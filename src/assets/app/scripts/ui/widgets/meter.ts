import { TinyColor } from "@ctrl/tinycolor";

setup.widget.meter = (
  val,
  parent,
  width = "100%",
  height = "100%",
  idOrClasses = [],
  lowColor = "red",
  midColor = "yellow",
  highColor = "green"
) => {
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
    val <= 0.5
      ? [parseColor(lowColor), parseColor(midColor)]
      : [parseColor(midColor), parseColor(highColor)];

  // Normalize t within the current half segment
  const t = val <= 0.5 ? val * 2 : (val - 0.5) * 2;

  // Interpolate each color channel.
  const r = Math.round(lerp(startColor.r, endColor.r, t));
  const g = Math.round(lerp(startColor.g, endColor.g, t));
  const b = Math.round(lerp(startColor.b, endColor.b, t));
  const a = lerp(startColor.a, endColor.a, t);

  // Construct the final color string with rgba() format.
  const colorString = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;

  // // Create the meter element and apply styles.
  // const meterElement = document.createElement("div");
  // meterElement.style.width = width;
  // meterElement.style.height = "10px";
  // meterElement.style.backgroundColor = colorString;
  // Object.assign(meterElement.style, ...css);

  // return meterElement;
};
