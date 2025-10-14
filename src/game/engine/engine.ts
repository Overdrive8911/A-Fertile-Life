import * as idb from "idb-keyval";
import QuickLRU from "quick-lru";
import type { JSX } from "solid-js/jsx-runtime";
import {
	type SugarBoxCacheAdapter,
	type SugarBoxPersistenceAdapter,
	SugarboxEngine,
} from "sugarbox";
import type { SaveDataV0_0_1 } from "~/game/types/story-variables/save-data";
import { useSugarboxEngine } from "~/utils/reactivity";
import { Breasts } from "../body-stats/class/breast";
import { Player } from "../character/class/player";
import { GameDateAndTime } from "../date-and-time/class";
import { Inventory } from "../inventory/class";
import { NextPassage } from "../passages/debug-passage";
import { StartPassage } from "../passages/start-passage";
import { PassagePrologueCollection } from "../passages/story/prologue/aggregate";
import { PassagePrologueName } from "../passages/story/prologue/enums";
import { Womb } from "../pregnancy/classes/womb";
import { DEFAULT_VARIABLES } from "./defaults";
import { EngineDefaults } from "./enum";

const cacheAdapter: SugarBoxCacheAdapter<SaveDataV0_0_1> = new QuickLRU({
	maxSize: 10,
});

const persistenceAdapter: SugarBoxPersistenceAdapter = {
	async delete(key) {
		return idb.del(key);
	},

	async get(key) {
		return idb.get(key);
	},

	async keys() {
		return idb.keys();
	},

	async set(key, value) {
		return idb.set(key, value);
	},
};

const GAME_ENGINE = await SugarboxEngine.init<
	() => JSX.Element,
	SaveDataV0_0_1
>({
	classes: [Player, Breasts, GameDateAndTime, Inventory, Womb],
	config: {
		autoSave: "passage",
		cache: cacheAdapter,
		compressSave: false,
		eventOptimization: "performance",
		loadOnStart: true,
		persistence: persistenceAdapter,
		regenSeed: "passage",
		saveSlots: EngineDefaults.SAVE_SLOTS,
		saveVersion: `0.0.1`,
	},
	name: "Surrograce",
	otherPassages: [
		...PassagePrologueCollection,
		{ name: PassagePrologueName.DEBUG_SANDBOX, passage: NextPassage },
	],
	startPassage: { name: PassagePrologueName.GAME_START, passage: StartPassage },
	variables: DEFAULT_VARIABLES,
});

const {
	achievements,
	passage: GAME_PASSAGE,
	setAchievements,
	setSettings,
	settings,
	vars: GAME_VARIABLES,
} = useSugarboxEngine(GAME_ENGINE);

const GAME_RANDOM = () => GAME_ENGINE.random;

GAME_ENGINE.on(":stateChange", () => {
	// Update all time-sensitive game objects
	GAME_ENGINE.setVars((s) => {
		s.player.womb.updateWithTime(GAME_VARIABLES.gameDateAndTime.date, s.player);
	}, false);
});

//@ts-expect-error Just for debugging
window.game = GAME_ENGINE;

export { GAME_ENGINE, GAME_PASSAGE, GAME_VARIABLES, GAME_RANDOM };
