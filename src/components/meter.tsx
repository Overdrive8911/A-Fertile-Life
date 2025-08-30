import QuickLRU from "quick-lru";
import { createSignal, onMount } from "solid-js";

// Defaults
const LOW_COLOR = "red";
const MID_COLOR = "yellow";
const HIGH_COLOR = "green";
const EMPTY_COLOR = "transparent";

type Rgba = {
	r: number;
	g: number;
	b: number;
	a: number;
};

type RgbaString = `rgba(${number}, ${number}, ${number}, ${number})`;

const parsedColorCache = new QuickLRU<string, Rgba>({ maxSize: 100 });
/**
 * Parse a color string into an RGB object with an alpha channel.
 */
function parseColor(colorName: string): Rgba {
	const cachedResult = parsedColorCache.get(colorName);

	if (cachedResult) return cachedResult;

	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas ain't working");
	}

	// Set the fill style and extract the color
	ctx.fillStyle = colorName;
	ctx.fillRect(0, 0, 1, 1);

	// Get the pixel data (RGBA)
	const [r = 255, g = 255, b = 255, a = 255] = ctx.getImageData(
		0,
		0,
		1,
		1,
	).data;

	const result = { r, g, b, a };

	parsedColorCache.set(colorName, result);

	return result;
}

function convertRgbaObjectToColorString(rgba: Rgba): RgbaString {
	return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

function getMeterColor(
	meterVal: number,
	lowColor: string,
	midColor: string,
	highColor: string,
): RgbaString {
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

	return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
}

type MeterColorKey = `${string}-${string}-${string}-${string}`;

const colorCache = new QuickLRU<MeterColorKey, RgbaString>({ maxSize: 100 });

function getCachedMeterColor(
	...args: Parameters<typeof getMeterColor>
): RgbaString {
	const meterColorKey = args.join("-") as MeterColorKey;

	const possibleCachedResult = colorCache.get(meterColorKey);

	if (possibleCachedResult) return possibleCachedResult;

	const computedResult = getMeterColor(...args);

	colorCache.set(meterColorKey, computedResult);

	return computedResult;
}

/** General purpose meter */
function Meter(prop: {
	/** Must be a decimal between 0 and 1 inclusively */
	val: number;
	/** Classes to apply to the outer container */
	containerClass?: string;
	/** Classes to apply to the actual coloured bar */
	barClass?: string;
	lowColor?: string | undefined;
	midColor?: string | undefined;
	highColor?: string | undefined;
	emptyColor?: string | undefined;
	/** Optional title for the meter */
	title?: string;

	/** So that we can get the meter container's reference in another component */
	ref?: HTMLDivElement;
}) {
	const lowColor = () => prop.lowColor ?? LOW_COLOR;
	const midColor = () => prop.midColor ?? MID_COLOR;
	const highColor = () => prop.highColor ?? HIGH_COLOR;
	const emptyColor = () => prop.emptyColor ?? EMPTY_COLOR;

	const percentageVal = () => `${prop.val * 100}%`;

	return (
		<div
			class={`w-full h-4 border ${prop.containerClass}`}
			style={{
				"background-color": convertRgbaObjectToColorString(
					parseColor(emptyColor()),
				),
			}}
			title={prop.title ?? percentageVal()}
			ref={prop.ref}
		>
			<div
				class={`h-full ${prop.barClass}`}
				style={{
					width: percentageVal(),
					"background-color": getCachedMeterColor(
						prop.val,
						lowColor(),
						midColor(),
						highColor(),
					),
				}}
			></div>
		</div>
	);
}

/** Meter specifically built for showing a stat. Applies some extra defaults */
function StatMeter(prop: {
	/** Must be a decimal between 0 and 1 inclusively */
	val: number;
	/** Name of the stat this meter is representing */
	stat: string;
	/** Path to the image to be used as an icon for this meter */
	icon: string;

	/** Classes to apply to the icon itself */
	iconClass?: string;
	/** Classes to apply to the outer container */
	containerClass?: string;
	/** Classes to apply to the actual coloured bar */
	barClass?: string;
	lowColor?: string;
	midColor?: string;
	highColor?: string;
	emptyColor?: string;
}) {
	const [wrapperHeight, setWrapperHeight] = createSignal(0);

	const meterTitle = () => `${prop.stat}: ${prop.val * 100}%` as const;

	let meterContainer!: HTMLDivElement;

	onMount(() => {
		/** Make the wrapper slightly taller than the meter so that the icon can be bigger too */
		setWrapperHeight(meterContainer.clientHeight * 2);
	});

	return (
		<div
			class="relative flex items-center"
			style={{ height: `${wrapperHeight()}px` }}
		>
			<img
				src={prop.icon}
				alt={prop.stat}
				class={`h-full aspect-square absolute -left-0.75 border-3 border-primary bg-neutral rounded-full ${prop.iconClass}`}
				title={meterTitle()}
			></img>

			<Meter
				val={prop.val}
				barClass="rounded-r-lg"
				containerClass="rounded-r-lg border-primary"
				title={meterTitle()}
				emptyColor={prop.emptyColor}
				highColor={prop.highColor}
				lowColor={prop.lowColor}
				midColor={prop.midColor}
				ref={meterContainer}
			/>
		</div>
	);
}

export { Meter, StatMeter };
