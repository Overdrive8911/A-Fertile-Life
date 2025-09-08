import type { Satisfies } from "~/types/generics";

interface PregPerkDynamicData {
	currLevel: number;
}
interface PregPerkStaticData {
	price: number;
	maxLevel: number;
}

interface PregSideEffectDynamicData {
	/** Remaining duration (in seconds) that the side effect will last before leaving on its own.
	 */
	currDuration: number;
}
interface PregSideEffectStaticData {
	/** How long (in days) that the side effect will last when it is applied to the womb.
	 *
	 * If multiple values are provided, one is selected randomly
	 */
	maxDuration: [number, ...number[]];
}

type PregPerks =
	| "gestator"
	| "hyperFertility"
	| "superFet"
	| "elasticity"
	| "immunityBoost"
	| "motherlyHips"
	| "motherlyBoobs"
	| "ironSpine"
	| "sensitiveWomb"
	| "healthyWomb"
	| "fortifiedWomb"
	| "noPostpartum"
	| "polyhydramnios";

type EitherPerkPerkDataType = PregPerkDynamicData | PregPerkStaticData;

type PregPerkObject<TData extends EitherPerkPerkDataType> = Satisfies<
	{
		/** Increases the speed of pregnancies, but makes and keeps the user hungrier. At the maximum level, pregnancy duration sped up by `gGestatorPerkMaxSpeedBoost` and additional hunger drain is always 30% of that. */
		gestator: TData;

		/** Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can usually be conceived at once */
		hyperFertility: TData;

		/** Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */
		superFet: TData;

		/** Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */
		elasticity: TData;

		/** Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */
		immunityBoost: TData;

		/** Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */
		motherlyHips: TData;

		/** Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */
		motherlyBoobs: TData;

		/** Can carry bigger pregnancies and more weight before becoming bed bound */
		ironSpine: TData;

		/** Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */
		sensitiveWomb: TData;

		/** Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */
		healthyWomb: TData;

		/** Raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */
		fortifiedWomb: TData;

		/** Reduces the postpartum period, completely erasing it at max. Is only useful when activated before giving birth, that is, activating this perk during the postpartum period does nothing (Note that the PC has a recovery period of a week) */
		noPostpartum: TData;

		/** Increases amniotic fluid production per fetus */
		polyhydramnios: TData;
	},
	Record<PregPerks, EitherPerkPerkDataType>
>;

export type PregPerkStaticDataObject = PregPerkObject<PregPerkStaticData>;
export type PregPerkDynamicDataObject = Partial<
	PregPerkObject<PregPerkDynamicData>
>;

type PregSideEffects =
	| "cravingCrisis"
	| "motherHunger"
	| "restlessBrood"
	| "heavyWomb"
	| "contractions"
	| "labor"
	| "growthSpurt";

type EitherSideEffectDataType =
	| PregSideEffectDynamicData
	| PregSideEffectStaticData;

type PregSideEffectObject<TData extends EitherSideEffectDataType> = Satisfies<
	{
		/** Pregnancy cravings fluctuate wildly from starving to satiated to hungry in real time. Constant management needed. */
		cravingCrisis: TData;

		/** Gradually increases caloric needs while pregnant. */
		motherHunger: TData;

		/** Fetuses are more active than usual and cause discomfort, making activity difficult. Pregnant characters may find it hard to focus or move comfortably. Also drains more stamina and womb health */
		restlessBrood: TData;

		/** The womb feels abnormally heavy, impeding movement and making physical tasks more challenging. Also drains more stamina and womb health  */
		heavyWomb: TData;

		/** The womb contracts occasionally, causing discomfort and signaling the body is preparing for labor. Happens randomly around the user's due date and takes a small cut out of their stats */
		contractions: TData;

		/** The final stage of pregnancy where the birth process begins. Active labor with contractions and the need to deliver. Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */
		labor: TData;

		/** Fetuses experience rapid growth spurts, increasing size and weight significantly in short periods. */
		growthSpurt: TData;
	},
	Record<PregSideEffects, EitherSideEffectDataType>
>;

export type PregSideEffectStaticDataObject =
	PregSideEffectObject<PregSideEffectStaticData>;
export type PregSideEffectDynamicDataObject = Partial<
	PregSideEffectObject<PregSideEffectDynamicData>
>;

export type Gender = "M" | "F" | "I"; // male, female, intersex

/**
 * This will serve as the format for a lookup table used to determine a fetus's stats
 */
export type FetalGrowthStats = {
	/** Height in cm */
	height: number;
	/** Weight in grams */
	weight: number;
	/** Fluid in ml */
	fluid: number;
};
