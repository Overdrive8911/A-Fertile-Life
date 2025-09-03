import { type JSX, splitProps } from "solid-js";

interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The tooltip itself */
	text: JSX.Element;

	/** Direction / position of the tooltip */
	position?: "top" | "bottom" | "left" | "right";

	children: JSX.Element;
}

/** Wraps a daisyUI tooltip around the compoennt's children */
export function Tooltip(props: TooltipProps) {
	const [local, others] = splitProps(props, [
		"text",
		"position",
		"children",
		"class",
	]);

	const positionClass = () => {
		switch (local.position) {
			case "bottom":
				return "tooltip-bottom";
			case "left":
				return "tooltip-left";
			case "right":
				return "tooltip-right";
			default:
				return "tooltip-top";
		}
	};

	return (
		<div class={`tooltip ${positionClass()} ${local.class || ""}`} {...others}>
			<div class="tooltip-content">{local.text}</div>

			{local.children}
		</div>
	);
}
