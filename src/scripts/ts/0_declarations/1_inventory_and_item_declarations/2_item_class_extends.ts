namespace NSInventoryAndItem {
  // NOTE - Add any new child classes to `AnyItemClass`
  // NOTE - Ny method that uses `dynamicData` / `data` as a parameter MUST also return an object resembling that structure. Also note that the parameter MUST be checked for if it's empty
  export namespace ItemType {
    // REVIEW - Types of food that reduce hunger and may give certain buffs or nerf?
    export class Food extends Item {
      constructor(data?: Partial<Item>) {
        super(data);
      }
    }

    export class Clothing extends Item {
      bodyArea: ClothingArea;

      constructor(data?: Partial<Item>) {
        super(data);
        this.tags.pushUnique(ItemTag.CLOTHING);
        this.bodyArea = ClothingArea.NONE;
      }

      // SECTION - Clothing Item Methods
      // This will always make sure the `data` parameter always has a usable value
      protected static sanitiseClothingData(
        data: ClothingDynamicData | GenericItemDynamicData
      ) {
        return !$.isEmptyObject(data) &&
          (data as ClothingDynamicData).clothingState != undefined
          ? (data as ClothingDynamicData)
          : { clothingState: ClothingState.DEFAULT };
      }
      doesClothCoverBodyPart(bodyPart: ClothingArea) {
        return this.bodyArea != ClothingArea.NONE
          ? bodyPart == (this.bodyArea & bodyPart)
          : false;
      }

      defaultCallback(data?: ClothingDynamicData) {
        // ANCHOR - The stored clothing data is what we use to determine if a clothing item is equipped and what damage state it currently is
        const storedClothingData = Clothing.sanitiseClothingData(data);
        // TODO - Make clothing actually obey their state
        if (storedClothingData.clothingState) {
          // Toggle its state (whether it is worn or not)
          storedClothingData.clothingState ^= ClothingState.IN_USE;

          // If the clothing item is now in use reduce a durability point
        } else {
          // There is no current data about the item so assume that the clothing has never been worn and has max durability
          storedClothingData.clothingState |=
            ClothingState.DURABILITY_EXCELLENT;
          // Wear the clothing
          storedClothingData.clothingState |= ClothingState.IN_USE;
        }

        return storedClothingData;
      }
      // !SECTION

      // SECTION - Clothing Item Static Methods
      // This `data` has to be supplied from the Item in the inventory that called it
      static getDurabilityLevel(data: ClothingDynamicData) {
        const storedClothingData = Clothing.sanitiseClothingData(data);

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
      static setDurabilityLevel(
        data: ClothingDynamicData,
        durabilityLvl:
          | ClothingState.DURABILITY_WORN_OUT
          | ClothingState.DURABILITY_POOR
          | ClothingState.DURABILITY_OKAY
          | ClothingState.DURABILITY_GOOD
          | ClothingState.DURABILITY_HIGH
          | ClothingState.DURABILITY_EXCELLENT
      ) {
        const storedClothingData = Clothing.sanitiseClothingData(data);

        storedClothingData.clothingState |= durabilityLvl;

        return storedClothingData;
      }
      // !SECTION

      // SECTION - Clothing Item Getters
      get isInnerWear() {
        return this.bodyArea & ClothingArea.INNER;
      }
      // !SECTION

      // SECTION - Clothing Item Setters
      // !SECTION
    }

    export class Drug extends Item {
      constructor(data?: Partial<Item>) {
        super(data);
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
  }
}
