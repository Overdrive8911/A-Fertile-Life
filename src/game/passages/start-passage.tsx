import { GAME_ENGINE } from "../engine/engine";
import { PassagePrologueName } from "./story/prologue/enums";

function StartPassage() {
	return (
		<div class="flex flex-col gap-16 items-baseline">
			<button
				class="link link-primary text-4xl"
				type="button"
				onClick={(_) => {
					GAME_ENGINE.navigateTo(PassagePrologueName.PROLOGUE_BEGINNING);
				}}
			>
				Start
			</button>

			<button
				class="link link-primary text-4xl"
				type="button"
				onClick={(_) => {
					GAME_ENGINE.navigateTo(PassagePrologueName.DEBUG_SANDBOX);
				}}
			>
				Debug
			</button>
		</div>
	);
}

export { StartPassage };
