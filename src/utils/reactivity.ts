import { type Accessor, type Component, createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import type { SugarboxEngine } from "sugarbox";

/** Makes the sugarbox engine reactive in solidjs.
 *
 * Assumes that each passage is a component.
 *
 * @returns an object containing the reactive signals / stores for variables, passages, achievements, settings
 */
export function useSugarboxEngine<TEngine extends SugarboxEngine<Component>>(
	engine: TEngine,
): {
	vars: TEngine["vars"];
	passage: Accessor<TEngine["passage"]>;
	achievements: TEngine["achievements"];
	settings: TEngine["settings"];
	setAchievements: (...args: Parameters<TEngine["setAchievements"]>) => void;
	setSettings: (...args: Parameters<TEngine["setSettings"]>) => void;
} {
	const [vars, setVars] = createStore(engine.vars);
	// TODO: create events for these in the library
	const [achievements, _setAchievements] = createStore(engine.achievements);
	const [settings, _setSettings] = createStore(engine.settings);

	const [passage, setPassage] = createSignal<Component>(
		engine.passage ?? (() => ""),
	);

	engine.on(":passageChange", ({ detail: { newPassage } }) => {
		if (newPassage) setPassage(() => newPassage);
	});

	// Add an event handler to catch when the game variables change
	engine.on(":stateChange", (_) => {
		setVars(reconcile(engine.vars));
	});

	const setAchievements = (...args: Parameters<TEngine["setAchievements"]>) => {
		engine
			//@ts-expect-error typescript limitation
			.setAchievements(...args)
			.then((_) => _setAchievements(reconcile(engine.achievements)));
	};

	const setSettings = (...args: Parameters<TEngine["setSettings"]>) => {
		engine
			//@ts-expect-error typescript limitation
			.setSettings(...args)
			.then((_) => _setSettings(reconcile(engine.settings)));
	};

	return {
		achievements,
		passage,
		setAchievements,
		setSettings,
		settings,
		vars,
	};
}
