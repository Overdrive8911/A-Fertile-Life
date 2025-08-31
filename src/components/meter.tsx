import { createSignal, onMount } from "solid-js";

// Defaults
const LOW_COLOR = "red";
const MID_COLOR = "yellow";
const HIGH_COLOR = "green";
const EMPTY_COLOR = "transparent";

/**
 * Simple color interpolation using CSS color-mix (fallback to hsl interpolation)
 */
function interpolateColor(
	/** Must be a decimal between 0 and 1 inclusively */
	val: number,
	lowColor: string,
	midColor: string,
	highColor: string,
): string {
	let t = 0;

	if (val <= 0.5) {
		// Interpolate between low and mid color
		t = val * 2; // Normalize to 0-1 for this half

		// Use CSS color-mix if available, fallback to direct colors at boundaries
		if (t === 0) return lowColor;
		if (t === 1) return midColor;

		const percentage = Math.round(t * 100);
		return `color-mix(in srgb, ${midColor} ${percentage}%, ${lowColor})`;
	} else {
		// Interpolate between mid and high color
		t = (val - 0.5) * 2; // Normalize to 0-1 for this half

		if (t === 0) return midColor;
		if (t === 1) return highColor;

		const percentage = Math.round(t * 100);
		return `color-mix(in srgb, ${highColor} ${percentage}%, ${midColor})`;
	}
}

/** General purpose meter */
function Meter(prop: {
	/** Must be a decimal between 0 and 1 inclusively */
	val: number;
	/** Any valid css height value */
	height?: string;
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

	const meterColor = () =>
		interpolateColor(prop.val, lowColor(), midColor(), highColor());

	return (
		<div
			class={`w-full h-4 border ${prop.containerClass}`}
			style={{
				"background-color": emptyColor(),
				height: prop.height,
			}}
			title={prop.title ?? percentageVal()}
			ref={prop.ref}
		>
			<div
				class={`h-full ${prop.barClass}`}
				style={{
					width: percentageVal(),
					"background-color": meterColor(),
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
