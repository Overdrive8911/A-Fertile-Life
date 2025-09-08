import type { Breasts } from "~/game/body-stats/class/breast";
import type { Inventory } from "~/game/inventory/class";
import type { Womb } from "~/game/pregnancy/classes/womb";

type Player = {
	money: number;
	/**
	 * The unique id of the `MapEntity` / `SubLocation` instance that the player is currently in.
	 */
	// areaId: AreaUUID;
	// personality: {
	// 	enthusiasm: number;
	// 	apathy: number;
	// 	disapproval: number;
	// 	extroverted: number;
	// 	introverted: number;
	// 	caring: number;
	// 	sarcastic: number;
	// 	inquisitive: number;
	// 	patience: number;
	// };
	name: string;
	body: {
		age: number;
		eyes: {
			leftIris: string;
			rightIris: string;
		};
		hair: {
			colour: string;
			/* In cm */
			length: number;
			style: string;
		};

		/* In kg. Weight classes are Emaciated, Underweight, Thin, Lean, Average, Pudgy, Plump, Chubby, Curvy, Overweight, Fat, Obese. height is also used in calculating the BMI */
		weight: number;

		/* In cm. It's approximately 5'6". Height classes are Dwarf, Very Short, Short, Somewhat short, Average, Somewhat Tall, Tall, Very Tall, Mini Giant */
		height: number;

		hipSize: number;
		waistSize: number;
	};
	makeup: string;
	// nails: string;

	inventory: Inventory;

	mood: number;

	hp: number;
	maxHp: number;
	/* 0 - 10 -> Completely exhausted, 11 - 25 -> exhausted, 26 - 40 -> very tired, 41 - 50 - Tired, 51 - 60 -> Fatigued, 61 - 75 - Normal, 76 - 85 -> Perky, 86 - 99 -> Energetic, 100 -> Completely Refreshed */
	energy: number;
	/* 0 - 17 -> Very frail, 18 - 35 -> Frail, 36 - 53 -> Average, 54 - 66 -> Toned, 67 - 82 -> Well-Defined, 83 - 95 -> Jacked, 96 - 100 -> Body Builder */
	muscle: number;
	womb: Womb;

	breasts: Breasts;

	/* From 0 to 100. Decreases over time, especially when doing strenuous work. Increases after eating. As long as its above 70, the user will not be hungry. The user cannot eat if the amount of fullness is 100 */
	fullness: number;
	// /* UNUSED stretchMarks:           0,                  /* 0 -> No stretch marks, 1 - 25 -> Light stretch marks, 26 - 50 -> Visible stretch marks, 51 - 75 -> Prominent stretch marks, 76 - 100 -> Black and Blue */
	// sag: number;
};

export type { Player };
