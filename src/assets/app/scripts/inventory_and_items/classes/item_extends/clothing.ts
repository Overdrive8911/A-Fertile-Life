import { ItemTag } from "../../declarations/item_enums";
import type {
  ItemConstructorArgs,
  ClothingDynamicData,
  GenericItemDynamicData,
  AllClothingDurabilityPoints,
} from "../../declarations/types_and_interfaces";
import type { Inventory } from "../inventory";
import { Item } from "../item";

export // TODO - Implement clothing
// REVIEW - Consider creating namespaces for each item type
const enum ClothingArea {
  NONE = 0,

  INNER = 1 << 27, // Any clothing item with this flag is for the inner body
  TATTOO = 1 << 28, // Represents a tattoo on any part of the body. And as such is considered  and ignores `INNER` by default

  TOP_OF_HEAD = 1 << 0,
  FACE = 1 << 1, // Technically, this will represent stuff like Glasses and makeup :p
  LEFT_EAR = 1 << 2,
  RIGHT_EAR = 1 << 3,
  // LEFT_CHEEK = 1 << 4,
  // RIGHT_CHEEK = 1 << 5,
  NECK = 1 << 4,
  TONGUE = 1 << 5,

  LEFT_SHOULDER = 1 << 6,
  RIGHT_SHOULDER = 1 << 7,
  CHEST = 1 << 8,
  ABDOMEN = 1 << 9,

  LEFT_UPPER_ARM = 1 << 10,
  LEFT_FORE_ARM = 1 << 11,
  LEFT_WRIST = 1 << 12,
  LEFT_HAND = 1 << 13,
  RIGHT_UPPER_ARM = 1 << 14,
  RIGHT_FORE_ARM = 1 << 15,
  RIGHT_WRIST = 1 << 16,
  RIGHT_HAND = 1 << 17,

  WAIST = 1 << 18,

  LEFT_THIGH = 1 << 19, // Also includes the knees
  LEFT_CALF = 1 << 20, // May also include ankles
  LEFT_ANKLE = 1 << 21,
  LEFT_FOOT = 1 << 22,
  RIGHT_THIGH = 1 << 23, // Also includes the knees
  RIGHT_CALF = 1 << 24, // May also include ankles
  RIGHT_ANKLE = 1 << 25,
  RIGHT_FOOT = 1 << 26,

  // ANCHOR - Area combinations
  EARS = LEFT_EAR | RIGHT_EAR,
  ENTIRE_HEAD = TOP_OF_HEAD | FACE | EARS,
  FACE_MAKEUP = FACE | INNER,

  TORSO = CHEST | ABDOMEN,
  TORSO_INNER = TORSO | INNER,
  CHEST_INNER = CHEST | INNER,
  ABDOMEN_INNER = ABDOMEN | INNER,

  LEFT_ARM = LEFT_UPPER_ARM | LEFT_FORE_ARM,
  LEFT_ENTIRE_ARM = LEFT_ARM | LEFT_WRIST | LEFT_HAND | LEFT_SHOULDER,
  RIGHT_ARM = RIGHT_UPPER_ARM | RIGHT_FORE_ARM,
  RIGHT_ENTIRE_ARM = RIGHT_ARM | RIGHT_WRIST | RIGHT_HAND | RIGHT_SHOULDER,
  ARMS = LEFT_ARM | RIGHT_ARM,
  ENTIRE_ARMS = LEFT_ENTIRE_ARM | RIGHT_ENTIRE_ARM,
  SHOULDERS = LEFT_SHOULDER | RIGHT_SHOULDER,

  UPPER_BODY = ENTIRE_HEAD | TORSO | ENTIRE_ARMS,

  LEFT_LEG = LEFT_THIGH | LEFT_CALF,
  LEFT_ENTIRE_LEG = LEFT_LEG | LEFT_ANKLE | LEFT_FOOT,
  RIGHT_LEG = RIGHT_THIGH | RIGHT_CALF,
  RIGHT_ENTIRE_LEG = RIGHT_LEG | RIGHT_ANKLE | RIGHT_FOOT,
  LEGS = LEFT_LEG | RIGHT_LEG,
  ENTIRE_LEGS = LEFT_ENTIRE_LEG | RIGHT_ENTIRE_LEG,
  THIGHS = LEFT_THIGH | RIGHT_THIGH,
  CALVES = LEFT_CALF | RIGHT_CALF,
  ANKLES = RIGHT_ANKLE | LEFT_ANKLE,
  FEET = LEFT_FOOT | RIGHT_FOOT,

  PRIVATES = WAIST | INNER,

  LOWER_BODY = WAIST | ENTIRE_LEGS,

  ENTIRE_BODY = UPPER_BODY | LOWER_BODY,

  // Other combinations
  HAT_AREA = TOP_OF_HEAD,
  SHIRT_AREA = TORSO | SHOULDERS,
  SKIRT_AREA = WAIST | THIGHS,
  SHOE_AREA = FEET | ANKLES,
  BOOT_AREA = SHOE_AREA | CALVES,
}
export const enum ClothingState {
  // The different states of clothing that can be stored as `dynamicData` in the Inventory
  NOT_IN_USE = 0,
  IN_USE = 1 << 0,

  // ANCHOR - Clothing Durability Levels
  DURABILITY_LVL_1 = 1 << 1,
  DURABILITY_LVL_2 = 1 << 2,
  DURABILITY_LVL_3 = 1 << 3,
  DURABILITY_LVL_4 = 1 << 4,
  DURABILITY_LVL_5 = 1 << 5,
  DURABILITY_LVL_6 = 1 << 6,
  DURABILITY_LVL_7 = 1 << 7,
  DURABILITY_LVL_8 = 1 << 8,
  DURABILITY_LVL_9 = 1 << 9,
  DURABILITY_LVL_10 = 1 << 10,
  DURABILITY_LVL_11 = 1 << 11,
  DURABILITY_LVL_12 = 1 << 12,
  DURABILITY_LVL_13 = 1 << 13,
  DURABILITY_LVL_14 = 1 << 14,
  DURABILITY_LVL_15 = 1 << 15,
  DURABILITY_LVL_16 = 1 << 16,
  DURABILITY_LVL_17 = 1 << 17,
  DURABILITY_LVL_18 = 1 << 18,
  DURABILITY_LVL_19 = 1 << 19,
  DURABILITY_LVL_20 = 1 << 20,
  DURABILITY_LVL_21 = 1 << 21,
  DURABILITY_LVL_22 = 1 << 22,
  DURABILITY_LVL_23 = 1 << 23,
  DURABILITY_LVL_24 = 1 << 24,
  DURABILITY_LVL_25 = 1 << 25,
  DURABILITY_LVL_26 = 1 << 26,
  DURABILITY_LVL_27 = 1 << 27,
  DURABILITY_LVL_28 = 1 << 28,
  DURABILITY_LVL_29 = 1 << 29,
  DURABILITY_LVL_30 = 1 << 30,

  DURABILITY_STAGE_1 = DURABILITY_LVL_5 |
    DURABILITY_LVL_4 |
    DURABILITY_LVL_3 |
    DURABILITY_LVL_2 |
    DURABILITY_LVL_1,
  DURABILITY_STAGE_2 = DURABILITY_LVL_10 |
    DURABILITY_LVL_9 |
    DURABILITY_LVL_8 |
    DURABILITY_LVL_7 |
    DURABILITY_LVL_6,
  DURABILITY_STAGE_3 = DURABILITY_LVL_15 |
    DURABILITY_LVL_14 |
    DURABILITY_LVL_13 |
    DURABILITY_LVL_12 |
    DURABILITY_LVL_11,
  DURABILITY_STAGE_4 = DURABILITY_LVL_20 |
    DURABILITY_LVL_19 |
    DURABILITY_LVL_18 |
    DURABILITY_LVL_17 |
    DURABILITY_LVL_16,
  DURABILITY_STAGE_5 = DURABILITY_LVL_25 |
    DURABILITY_LVL_24 |
    DURABILITY_LVL_23 |
    DURABILITY_LVL_22 |
    DURABILITY_LVL_21,
  DURABILITY_STAGE_6 = DURABILITY_LVL_30 |
    DURABILITY_LVL_29 |
    DURABILITY_LVL_28 |
    DURABILITY_LVL_27 |
    DURABILITY_LVL_26,

  DURABILITY_WORN_OUT = DURABILITY_STAGE_1,
  DURABILITY_POOR = DURABILITY_STAGE_2 | DURABILITY_WORN_OUT,
  DURABILITY_OKAY = DURABILITY_STAGE_3 | DURABILITY_POOR,
  DURABILITY_GOOD = DURABILITY_STAGE_4 | DURABILITY_OKAY,
  DURABILITY_HIGH = DURABILITY_STAGE_5 | DURABILITY_GOOD,
  DURABILITY_EXCELLENT = DURABILITY_STAGE_6 | DURABILITY_HIGH,

  DEFAULT = DURABILITY_EXCELLENT | NOT_IN_USE,
  ALL_DURABILITY_POINTS = DURABILITY_STAGE_1 |
    DURABILITY_STAGE_2 |
    DURABILITY_STAGE_3 |
    DURABILITY_STAGE_4 |
    DURABILITY_STAGE_5 |
    DURABILITY_STAGE_6,
  LOWEST_DURABILITY_POINT = DURABILITY_LVL_1,
  HIGHEST_DURABILITY_POINT = DURABILITY_LVL_30,
}

export class Clothing extends Item {
  // If this has to be "truly" private, then you'd have to scrap the getter / setters for regular methods while ensuring to `bind(this)` them in the constructor. Otherwise you may encounter an error related to `TypeError: Cannot write private member to an object whose class did not declare it`
  // NOTE - Don't use this directly. Just use the getter / setters
  //@ts-ignore
  private a: ClothingArea;

  constructor(data: ItemConstructorArgs<Clothing>) {
    super(data);
    this.usable = true;
    this.addTags(ItemTag.CLOTHING);
  }

  // SECTION - Clothing Item Methods
  override defaultCallback(
    data?: ClothingDynamicData,
    inventory = variables().player.inventory
  ) {
    // ANCHOR - The stored clothing data is what we use to determine if a clothing item is equipped and what damage state it currently is
    let storedClothingData = Clothing.sanitiseClothingData(data);
    const isEquipped = Clothing.isEquipped(data);

    // TODO - Only wear the clothing item if there's still free space on the body
    if (isEquipped) {
      // Un-equip the clothing
      storedClothingData.clothingState &= ~ClothingState.IN_USE;
    } else if (this.canClothBeEquipped(inventory)) {
      // Equip the clothing
      storedClothingData.clothingState |= ClothingState.IN_USE;

      // There's a 50% chance to lose a durability point when clothing is equipped
      if (randomFloat(1) > 0.5) {
        storedClothingData = Clothing.reduceDurabilityPoints(
          storedClothingData,
          1
        );
      }
    }

    return storedClothingData;
  }

  doesClothCoverBodyPart(bodyPart: ClothingArea) {
    return this.bodyArea != ClothingArea.NONE
      ? bodyPart == (this.bodyArea & bodyPart)
      : false;
  }

  canClothBeEquipped(inventory: Inventory) {
    const allEquippedClothing = Clothing.getAllEquippedClothing(inventory);
    if (!allEquippedClothing) return true;

    const occupiedBodyAreasArray = allEquippedClothing.map((data) => {
      return data.staticData.bodyArea;
    });

    if (!occupiedBodyAreasArray) return true;

    let occupiedOuterBodyAreas = ClothingArea.NONE;
    let occupiedInnerBodyAreas = ClothingArea.NONE;

    occupiedBodyAreasArray.forEach((val) => {
      if (val & ClothingArea.INNER) occupiedInnerBodyAreas |= val;
      else occupiedOuterBodyAreas |= val;
    });

    // let result = false

    if (
      occupiedOuterBodyAreas & this.bodyArea &&
      occupiedInnerBodyAreas & this.bodyArea
    ) {
      // There's not enough free space on either the inner / outer part of the body
      return false;
    }
    return true;
  }
  // !SECTION

  // SECTION - Clothing Item Static Methods

  // This will always make sure the `data` parameter always has a usable value
  protected static sanitiseClothingData(
    data: ClothingDynamicData | GenericItemDynamicData | undefined
  ) {
    if (!data) return { clothingState: ClothingState.DEFAULT };

    return !$.isEmptyObject(data) &&
      (data as ClothingDynamicData).clothingState != undefined
      ? (data as ClothingDynamicData)
      : { clothingState: ClothingState.DEFAULT };
  }
  // This `data` has to be supplied from the Item in the inventory that called it
  static getAverageDurabilityLevel(data: ClothingDynamicData) {
    const storedClothingData = this.sanitiseClothingData(data);

    if (storedClothingData.clothingState) {
      let bitField = storedClothingData.clothingState;
      // Unset unneeded bits
      bitField &= ~ClothingState.IN_USE;

      if (bitField & ClothingState.DURABILITY_EXCELLENT) {
        return ClothingState.DURABILITY_EXCELLENT;
      } else if (bitField & ClothingState.DURABILITY_HIGH) {
        return ClothingState.DURABILITY_HIGH;
      } else if (bitField & ClothingState.DURABILITY_GOOD) {
        return ClothingState.DURABILITY_GOOD;
      } else if (bitField & ClothingState.DURABILITY_OKAY) {
        return ClothingState.DURABILITY_OKAY;
      } else if (bitField & ClothingState.DURABILITY_POOR) {
        return ClothingState.DURABILITY_POOR;
      } else {
        return ClothingState.DURABILITY_WORN_OUT;
      }
    }

    // No data so just default to being worn out
    return ClothingState.DURABILITY_WORN_OUT;
  }
  static setAverageDurabilityLevel(
    data: ClothingDynamicData,
    durabilityLvl:
      | ClothingState.DURABILITY_WORN_OUT
      | ClothingState.DURABILITY_POOR
      | ClothingState.DURABILITY_OKAY
      | ClothingState.DURABILITY_GOOD
      | ClothingState.DURABILITY_HIGH
      | ClothingState.DURABILITY_EXCELLENT
  ) {
    let storedClothingData = this.sanitiseClothingData(data);

    // Clear the durability before resetting it.
    storedClothingData = this.clearDurabilityPoints(storedClothingData);

    storedClothingData.clothingState |= durabilityLvl;

    return storedClothingData;
  }

  // Returns a member of the type `AllClothingDurabilityPoints`
  static getHighestDurabilityPoint(
    data: ClothingDynamicData
  ): AllClothingDurabilityPoints {
    const storedClothingData = this.sanitiseClothingData(data);

    // This clears all non-necessary bits and then checks the amount of leading zeros (in a 32 bit representation). Subtracting that from 31 should give us the appropriate bit position
    return (
      1 <<
      (31 -
        Math.clz32(
          storedClothingData.clothingState & ClothingState.ALL_DURABILITY_POINTS
        ))
    );
  }

  static #getBitPos(durPoint: AllClothingDurabilityPoints) {
    return 31 - Math.clz32(durPoint);
  }

  static setDurabilityPoint(
    data: ClothingDynamicData,
    durabilityPoint: AllClothingDurabilityPoints
  ) {
    let storedClothingData = this.sanitiseClothingData(data);

    const bitPosUpperBound = this.#getBitPos(durabilityPoint);
    const bitPosLowerBound = this.#getBitPos(
      ClothingState.LOWEST_DURABILITY_POINT
    );

    // Clear all the durability bits
    storedClothingData = this.clearDurabilityPoints(storedClothingData);

    // Set all the bits (inclusively) between the 2 boundaries
    for (let i = bitPosLowerBound; i <= bitPosUpperBound; i++) {
      storedClothingData.clothingState |= 1 << i;
    }

    return storedClothingData;
  }

  static clearDurabilityPoints(data: ClothingDynamicData) {
    const storedClothingData = this.sanitiseClothingData(data);

    // Clear all the durability bits
    storedClothingData.clothingState &= ~ClothingState.ALL_DURABILITY_POINTS;

    return storedClothingData;
  }

  static reduceDurabilityPoints(
    data: ClothingDynamicData,
    numToReduceBy: number
  ) {
    let storedClothingData = this.sanitiseClothingData(data);

    const clothingDurability =
      storedClothingData.clothingState & ClothingState.ALL_DURABILITY_POINTS;

    const bitPosUpperBound = this.#getBitPos(clothingDurability);
    const bitPosLowerBound = this.#getBitPos(
      ClothingState.LOWEST_DURABILITY_POINT
    );
    const bitPosAfterReduction = bitPosUpperBound - numToReduceBy;

    // Clear the bits
    storedClothingData = this.clearDurabilityPoints(storedClothingData);

    // Don't go beyond 0 durability
    if (bitPosAfterReduction < bitPosLowerBound) {
      return storedClothingData;
    }

    // Now set the bits to `bitPosAfterReduction`
    storedClothingData = this.setDurabilityPoint(
      storedClothingData,
      1 << bitPosAfterReduction
    );

    return storedClothingData;
  }

  static isEquipped(data: ClothingDynamicData | undefined) {
    const storedClothingData = this.sanitiseClothingData(data);

    return (storedClothingData.clothingState &
      ClothingState.IN_USE) as unknown as boolean;
  }
  static getAllEquippedClothing(inventory: Inventory) {
    let result: {
      staticData: Clothing;
      dynamicData: ClothingDynamicData;
    }[];

    const allClothingInInventory = inventory.getAllItemsByItemTag([
      ItemTag.CLOTHING,
    ]);
    const allEquippedClothingInInventory = allClothingInInventory.filter(
      (clothing) => {
        const storedClothingData = clothing.dynamicData as ClothingDynamicData;
        return this.isEquipped(storedClothingData);
      }
    );

    result = allEquippedClothingInInventory.map((clothing) => {
      return {
        staticData: clothing.staticData as Clothing,
        dynamicData: clothing.dynamicData as ClothingDynamicData,
      };
    });

    return result;
  }
  // !SECTION

  // SECTION - Clothing Item Getters
  get bodyArea() {
    return this.a != undefined ? this.a : ClothingArea.NONE;
  }
  get isInnerWear() {
    return this.bodyArea & ClothingArea.INNER;
  }
  // !SECTION

  // SECTION - Clothing Item Setters
  set bodyArea(val: ClothingArea) {
    if (val != ClothingArea.NONE) this.a = val;
  }
  // !SECTION
}
