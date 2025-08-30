import * as idb from "idb-keyval";
import QuickLRU from "quick-lru";
import type { JSX } from "solid-js/jsx-runtime";
import {
	type SugarBoxCacheAdapter,
	type SugarBoxPersistenceAdapter,
	SugarboxEngine,
} from "sugarbox";
import type { SaveDataV0_0_1 } from "~/game/types/story-variables/save-data";
import { Breasts } from "../body-stats/class/breast";
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

	async set(key, value) {
		return idb.set(key, value);
	},

	async keys() {
		return idb.keys();
	},
};

const GAME_ENGINE = await SugarboxEngine.init<
	() => JSX.Element,
	SaveDataV0_0_1
>({
	name: "Surrograce",
	otherPassages: [
		...PassagePrologueCollection,
		{ name: PassagePrologueName.DEBUG_SANDBOX, passage: NextPassage },
	],
	startPassage: { name: PassagePrologueName.GAME_START, passage: StartPassage },
	variables: DEFAULT_VARIABLES,
	config: {
		autoSave: "passage",
		cache: cacheAdapter,
		persistence: persistenceAdapter,
		regenSeed: "passage",
		saveVersion: `0.0.1`,
		saveSlots: EngineDefaults.SAVE_SLOTS,
		loadOnStart: true,
		eventOptimization: "performance",
		compressSave: false,
	},
	classes: [Breasts, GameDateAndTime, Inventory, Womb],
});

window.game = GAME_ENGINE;

export { GAME_ENGINE };
