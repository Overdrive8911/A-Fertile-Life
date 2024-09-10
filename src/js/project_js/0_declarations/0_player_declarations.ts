type Player = {
  money: number;
  locationData: {
    location: NSLocation.MapLocation;
    subLocation: NSLocation.MapSubLocation;
  };
  personality: {
    enthusiasm: number;
    apathy: number;
    disapproval: number;
    extroverted: number;
    introverted: number;
    caring: number;
    sarcastic: number;
    inquisitive: number;
    patience: number;
  };
  name: string;
  body: {
    sex: number;
    age: {
      physical: number;
      mental: number;
      real: number;
    };
    eyes: {
      leftIris: string;
      rightIris: string;
    };
    hair: {
      colour: string;
      length: number;
      style: string;
      accessories: string;
    };
    weight: number;
    height: number;

    hipSize: number;
    waistSize: number;
  };
  makeup: string;
  nails: string;

  inventory: NSInventoryAndItem.Inventory1;

  mentalStats: {
    mood: number;
    intelligence: number;
  };

  hp: number;
  maxHp: number;
  // illness: number,
  immunity: number;
  energy: number;
  maxEnergy: number;

  womb: Womb;

  breasts: {
    individualSize: number;
    totalMilkCapacity: number;
    isLactating: boolean;
    nipples: string;
    areola: string;
  };

  muscleDefinition: number;

  fullness: number;
  maxFullness: number;
  caloriesEaten: number;
  /* UNUSED stretchMarks:           0,                  /* 0 -> No stretch marks, 1 - 25 -> Light stretch marks, 26 - 50 -> Visible stretch marks, 51 - 75 -> Prominent stretch marks, 76 - 100 -> Black and Blue */
  sag: number;

  arousal: 100;

  /*vagina: {
            ,
        },

        anal: {
            ,
        },*/

  /* Relationships with people
            This is a map that stores experience ranging from -100 (Bitter Enemies) to 100 (Forever Friends) with 0 (Stranger) as the starting point with the name of the NPC.
            e.g -100 to -91 -> Bitter Enemies, -90 to -81 -> Sworn Enemies,
                -80 to -71 -> Arch-enemies, -70 to -61 -> Hostile, -60 to -51 -> Unfriendly,
                -50 to -41 -> Disliked, -40 to -31 -> Disdained, -30 to -21 -> Distant,
                -20 to -11 -> Acquaintance (Negative),
                -10 to 10 -> Stranger,
                11 to 20 -> Acquaintance,
                21 to 30 -> Amicable, 31 to 40 -> Friendly, 41 to 50 -> Liked,
                51 to 60 -> Fond, 61 to 70 -> Close, 71 to 80 -> Dear,
                81 to 90 -> Cherished, 91 to 100 -> Forever Friends */
  relationships: Map<string /* person id or name*/, {} /* Relationship data */>;
  /* TODO - Add more and refine this or maybe use <<addPCRelationship>> and <<removePCRelationship>> to alter this instead of bloating up the object unnecessarily */
  /* This is an array of unnamed objects meant to store the PC's relationship data */
  /* NOTE - This is just an example of how it'll look like. 
            {name: "Fertilo",   exp: 0},
            {name: "Cira",      exp: 0},
            {name: "Katie",     exp: 0},
            {name: "Maria",     exp: 0}, */
};
