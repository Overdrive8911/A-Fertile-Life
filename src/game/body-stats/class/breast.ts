import { createMutable } from "solid-js/store";
import type {
	SugarBoxCompatibleClassConstructorCheck,
	SugarBoxCompatibleClassInstance,
} from "sugarbox";
import { ClassId } from "~/game/shared/enums";
import {
	AreolaDescription,
	BreastLocation,
	CupSize,
	MilkCapacity,
	NippleDescription,
} from "../enums";

type SingleBreast = {
	size: CupSize | number;
	milkCapacity: MilkCapacity | number;
	isLactating: boolean;
	nipple: NippleDescription;
	areola: AreolaDescription;
	// location: Location;
};

type SerializedBreastsClass = {
	breasts: Map<BreastLocation, SingleBreast>;
};

/** This is just an object that stores at least on Breast. In most cases, the weighted average of all breasts will be used in calculations
 */
class Breasts
	implements SugarBoxCompatibleClassInstance<SerializedBreastsClass>
{
	private _breasts: Map<BreastLocation, SingleBreast> = new Map();

	constructor(
		args:
			| {
					type: "explicit";
					breasts: Array<{ area: BreastLocation; data: SingleBreast }>;
			  }
			| { type: "shared"; data?: SingleBreast; areas?: BreastLocation[] },
	) {
		if (args.type === "shared") {
			const {
				data = {
					size: CupSize.C,
					milkCapacity: MilkCapacity.AVERAGE,
					isLactating: false,
					nipple: NippleDescription.PROTRUDING,
					areola: AreolaDescription.DEFAULT,
				},
				areas = [BreastLocation.LEFT, BreastLocation.RIGHT],
			} = args;

			areas.forEach((area) => {
				this._breasts.set(area, data);
			});
		} else {
			const { breasts } = args;

			breasts.forEach((breastData) => {
				this._breasts.set(breastData.area, breastData.data);
			});
		}

		// biome-ignore lint/correctness/noConstructorReturn: <Reactivity>
		return createMutable(this);
	}

	static classId = ClassId.BREASTS;

	static fromJSON(data: SerializedBreastsClass): Breasts {
		const clone = new Breasts({ type: "shared" });

		clone._breasts = data.breasts;

		return clone;
	}

	toJSON(): SerializedBreastsClass {
		return {
			breasts: this._breasts,
		};
	}

	// NOTE - Use this to also check if a breast exists.
	getBreastData(location: BreastLocation) {
		return this._breasts.get(location);
	}
}

// biome-ignore lint/correctness/noUnusedVariables: <Check for static props>
type BreastsClassCheck = SugarBoxCompatibleClassConstructorCheck<
	SerializedBreastsClass,
	typeof Breasts
>;

export { Breasts };
