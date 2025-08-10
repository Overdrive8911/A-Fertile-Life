import { GAME_ENGINE } from "../engine/engine";

function NextPassage() {
	return (
		<div>
			Next Passage :33{" "}
			<button
				class="link link-primary"
				type="button"
				onClick={(_) => {
					GAME_ENGINE.navigateTo("Start");
				}}
			>
				Click me to proceed back!
			</button>
		</div>
	);
}

export { NextPassage };
