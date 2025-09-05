/** biome-ignore-all lint/suspicious/noConstEnum: <Const enum :3> */

export const enum FetusSpecies {
	HUMAN,
	TENTACLE,
}

// Enum constants to dictate the level of fertility (it's over 100)
export const enum FertilityLevel {
	BARREN,
	ALMOST_BARREN = 10,
	POOR_FERTILITY = 25,
	AVERAGE_FERTILITY = 45,
	HIGH_FERTILITY = 65,
	EXTREME_FERTILITY = 85,
	UNFATHOMABLE_FERTILITY = 100,
	FERTILITY_IDOL = 101,
}

// Imagine these as percentages (womb.hp / womb.maxHp)
export enum WombHealth {
	RIP,
	CRITICAL = 15,
	VERY_POOR = 35,
	POOR = 50,
	MEDIOCRE = 70,
	HEALTHY = 80,
	VERY_HEALTHY = 90,
	FULL_VITALITY = 100,
}

export enum BirthRecordThreshold {
	NEWB,
	INEXPERIENCED = 1,
	STARTER = 3,
	EXPERIENCED = 5,
	VETERAN = 10,
	MOTHER = 25,
}

// There are 40 gestational weeks, give or take. Each gestational week doesn't mean a literal week, more so, a relative portion of gestational development that mirrors irl. So it's a fixed ratio whose actual value depends on the length of gestation
export const enum GestationalWeek {
	One = 1,
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Eleven,
	Twelve,
	Thirteen,
	Fourteen,
	Fifteen,
	Sixteen,
	Seventeen,
	Eighteen,
	Nineteen,
	Twenty,
	TwentyOne,
	TwentyTwo,
	TwentyThree,
	TwentyFour,
	TwentyFive,
	TwentySix,
	TwentySeven,
	TwentyEight,
	TwentyNine,
	Thirty,
	ThirtyOne,
	ThirtyTwo,
	ThirtyThree,
	ThirtyFour,
	ThirtyFive,
	ThirtySix,
	ThirtySeven,
	ThirtyEight,
	ThirtyNine,
	Forty,

	MIN = One,
	MAX = Forty,

	EARLY_TERM = MIN,
	MID_TERM = Fourteen,
	LATE_TERM = TwentyEight,
	FULL_TERM = MAX,
}

/**
 * Game constants for pregnancy and womb-related mechanics
 */
export const enum PregConstants {
	/** +300% speed */
	GESTATOR_PERK_MAX_SPEED_BOOST = 3,
	/** +50% increase */
	ELASTICITY_PERK_MAX_EXP_BOOST = 0.5,
	/** +20% increase to both `comfortCapacity` and `maxCapacity` */
	ELASTICITY_PERK_CAPACITY_MAX_BOOST = 0.2,
	/** 3 extra immunity points for every 1% increase in development per fetus */
	IMMUNITY_PERK_MAX_BOOST_PER_FETUS = 3,
	/** +75% to all sources of positive hp */
	HEALTHY_WOMB_PERK_MAX_HP_INCREMENT_BUFF = 0.75,
	/** -25% to all sources of negative hp */
	HEALTHY_WOMB_PERK_MAX_HP_DECREMENT_NERF = 0.25,
	/** +50% increase to `maxCapacity` */
	FORTIFIED_WOMB_PERK_MAX_CAPACITY_BOOST = 0.5,
	/** +25% more time after becoming due before birth may occur */
	FORTIFIED_WOMB_PERK_MAX_NATURAL_BIRTH_DELAY = 0.25,
	/** -25% to passive hp drain */
	FORTIFIED_WOMB_PERK_MAX_PASSIVE_HP_DRAIN_NERF = 0.25,
	/** +50% more amniotic fluid per fetus */
	POLYHYDRAMNIOS_PERK_MAX_FLUID_PRODUCTION_BOOST = 0.5,

	/** How many hours it takes till the function to update the stats of pregnancy occurs */
	HOURS_BETWEEN_PREG_UPDATE = 4,

	/** 375 ml */
	MINIMUM_VOLUME_OF_AMNIOTIC_FLUID = 375,
	/** 0 Percent - lower bound of the `developmentRatio` of a fetus */
	MIN_DEVELOPMENT_STATE = 0,
	/** 100 Percent - upper bound of the `developmentRatio` of a fetus */
	MAX_DEVELOPMENT_STATE = 100,

	/** 37 weeks - birth is considered "full-term" from this week onwards */
	MIN_NORMAL_BIRTH_THRESHOLD = 92.5,
	/** 33 weeks */
	PREEMIE_BIRTH_THRESHOLD = 82.5,
	/** 28 weeks - the very minimum threshold for birth to occur */
	VERY_PREEMIE_BIRTH_THRESHOLD = 70,

	/** Birth can start 100% safely from the 36th week, before then (32 - 36), it's an early birth */
	NUM_OF_GESTATIONAL_WEEKS = 40,
	/** 10 months. 40 weeks. 26280028.8 seconds. For the player, this is 4 */
	DEFAULT_PREGNANCY_LENGTH = 26280028.8,

	/** Time in seconds when the user can't be impregnated. Irl, it takes 6 ~ 8 weeks so I'll just go with a weighted average closer to 8 which is `getWeightedAverage(6, 8) * 7 * 24 * 60 * 60` */
	POSTPARTUM_PERIOD = 4320000,

	/** The higher this number, the higher the rate at which height/weight/amnioticFluid increase and decrease. Best leave it at small ratios and below 1 */
	OVERDUE_STAT_MULTIPLIER = 0.34,

	DEFAULT_MAX_WOMB_HP = 100,
	NUM_OF_POSSIBLE_FETUS_IDS = 65536,

	MIN_WOMB_LEVEL = 1,
	MAX_WOMB_LEVEL = 15,

	/** Singleton, non-overdue, full-term pregnancies award this in total. However, 40% of it is only given during birth. */
	EXP_PER_SINGLE_PREGNANCY = 1000,
	EXP_PER_SINGLE_BIRTH = EXP_PER_SINGLE_PREGNANCY * 0.4,
	EXP_PER_SINGLE_FETUS_GESTATION = EXP_PER_SINGLE_PREGNANCY -
		EXP_PER_SINGLE_BIRTH,
}
