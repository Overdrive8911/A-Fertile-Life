import * as idb from "idb-keyval";
import QuickLRU from "quick-lru";
import {
	type SugarBoxCacheAdapter,
	type SugarBoxPersistenceAdapter,
	SugarboxEngine,
} from "sugarbox";
import type { StoryVariablesV1 } from "~/types/story-variables";
import { NextPassage } from "../passages/next-passage";
import { StartPassage } from "../passages/start-passage";

const cacheAdapter: SugarBoxCacheAdapter<StoryVariablesV1> = new QuickLRU({
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

const defaultVariables = { test: "test" } as const satisfies StoryVariablesV1;

const GAME_ENGINE = await SugarboxEngine.init({
	name: "A Fertile Life",
	otherPassages: [{ name: "Next", passage: NextPassage }],
	startPassage: { name: "Start", passage: StartPassage },
	variables: defaultVariables,
	config: {
		autoSave: "passage",
		cache: cacheAdapter,
		persistence: persistenceAdapter,
		regenSeed: "passage",
		compressSave: true,
		loadOnStart: true,
	},
});

export { GAME_ENGINE };
