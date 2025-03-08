//ANCHOR - Boobs, Booty, Hips, Waist, General body fat.


  export 
    // TODO - Make each breast a class :D with a link to the other. Or not, this is only gonna affect the player anyway... Or not! CLASSES
    // NOTE - Breast size doesn't particularly boost milk production, however the two may increase side by side
    export enum CupSize {
      // Cup size per breast in CCs. I basically just copied the measurements from Free Cites Pregmod :p
      /* Size per breast in CCs. 0 - 299 -> flat, 300 - 399 -> A-cup, 400 - 499 -> B-cup, 500 - 649 -> C-cup, 650 - 799 -> D-cup, 800 - 999 -> DD-cup, 1000 - 1199 -> F-cup, 1200 - 1399 -> G-cup, 1400 - 1599 -> H-cup, 1600 - 1799 -> I-cup, 1800 - 2049 -> J-cup, 2050 - 2299 -> K-cup, 2300 - 2599 -> L-cup, 2600 - 2899 -> M-cup, 2900 - 3249 -> N-cup, 3250-3599 -> O-cup, 3600 - 3949 -> P-cup, 3950 - 4299 -> Q-cup, 4300 - 4699 -> R-cup, 4700 - 5099 -> S-cup, 5100 - 10499 -> massive */
      ZERO,
      AA = 299, // From 299 to ZERO is AA-cup (or is it FLAT?)
      A = 399, // From 399 to 300 (AA-cup + 1) is an A-cup
      B = 499, // From 499 to 400 (A-cup + 1) is a B-cup
      C = 649, // From 649 to 500 (B-cup + 1) is a C-cup
      D = 799, // I think you get it by now
      DD = 999,
      E = 1049,
      F = 1199,
      G = 1399,
      H = 1599,
      I = 1799,
      J = 2049,
      K = 2299,
      L = 2599,
      M = 2899,
      N = 3249,
      // O = 3599, // Not using any of these rn
      // P = 3949,
      // Q = 4299,
      // R = 4699,
      // S = 5099,
    }

    export interface SingleBreast {
      size: BreastData.CupSize | number;
      milkCapacity: BreastData.MilkCapacity | number;
      isLactating: boolean;
      nipple: BreastData.NippleDescription;
      areola: BreastData.AreolaDescription;
      // location: BreastData.Location;
    }

    // Milk Capacity (or Breast Storage Capacity) is determined by the number of mammary glands (or lobules / ducts).
    // The human body produces more milk if it is used regularly but slows down as time between milking increases.
    // NOTE - Milking till the breast is empty encourages further milk production
    // Small capacity = ~2.5 oz. Average capacity = ~3.5 oz. Large Capacity = ~5 oz. Unusually large capacity = ~10 oz.
    // Average daily milk intake = ~25 to 30 oz (could range from 16.16 to 48.85 oz with the more typical range between 19.27 to 30.43 oz)
    // A single breastfeeding session could range from 1.82 to 7.91 oz
    // Multiply the ounces by 29.574 to get the value in millimetres / cubic centimetres
    export enum MilkCapacity {
      // in CC / ml, not ounces.
      // NOTE - This is simply for gameplay purposes :p
      // When properly emptied / milked, the milk capacity builds up a bit more. Going on extended periods without properly milking reduces this
      VERY_LOW = 54, // 54 and below is VERY_LOW
      LOW = 74, // 74 to 55 is LOW
      AVERAGE = 104, // 104 to 75 is AVERAGE
      HIGH = 148, // Ya get it
      VERY_HIGH = 234,
      EXTREMELY_HIGH = 296,
      HUCOW = 400,
    }

    export const enum NippleDescription {
      NONE,
      FLAT,
      PUFFY,
      HAIRY,
      PROTRUDING,
      INVERTED,
      BUMPY,
    }

    export const enum AreolaDescription {
      // This is using bit fields since an areola would have 2 different possible properties and I didn't feel like making 2 enums/variables
      // ANCHOR - Shape
      ROUND = 1 << 0,
      OVAL = 1 << 1,

      // ANCHOR - Size
      LARGE = 1 << 2,
      NORMAL = 1 << 3,
      SMALL = 1 << 4,

      // ANCHOR - Defaults
      DEFAULT = ROUND | NORMAL,
    }

    export enum Location {
      // NOTE - The order here is important because this is the same order by which data is added when breasts are initialized in their class. Also, only 3 locations will EVER be available.
      LEFT,
      RIGHT,
      MIDDLE,
    }
  }
}
