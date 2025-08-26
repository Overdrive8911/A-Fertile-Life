import { type Component, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { MainUI } from "./components/main-ui";
import { GAME_ENGINE } from "./game/engine/engine";

const [gameVariables, setGameVariables] = createStore(GAME_ENGINE.vars);

const App: Component = () => {
	onMount(() => {
		// Add an event handler to catch when the game variables change
		GAME_ENGINE.on(":stateChange", ({ detail: { newState } }) => {
			setGameVariables(newState);
		});
	});

	return (
		<div class="h-[100vh] w-[100vw] overflow-y-clip">
			<MainUI />
		</div>
	);
};

export default App;
export { gameVariables as GAME_VARIABLES };
