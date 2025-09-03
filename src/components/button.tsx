import type { JSX } from "solid-js/jsx-runtime";
import { Tooltip } from "./tooltip";

export function BaseButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
	disabled?: boolean;
}) {
	return (
		<Tooltip text={prop.tooltip ?? ""} position={prop.tooltipDir ?? "top"}>
			<button
				type="button"
				class={`btn ${prop.class}`}
				onClick={prop.onClick}
				disabled={prop.disabled}
			>
				{prop.children}
			</button>
		</Tooltip>
	);
}

export function CircleButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
	disabled?: boolean;
}) {
	return <BaseButton {...prop} class={`btn-circle ${prop.class}`} />;
}

export function SquareButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	tooltip?: string;
	tooltipDir?: "right" | "left" | "top" | "bottom";
	disabled?: boolean;
}) {
	return <BaseButton {...prop} class={`btn-square ${prop.class}`} />;
}
