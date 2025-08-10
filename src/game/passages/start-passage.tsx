import { GAME_ENGINE } from "../engine/engine";

function StartPassage() {
	return (
		<div>
			Start Passage :3{" "}
			<button
				class="link link-primary"
				type="button"
				onClick={(_) => {
					GAME_ENGINE.navigateTo("Next");
				}}
			>
				Click me to proceed
			</button>
		</div>
	);
}

export { StartPassage };
