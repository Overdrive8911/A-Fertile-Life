/** biome-ignore-all lint/suspicious/noConstEnum: <Const enums will be inlined> */
import type { SugarBoxCompatibleClassInstance } from "sugarbox";
import { Breasts } from "~/game/body-stats/class/breast";
import { Inventory } from "~/game/inventory/class";
import { Womb } from "~/game/pregnancy/classes/womb";
import { FertilityLevel } from "~/game/pregnancy/enums";
import { BellySize } from "~/game/pregnancy/variables";
import { clamp } from "~/utils/math";

const enum StatBound {
	MIN_ZERO = 0,
	MIN_AGE = 18,
	MIN_HEIGHT = 140,
	MIN_HIP_SIZE = 20,
	MIN_WAIST_SIZE = 15,
	MIN_WEIGHT = 30,
	MAX_AGE = 100,
	MAX_ENERGY = 100,
	MAX_FULLNESS = 100,
	MAX_HEIGHT = 210,
	MAX_HIP_SIZE = 80,
	MAX_HP = 1000,
	MAX_MOOD = 100,
	MAX_MUSCLE = 100,
	MAX_WAIST_SIZE = 60,
	MAX_WEIGHT = 200,
}

type SerializedPlayer = {
	age: number;
	breasts: Breasts;
	energy: number;
	eyes: {
		left: string;
		right: string;
	};
	fullness: number;
	hair: {
		colour: string;
		length: number;
		style: string;
	};
	height: number;
	hipSize: number;
	hp: number;
	inventory: Inventory;
	makeup: string;
	maxHp: number;
	money: number;
	mood: number;
	muscle: number;
	name: string;
	waistSize: number;
	weight: number;
	womb: Womb;
};

type PlayerOptions = Partial<SerializedPlayer>;

export class Player
	implements SugarBoxCompatibleClassInstance<SerializedPlayer>
{
	static classId = "Player";

	static fromJSON(data: SerializedPlayer): Player {
		return new Player(data);
	}

	constructor(options: PlayerOptions = {}) {
		Object.assign(this, options);
	}

	private _age = 27;

	breasts = new Breasts({ type: "shared" });

	private _energy = 70;

	eyes = {
		left: "hazel",
		right: "hazel",
	};

	/** From 0 to 100. Decreases over time, especially when doing strenuous work. Increases after eating. As long as its above 70, the user will not be hungry. The user cannot eat if the amount of fullness is 100 */
	private _fullness = 85;

	hair = {
		colour: "black",
		/** In cm */
		length: 33,
		style: "straight",
	};

	/** In cm. It's approximately 5'6". Height classes are Dwarf, Very Short, Short, Somewhat short, Average, Somewhat Tall, Tall, Very Tall, Mini Giant */
	private _height = 167;

	private _hipSize = 41;

	private _hp = 80;

	inventory = new Inventory();

	makeup = "";

	private _maxHp = 100;

	money = 5800;

	private _mood = 70;

	/** 0 - 17 -> Very frail, 18 - 35 -> Frail, 36 - 53 -> Average, 54 - 66 -> Toned, 67 - 82 -> Well-Defined, 83 - 95 -> Jacked, 96 - 100 -> Body Builder */
	private _muscle = 44;

	readonly name = "Peizhu Noshihamite";

	private _waistSize = 30;

	/** In kg. Weight classes are Emaciated, Underweight, Thin, Lean, Average, Pudgy, Plump, Chubby, Curvy, Overweight, Fat, Obese. height is also used in calculating the BMI */
	private _weight = 68;

	womb = new Womb({
		fertility: FertilityLevel.EXTREME_FERTILITY,
		comfortCap: BellySize.FULL_TERM + BellySize.EARLY_PREGNANCY,
		maxCap: BellySize.FULL_TERM_TWINS,
		growthMod: 10,
	});

	// caloriesEaten: 2100 /* Stores the daily amount of calories consumed by the user. Is used in calculating changes to weight */,
	/* UNUSED stretchMarks:           0,                  /* 0 -> No stretch marks, 1 - 25 -> Light stretch marks, 26 - 50 -> Visible stretch marks, 51 - 75 -> Prominent stretch marks, 76 - 100 -> Black and Blue */
	// sag: 0 ,

	toJSON(): SerializedPlayer {
		return {
			age: this._age,
			breasts: this.breasts,
			energy: this._energy,
			eyes: this.eyes,
			fullness: this._fullness,
			hair: this.hair,
			height: this._height,
			hipSize: this._hipSize,
			hp: this._hp,
			inventory: this.inventory,
			makeup: this.makeup,
			maxHp: this._maxHp,
			money: this.money,
			mood: this._mood,
			muscle: this._muscle,
			name: this.name,
			waistSize: this._waistSize,
			weight: this._weight,
			womb: this.womb,
		};
	}

	get age(): number {
		return this._age;
	}

	set age(value: number) {
		this._age = clamp(value, StatBound.MIN_AGE, StatBound.MAX_AGE);
	}

	get energy(): number {
		return this._energy;
	}

	set energy(value: number) {
		this._energy = clamp(value, StatBound.MIN_ZERO, StatBound.MAX_ENERGY);
	}

	get fullness(): number {
		return this._fullness;
	}

	set fullness(value: number) {
		this._fullness = clamp(value, StatBound.MIN_ZERO, StatBound.MAX_FULLNESS);
	}

	get height(): number {
		return this._height;
	}

	set height(value: number) {
		this._height = clamp(value, StatBound.MIN_HEIGHT, StatBound.MAX_HEIGHT);
	}

	get hipSize(): number {
		return this._hipSize;
	}

	set hipSize(value: number) {
		this._hipSize = clamp(
			value,
			StatBound.MIN_HIP_SIZE,
			StatBound.MAX_HIP_SIZE,
		);
	}

	get hp(): number {
		return this._hp;
	}

	set hp(value: number) {
		this._hp = clamp(value, StatBound.MIN_ZERO, this._maxHp);
	}

	get maxHp(): number {
		return this._maxHp;
	}

	set maxHp(value: number) {
		this._maxHp = clamp(value, StatBound.MIN_ZERO, StatBound.MAX_HP);
	}

	get mood(): number {
		return this._mood;
	}

	set mood(value: number) {
		this._mood = clamp(value, StatBound.MIN_ZERO, StatBound.MAX_MOOD);
	}

	get muscle(): number {
		return this._muscle;
	}

	set muscle(value: number) {
		this._muscle = clamp(value, StatBound.MIN_ZERO, StatBound.MAX_MUSCLE);
	}

	get waistSize(): number {
		return this._waistSize;
	}

	set waistSize(value: number) {
		this._waistSize = clamp(
			value,
			StatBound.MIN_WAIST_SIZE,
			StatBound.MAX_WAIST_SIZE,
		);
	}

	get weight(): number {
		return this._weight;
	}

	set weight(value: number) {
		this._weight = clamp(value, StatBound.MIN_WEIGHT, StatBound.MAX_WEIGHT);
	}
}
