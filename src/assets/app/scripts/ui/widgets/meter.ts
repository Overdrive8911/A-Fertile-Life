import tinycolor from "tinycolor2";

setup.widget.meter = (
  val: number,
  width = "100%",
  lowColor = "red",
  midColor = "yellow",
  highColor = "green",
  ...css
) => {
  // Helper function to parse and validate color strings using tinycolor
  const parseColor = (color: string) => {
    const tc = tinycolor(color);
    if (!tc.isValid()) {
      throw new Error(`Invalid color string: ${color}`);
    }
    // Ensure we have an alpha value; defaults to 1 if missing
    return { ...tc.toRgb(), a: tc.getAlpha() };
  };

  // Linear interpolation helper function
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Choose which color range to interpolate over
  const [startColor, endColor] =
    val <= 0.5
      ? [parseColor(lowColor), parseColor(midColor)]
      : [parseColor(midColor), parseColor(highColor)];

  // Calculate a normalized t value for the interpolation
  const t = val <= 0.5 ? val * 2 : (val - 0.5) * 2;

  // Interpolate each color channel
  const r = Math.round(lerp(startColor.r, endColor.r, t));
  const g = Math.round(lerp(startColor.g, endColor.g, t));
  const b = Math.round(lerp(startColor.b, endColor.b, t));
  const a = lerp(startColor.a, endColor.a, t);

  // Construct the resulting color in rgba() format
  const colorString = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;

  // // Create the meter element and apply styles
  // const meterElement = document.createElement("div");
  // meterElement.style.width = width;
  // meterElement.style.height = "10px";
  // meterElement.style.backgroundColor = colorString;
  // Object.assign(meterElement.style, ...css);

  // return meterElement;
};
