import type { JSX } from "solid-js/jsx-runtime";

export function CircleButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
}) {
	return (
		<button
			type="button"
			class={`btn btn-circle ${prop.class}`}
			onClick={prop.onClick}
		>
			{prop.children}
		</button>
	);
}

export function SquareButton(prop: {
	class?: string;
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
}) {
	return (
		<button
			type="button"
			class={`btn btn-square ${prop.class}`}
			onClick={prop.onClick}
		>
			{prop.children}
		</button>
	);
}
