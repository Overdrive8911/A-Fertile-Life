setup.initializePlayerVariables = () => {
  // $player
  variables().player = {
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
    /* This will contain ItemId in an array */
    inventory: new NSInventoryAndItem.Inventory(),

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
    womb: {
      hp: 100 /* Healthy wombs gestate faster at the cost of this stat, going beyond womb.comfortCapacity, and to a much higher extent with womb.maxCapacity, consumes more hp. The PC's womb will give out at 0hp. Heals overnight while sleeping, with drugs, womb treatments, or eating */,
      maxHp: 100,
      fertility: 100 /* How fertile the user is. 0 -> Barren, 100 -> Fertility Idol */,
      curCapacity: 0 /* Determines the size of her pregnancy, going too far beyond womb.maxCapacity can cause the babies to be 'skin-wrapped'. -1 - Postpartum, 0 - Not Pregnant, >=1 Pregnant */,
      comfortCapacity: 30000 /* How bug she can get without losing any comfort. Slowly increases as womb.exp increases */,
      maxCapacity: 60000 /* How big she can get without bursting. A hard limit that only changes with womb.lvl or some perks */,
      lvl: 1 /* Ranges from 1 to 15. Higher levels have higher capacities, the ability to use stronger and higher level perks, and a lower rate of hp loss. Lvl 1 -> 1000exp, lvl 2 -> 3000exp, lvl 3 -> 7000exp, lvl 4 -> 12000exp, lvl 5 -> 20000exp, lvl 6 -> 30000exp, lvl 7 -> 45000exp, lvl 8 -> 70000exp, lvl 9 -> 100000exp, lvl 10 -> 150000exp, lvl 11 -> 220000exp, lvl 12 -> 310000exp, lvl 13 -> 420000exp, lvl 14 -> 550000exp, lvl 15 -> 1000000exp */,
      exp: 1 /* Increases when pregnant; the amount depends on the womb.fetusData.fetus[].day, womb.fetusData.fetus[].amnioticFluidProduced, womb.fetusData.fetus[].growthModifier, womb.curCapacity, womb.comfortCapacity and womb.maxCapacity. Increases faster once womb.curCapacity nears womb.comfortCapacity and even faster when it goes beyond it; basically the ratio of womb.curCapacity/womb.comfortCapacity (and womb.curCapacity/womb.maxCapacity when the former is high enough) decides how fast exp increases. Once it surpasses the limit for womb.lvl, levels up her womb. Some types of food, drugs, treatments and perks increase its rate of gain */,
      maxExp: 100,
      postpartum: 0 /* 0 -> Can get pregnant, >= 1 -> Postpartum. This variable is set to 7 (can be influenced by some perks) once the PC gives birth to all her children */,
      contraceptives: false,
      birthRecord: 0 /* Number of times the user has given birth */,
      perks: {
        /* If a perk's value is 0, it hasn't been enabled. Any number above 0 is its level and cannot be above womb.lvl. Most perks are inactive if the PC isn't pregnant. */
        /* Some perks can be combo-ed together for greater boosts or special reactions such as ironSpine and motherlyHips, gestator and hyperFertility */
        /* Each perk is an array of 3 values. The first is the level, the second is it's in-game price which increases by 20% every upgrade while the third is its max level */
        /*TODO - Change the prices later to something more reasonable. Also, add more perks */

        gestator: [
          0, 5000, 10,
        ] /* Increases the speed of pregnancies depending on how much food is consumed. At the maximum level, pregnancy duration is shortened to at most a week */,
        hyperFertility: [
          0, 3000, 10,
        ] /* Increases the chance of multiples. Higher level can guarantee more babies. At the maximum level, 10 babies can be conceived at once */,
        superfet: [
          0, 15000, 5,
        ] /* Give a little chance for another pregnancy to be conceived while already pregnant. Short for superfetation. May or may not be implemented */,
        elasticity: [
          0, 7000, 10,
        ] /* Slightly increases all bonuses to womb.exp increments. Gradually increases womb.comfortCapacity and slightly increases womb.maxCapacity */,
        immunityBoost: [
          0, 2000, 10,
        ] /* Increases immunity when pregnant; giving higher bonuses at the pregnancy advances */,
        motherlyHips: [
          0, 5000, 5,
        ] /* Slowly increases hipWidth to Child-Bearing while pregnant. Can allow the user keep doing lower-body intensive activities. Natural birth is much easier, quicker and less painful */,
        motherlyBoobs: [
          0, 5000, 5,
        ] /* Slowly increases breastSize and milkCapacity while pregnant. Milking yourself is more pleasurable. */,
        ironSpine: [
          0, 7000, 5,
        ] /* Can carry bigger pregnancies and more weight before becoming bed bound */,
        sensitiveWomb: [
          0, 6000, 5,
        ] /* Fetal movement increases your arousal (this can make doing activities with a full womb much harder) and mental health; the more babies your pregnant with, the greater the boost. Natural birth will always be pleasurable but may be longer if you orgasm too much. Slowly increases womb.comfortCapacity to an extent. Basically hyperuterine sensitivity */,
        healthyWomb: [
          0, 3000, 10,
        ] /* Increases all sources of gain to womb.hp. Slightly weakens all decrements to womb.hp */,
        fortifiedWomb: [
          0, 10000, 5,
        ] /* Reduces the increase rate of womb.comfortCapacity but raises womb.maxCapacity. The womb can never burst (once fully upgraded) but reaching that point automatically bed-bounds the user. Once upgraded halfway, allows the user to naturally delay labour to a certain extent. Slows down womb.hp drain */,
        noPostpartum: [
          0, 2000, 7,
        ] /* Reduces the postpartum period of the PC by 1 day (Note that the PC has a recovery period of a week) */,
      },
      sideEffects: {
        /* Most can occur anytime in a pregnancy after 20% of fetal development is achieved and usually reduce performance or do some other undesirable stuff until they leave. Upgrading some perks can cause them to become stronger. */
        /* They are arrays containing 2 values; the first decides if the user is afflicted with them and how long the condition will last while the second is an array storing the amount of days the side effect can last (if the latter is 0, it means the during depends entirely on other things). */
        /* TODO - Add more side effects */

        cravingCrisis: [
          0,
          [1, 2],
        ] /* Constantly reduces some stats and benefits of food until a randomly generated craving is satisfied. */,
        motherHunger: [
          0,
          [1, 2, 3],
        ] /* Reduces the amount of fullness food gives and allows fullness to be exceeded to a randomly generated extent. The user suffers penalties in stats and productivity if their . */,
        restlessBrood: [
          0,
          [2, 3],
        ] /* Drains energy faster and increases the energy cost of actions. Also reduces concentration and efficiency at work. The user will have to temporarily soother their children a lot. */,
        heavyWomb: [
          0,
          [3, 5, 7],
        ] /* Reduces non-vehicle movement speed and drains energy faster. Trying to do work in this condition may extend it. */,
        contractions: [
          0,
          [0],
        ] /* Happens randomly around the user's due date and takes a small cut out of their stats. It also has the user stunned in place temporarily. */,
        labour: [
          0,
          [0],
        ] /* Constantly reduces the user's stats until they start giving birth. Once womb.hp or hp reach critical levels, the user automatically starts birthing. Can be delayed with labour-suppression drugs/treatments and specific perks. */,
        sexCraving: [
          0,
          [1, 3],
        ] /* Maxes out arousal once a day and keeps it above 75 */,
        growthSpurt: [
          0,
          [0],
        ] /* Can happen whenever the user does a lot of stuff that attributes to the growth of their pregnancy. This will happen around 12pm or 12am */,
      },
      fetusData:
        new Map() /* This array gets filled up when the pc is inseminated using template data in setup.player */,
    },

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

  // SECTION - static data
  setup.player = {
    /* ID */
    id: 1 /* Id of the player. Mainly used to determine the baby's. */ /*NOTE - No use atm */,

    /* Template for adding new fetuses to the player  */
    templateFetus: {
      hp: 0 /* Ranges from 0 till 100. Current hp of fetus, mostly depends on how high womb.hp is. Doesn't do anything for now  */,
      day: 0 /* Development day of the baby */,
      fluid: 0 /* Amount of amniotic fluid produced for this baby in CCs. Decreases steadily with each multiple fetus */,
      growthMod: 1 /* Growth modifier of the child. Normally at x1 but can be altered by specific drugs, treatments or perks */,
      growth: 0 /* How much the baby has grown in percentage. 0 - 100. 100 is full term. */,
      genes: {
        fatherId: 0,
        motherId: 0,
        sex: 0 /* 0 -> XX, 1 -> XY */,
      },
    },
  };
};
