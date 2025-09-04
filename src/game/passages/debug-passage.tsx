import { createSignal } from "solid-js";
import { GenericButtonLink } from "~/components/link";
import { GAME_ENGINE } from "../engine/engine";
import { gInGameItems } from "../item/game-items";
import { getRandomIntegerInRange } from "../shared/utils";

function NextPassage() {
	return (
		<>
			<p>
				Here, you are. Standing in the middle of the void. Surrounded by the
				nothingness that once held your reality together. That time is long past
				however. You came here for a reason; to experiment, to experiment to
				your fill. In this place, nothing can truly be created or destroyed but
				the dark matter her can be moulded to your will.
			</p>

			<p>
				It's time to get down to business, so go on and manipulate this new
				world to how you see fit!
			</p>

			<p>
				<GenericButtonLink
					onClick={(_) => {
						GAME_ENGINE.setVars((state) => {
							for (const item of Object.values(gInGameItems)) {
								state.player.inventory.storeItem(
									item,
									(Math.random() * 100) % item.id,
								);
							}
						});
					}}
				>
					Add All Inventory Items
				</GenericButtonLink>
			</p>

			<p>
				{(() => {
					const [timeInMinutes, setTimeInMinutes] = createSignal(30);

					const updateTime = () =>
						GAME_ENGINE.setVars((s) =>
							s.gameDateAndTime.update(timeInMinutes() * 60 * 1000),
						);

					return (
						<>
							<input
								class="input input-primary w-30 mr-2"
								type="number"
								value={timeInMinutes()}
								onInput={({ target: { value } }) =>
									setTimeInMinutes(Number(value))
								}
								onKeyUp={({ key }) => key === "Enter" && updateTime()}
							/>{" "}
							<GenericButtonLink onClick={updateTime}>
								{" "}
								Move {Math.abs(timeInMinutes())} minutes{" "}
								{timeInMinutes() > 0 ? "forwards" : "backwards"}.{" "}
							</GenericButtonLink>
						</>
					);
				})()}
			</p>

			<p>
				<GenericButtonLink
					onClick={(_) =>
						GAME_ENGINE.setVars((s) =>
							s.player.womb.tryCreatePregnancy(100, 100),
						)
					}
				>
					Baby?
				</GenericButtonLink>
			</p>
		</>
	);
}

export { NextPassage };
