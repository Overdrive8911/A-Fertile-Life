import type { JSX } from "solid-js/jsx-runtime";

const tooltipDirections = {
	bottom: "tooltip-bottom",
	top: "tooltip-top",
	left: "tooltip-left",
	right: "tooltip-right",
} as const;

export function BaseButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
}) {
	return (
		<div
			class={`tooltip ${prop.tooltipDir ? tooltipDirections[prop.tooltipDir] : ""}`}
			data-tip={prop.tooltip ?? ""}
		>
			<button type="button" class={`btn ${prop.class}`} onClick={prop.onClick}>
				{prop.children}
			</button>
		</div>
	);
}

export function CircleButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
}) {
	return <BaseButton {...prop} class={`btn-circle ${prop.class}`} />;
}

export function SquareButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
}) {
	return <BaseButton {...prop} class={`btn-square ${prop.class}`} />;
}
