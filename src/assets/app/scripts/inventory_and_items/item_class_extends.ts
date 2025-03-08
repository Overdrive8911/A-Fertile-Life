// NOTE - Add any new child classes to `AnyItemClass`
// NOTE - Ny method that uses `dynamicData` / `data` as a parameter MUST also return an object resembling that structure. Also note that the parameter MUST be checked for if it's empty
export // REVIEW - Types of food that reduce hunger and may give certain buffs or nerf?
class Food extends Item {
  constructor(data?: ItemConstructorArgs<Food>) {
    super(data);
    this.addTags(ItemTag.FOOD);
  }
}

export class Clothing extends Item {
  // If this has to be "truly" private, then you'd have to scrap the getter / setters for regular methods while ensuring to `bind(this)` them in the constructor. Otherwise you may encounter an error related to `TypeError: Cannot write private member to an object whose class did not declare it`
  // NOTE - Don't use this directly. Just use the getter / setters
  private a: ClothingArea;

  constructor(data: ItemConstructorArgs<Clothing> = null) {
    super(data);
    this.addTags(ItemTag.CLOTHING);
  }

  // SECTION - Clothing Item Methods
  defaultCallback(
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
    data: ClothingDynamicData | GenericItemDynamicData
  ) {
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

  static isEquipped(data: ClothingDynamicData) {
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

export class Drug extends Item {
  constructor(data?: ItemConstructorArgs<Drug>) {
    super(data);
    this.addTags(ItemTag.DRUGS);
  }
}

// export class Trash extends Item {
//   constructor(data?: Partial<Item>) {
//     super(data);
//   }
// }

// export class Miscellaneous extends Item {
//   constructor(data?: Partial<Item>) {
//     super(data);
//   }
// }
