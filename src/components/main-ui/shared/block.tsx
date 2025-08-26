import type { JSX } from "solid-js";
import { ROUNDED_BORDER } from "./constants";

export function Block(prop: { title: JSX.Element; children: JSX.Element }) {
	return (
		<div class={`flex flex-col border border-primary ${ROUNDED_BORDER}`}>
			<h2 class="text-xl font-bold">{prop.title}</h2>

			<div class="grow border-t border-primary p-2">{prop.children}</div>
		</div>
	);
}
