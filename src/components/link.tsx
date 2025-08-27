import type { JSX } from "solid-js/jsx-runtime";
import { GAME_ENGINE } from "~/game/engine/engine";

export function GenericButtonLink(prop: {
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
}) {
	return (
		<button type="button" class="link link-primary" onClick={prop.onClick}>
			{prop.children}
		</button>
	);
}

export function PassageLink(prop: {
	children: JSX.Element;
	onClick?: (e: MouseEvent) => void;
	/** The passage to atttempt to navigate to after clicking the link */
	passage: string;
}) {
	return (
		<GenericButtonLink
			onClick={(e) => {
				prop.onClick?.(e);

				GAME_ENGINE.navigateTo(prop.passage);
			}}
		>
			{prop.children}
		</GenericButtonLink>
	);
}
