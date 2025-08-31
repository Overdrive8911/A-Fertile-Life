import { Dynamic } from "solid-js/web";
import { GAME_PASSAGE } from "../engine/engine";

function PassageDisplay() {
	return <Dynamic component={GAME_PASSAGE() ?? (() => "")}></Dynamic>;
}

export { PassageDisplay };
