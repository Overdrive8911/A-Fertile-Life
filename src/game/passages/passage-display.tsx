import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { GAME_ENGINE } from "../engine/engine";

function PassageDisplay() {
	const [passageToDisplay, setPassageToDisplay] = createSignal<
		() => JSX.Element
	>(GAME_ENGINE.passage ?? (() => ""));

	onMount(() => {
		GAME_ENGINE.on(":passageChange", ({ detail: { newPassage } }) => {
			if (newPassage) setPassageToDisplay(() => newPassage);
		});
	});

	return <Dynamic component={passageToDisplay()}></Dynamic>;
}

export { PassageDisplay };
