import type { SaveDataV0_0_1 } from "~/game/types/story-variables/save-data";
import { Breasts } from "../body-stats/class/breast";
import { GameDateAndTime } from "../date-and-time/class";
import { Inventory } from "../inventory/class";
import { Womb } from "../pregnancy/classes/womb";
import { FertilityLevel } from "../pregnancy/enums";
import { BellySize } from "../pregnancy/variables";

const DEFAULT_VARIABLES: SaveDataV0_0_1 = {
	gameDateAndTime: new GameDateAndTime(Date.UTC(2021, 1, 3, 20)),
	player: {
		/* Money */
		money: 5800,

		/* Normal Body Stuff */
		name: "Peizhu Noshihamite",

		body: {
			age: 27,
			eyes: {
				leftIris: "hazel" /* Left eye colour */,
				rightIris:
					"hazel" /* Right eye colour. If different from leftIris, the PC is heterochromatic */,
			},
			hair: {
				/* Most of the string members are just for flavour */
				colour: "black",
				length: 33,
				style: "straight",
			},
			weight: 68,
			height: 167,

			/* Hip and waist */
			/*TODO - Make the hip.size and waist.size related description wise */
			hipSize: 41 /* In inches. 32.3 - 33.3 -> Very Narrow, 33.4 - 35.5 -> Narrow, 35.6 - 37.5 -> Quite Narrow, 37.6 - 40.4 -> Average, 40.5 - 43.3 -> Wide, 43.4 - 46.5 -> Very Wide, 46.6 - 50.5 -> Child-Bearing, 50.6 and above -> Brood Mother Hips. Birthing increases this to an extent */,
			waistSize: 30 /* In inches. 22.3 - 23.3 -> Extra Slim, 23.4 - 25.5 -> Very Slim, 25.6 - 27.5 -> Slim, 27.6 - 30.4 -> Average, 30.5 - 33.3 -> Wide, 33.4 - 35.5 -> Very Wide, 35.6 - 38.4 -> Plus-Sized, 38.5 - 42.4 -> Plus-Sized 2x, 42.5 - 46.4 -> Plus-Sized 3x, 46.5 - 50.4 -> Plus-Sized 4x, 50.5 - 53.5 -> Plus-Sized 5x. Getting fat increases this to an extent */,
		},

		makeup: "",

		inventory: new Inventory(),

		mood: 70,

		hp: 80,
		maxHp: 100,
		energy: 70,

		womb: new Womb({
			fertility: FertilityLevel.EXTREME_FERTILITY,
			comfortCap: BellySize.FULL_TERM + BellySize.EARLY_PREGNANCY,
			maxCap: BellySize.FULL_TERM_TWINS,
			growthMod: 10,
		}),

		breasts: new Breasts({ type: "shared" }),

		muscle: 44,

		/* Stomach and Hunger */
		fullness: 85,
		// caloriesEaten: 2100 /* Stores the daily amount of calories consumed by the user. Is used in calculating changes to weight */,
		/* UNUSED stretchMarks:           0,                  /* 0 -> No stretch marks, 1 - 25 -> Light stretch marks, 26 - 50 -> Visible stretch marks, 51 - 75 -> Prominent stretch marks, 76 - 100 -> Black and Blue */
		// sag: 0 ,
	},
} as const;

export { DEFAULT_VARIABLES };
