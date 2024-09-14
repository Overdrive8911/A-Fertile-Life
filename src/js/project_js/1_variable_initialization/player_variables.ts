let saveVar_player: Player = {
  /* Money */
  money: 5800 /* The currency isn't something irl */,

  /* Location */
  locationData: {
    location: "playerHouse",
    subLocation: "bedroom",
  },

  /* Personality and Mood(?) */
  personality: {
    /* The following determine the PC's personality. The starting point is 50 which mean the PC is just meh in that area. Going lower to 0 makes them actively avoid that trait while going higher to a 100 makes them embrace it.
        In some cases, having a value raise also reduces another e.g enthusiasm increases/disapproval reduces and vice versa. */
    enthusiasm: 50 /* Ability to see the bright side of situations and be excited for different things */,
    apathy: 50 /* Just meh, mid */,
    disapproval: 50 /* Actively judges and disagrees with stuff */,

    extroverted: 50 /* Similar to bold */,
    introverted: 50 /* Similar to timid */,

    caring: 50 /* Kind and empathetic */,
    sarcastic: 50 /* bruh */,
    inquisitive: 50 /* How curious and willing to learn the PC is */,
    patience: 50 /* Ability to wait or deal with challenges without becoming annoyed or anxious. */,

    /*adventurous:    50,     /* How willing they are to take risks or try new things. */
    /*confident:      50,     /* How sure they are of themselves and their actions. */
    /*competitive:    50,     /* Desire to be more successful than others. */
    /*empathetic:     50,     /* Ability to understand and share the feelings of another. */
    /*saucy/sassy?:   50, */
  },

  /* Normal Body Stuff */
  name: "Peizhu Noshihamite" /*TODO - Make the Player need to input a full name then only use the first half */,

  body: {
    sex: 0 /* 0 -> XX, 1 -> XY */,
    age: {
      physical: 26 /* How old the PC looks like */,
      mental: 27 /* How old they are mentally */,
      real: 32 /* How long they've existed */,
    },
    eyes: {
      leftIris: "hazel" /* Left eye colour */,
      rightIris:
        "hazel" /* Right eye colour. If different from leftIris, the PC is heterochromatic */,
    },
    hair: {
      /* Most of the string members are just for flavour */
      colour: "black",
      length: 33 /* In cm */,
      style: "straight",
      accessories: "none",
      /*TODO - Add more member that can deal with more complicated hairstyles like highlights */
    },
    weight: 68 /* In kg. Weight classes are Emaciated, Underweight, Thin, Lean, Average, Pudgy, Plump, Chubby, Curvy, Overweight, Fat, Obese. height is also used in calculating the BMI */,
    height: 167 /* In cm. It's approximately 5'6". Height classes are Dwarf, Very Short, Short, Somewhat short, Average, Somewhat Tall, Tall, Very Tall, Mini Giant */,

    /* Hip and waist */
    /*TODO - Make the hip.size and waist.size related description wise */
    hipSize: 41 /* In inches. 32.3 - 33.3 -> Very Narrow, 33.4 - 35.5 -> Narrow, 35.6 - 37.5 -> Quite Narrow, 37.6 - 40.4 -> Average, 40.5 - 43.3 -> Wide, 43.4 - 46.5 -> Very Wide, 46.6 - 50.5 -> Child-Bearing, 50.6 and above -> Brood Mother Hips. Birthing increases this to an extent */,
    waistSize: 30 /* In inches. 22.3 - 23.3 -> Extra Slim, 23.4 - 25.5 -> Very Slim, 25.6 - 27.5 -> Slim, 27.6 - 30.4 -> Average, 30.5 - 33.3 -> Wide, 33.4 - 35.5 -> Very Wide, 35.6 - 38.4 -> Plus-Sized, 38.5 - 42.4 -> Plus-Sized 2x, 42.5 - 46.4 -> Plus-Sized 3x, 46.5 - 50.4 -> Plus-Sized 4x, 50.5 - 53.5 -> Plus-Sized 5x. Getting fat increases this to an extent */,
  },

  makeup: "light",
  nails: "normal",

  /* Inventory */
  /* This will contain itemIds in an array */
  inventory: new Map(),

  /* Mental Stats */
  /* All of them have a max of 100 */
  mentalStats: {
    mood: 70,
    intelligence: 75,
  },

  /* Health and Energy */
  /* All of them have a max of 100 */
  /*TODO - Put these in another object */
  hp: 80 /* Don't let it get down to 0 :> */,
  //illness: 0 /* 0 -> Not ill, 1 - 25 -> Mildly ill, 26 - 50 -> Ill, 51 - 75 -> Very ill, 76 - 99 -> Deathly ill */,
  maxHp: 100,
  immunity: 85 /* Resistance to illness */,
  energy: 70 /* 0 - 10 -> Completely exhausted, 11 - 25 -> exhausted, 26 - 40 -> very tired, 41 - 50 - Tired, 51 - 60 -> Fatigued, 61 - 75 - Normal, 76 - 85 -> Perky, 86 - 99 -> Energetic, 100 -> Completely Refreshed */,
  maxEnergy: 100,

  /* Womb, Pregnancy and Birth */
  /* A single full term pregnancy is about 30000CC, every extra full term baby adds about 15000CC under normal conditions */
  /* A regular pregnancy lasts for at least 40 weeks if her womb capacity hasn't been exceeded and 37 weeks if it has */
  /* The PC's pregnancy lasts for at least 4 weeks if her womb capacity hasn't been exceeded and 3 weeks 4 days if it has */
  /* Capacity is in cubic centimetres(CCs) */
  // @ts-expect-error
  // NOTE - Fix this ts error later
  womb: new NSPregnancy.Womb({
    fertility: NSPregnancy.FertilityLevel.EXTREME_FERTILITY,
    comfortCapacity:
      NSPregnancy.BellyState.FULL_TERM + NSPregnancy.BellyState.EARLY_PREGNANCY,
    maxCapacity: NSPregnancy.BellyState.FULL_TERM_TWINS,
    naturalGrowthMod: 10,
  }),

  /* Breast and Lactation */
  breasts: {
    individualSize: 999 /* Size per breast in CCs. 0 - 299 -> flat, 300 - 399 -> A-cup, 400 - 499 -> B-cup, 500 - 649 -> C-cup, 650 - 799 -> D-cup, 800 - 999 -> DD-cup, 1000 - 1199 -> F-cup, 1200 - 1399 -> G-cup, 1400 - 1599 -> H-cup, 1600 - 1799 -> I-cup, 1800 - 2049 -> J-cup, 2050 - 2299 -> K-cup, 2300 - 2599 -> L-cup, 2600 - 2899 -> M-cup, 2900 - 3249 -> N-cup, 3250-3599 -> O-cup, 3600 - 3949 -> P-cup, 3950 - 4299 -> Q-cup, 4300 - 4699 -> R-cup, 4700 - 5099 -> S-cup, 5100 - 10499 -> massive */,
    totalMilkCapacity: 500 /* In millilitres */,
    isLactating: false,
    nipples: "perky",
    areola: "normal",
  },

  /* Muscle */
  muscleDefinition: 44 /* 0 - 17 -> Very frail, 18 - 35 -> Frail, 36 - 53 -> Average, 54 - 66 -> Toned, 67 - 82 -> Well-Defined, 83 - 95 -> Jacked, 96 - 100 -> Body Builder */,

  /* Stomach and Hunger */
  fullness: 85 /* From 0 to 100. Decreases over time, especially when doing strenuous work. Increases after eating. As long as its above 70, the user will not be hungry. The user cannot eat if the amount of fullness is 100 */,
  maxFullness: 100,
  caloriesEaten: 2100 /* Stores the daily amount of calories consumed by the user. Is used in calculating changes to weight */,
  /* UNUSED stretchMarks:           0,                  /* 0 -> No stretch marks, 1 - 25 -> Light stretch marks, 26 - 50 -> Visible stretch marks, 51 - 75 -> Prominent stretch marks, 76 - 100 -> Black and Blue */
  sag: 0 /* Slowly increases depending on womb.curCapacity. Some upgrades reduce its progress. Reduces when not pregnant */,

  /* Sexy stuff ig */
  /*TODO - */
  arousal: 100,

  /*vagina: {
        ,
    },

    anal: {
        ,
    },*/

  /* Relationships with people
        This is an array that stores experience ranging from -100 (Bitter Enemies) to 100 (Forever Friends) with 0 (Stranger) as the starting point with the name of the NPC.
        e.g -100 to -91 -> Bitter Enemies, -90 to -81 -> Sworn Enemies,
            -80 to -71 -> Arch-enemies, -70 to -61 -> Hostile, -60 to -51 -> Unfriendly,
            -50 to -41 -> Disliked, -40 to -31 -> Disdained, -30 to -21 -> Distant,
            -20 to -11 -> Acquaintance (Negative),
            -10 to 10 -> Stranger,
            11 to 20 -> Acquaintance,
            21 to 30 -> Amicable, 31 to 40 -> Friendly, 41 to 50 -> Liked,
            51 to 60 -> Fond, 61 to 70 -> Close, 71 to 80 -> Dear,
            81 to 90 -> Cherished, 91 to 100 -> Forever Friends */
  relationships: new Map(),
  /* TODO - Add more and refine this or maybe use <<addPCRelationship>> and <<removePCRelationship>> to alter this instead of bloating up the object unnecessarily */
  /* This is an array of unnamed objects meant to store the PC's relationship data */
  /* NOTE - This is just an example of how it'll look like. 
        {name: "Fertilo",   exp: 0},
        {name: "Cira",      exp: 0},
        {name: "Katie",     exp: 0},
        {name: "Maria",     exp: 0}, */
};
