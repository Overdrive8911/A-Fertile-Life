import { TinyColor } from "@ctrl/tinycolor";

setup.widget.meter = (
  val,
  parent,
  width = "100%",
  height = "100%",
  idOrClasses = [],
  lowColor = "red",
  midColor = "yellow",
  highColor = "green",
  emptyColor = "transparent"
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

  const meterColor = `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;

  const meterContainer = $("<div/>").css({
    width: width,
    height: height,
    backgroundColor: emptyColor,
    border: "1px solid black",
  });
  idOrClasses.forEach((idOrClass) =>
    idOrClass.match(/^#/)
      ? meterContainer.attr("id", idOrClass.slice(1))
      : meterContainer.addClass(idOrClass.slice(1))
  );

  const meterBar = $("<div/>").css({
    width: `${val * 100}%`,
    height: "100%",
    backgroundColor: meterColor,
  });

  typeof parent == "string"
    ? $(parent).append(meterContainer.append(meterBar))
    : parent.append(meterContainer.append(meterBar));
};
