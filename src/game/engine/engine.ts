import * as idb from "idb-keyval";
import QuickLRU from "quick-lru";
import type { JSX } from "solid-js/jsx-runtime";
import {
	type SugarBoxCacheAdapter,
	type SugarBoxPersistenceAdapter,
	SugarboxEngine,
} from "sugarbox";
import type { SaveDataV0_0_1 } from "~/game/types/story-variables/save-data";
import { GameDateAndTime } from "../date-and-time/class";
import { Inventory } from "../inventory/class";
import { InventoryItem } from "../item/inventory-item/class";
import { NextPassage } from "../passages/next-passage";
import { StartPassage } from "../passages/start-passage";
import { Fetus } from "../pregnancy/classes/fetus";
import { Pregnancy } from "../pregnancy/classes/pregnancy";
import { Womb } from "../pregnancy/classes/womb";
import { DEFAULT_VARIABLES } from "./defaults";

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
	name: "A Fertile Life",
	otherPassages: [{ name: "Next", passage: NextPassage }],
	startPassage: { name: "Start", passage: StartPassage },
	variables: DEFAULT_VARIABLES,
	config: {
		autoSave: "passage",
		cache: cacheAdapter,
		persistence: persistenceAdapter,
		regenSeed: "passage",
		saveVersion: `0.0.1`,
	},
	classes: [GameDateAndTime, Inventory, InventoryItem, Pregnancy, Fetus, Womb],
});

function GAME_VARIABLES() {
	return GAME_ENGINE.vars;
}

export { GAME_ENGINE, GAME_VARIABLES };
