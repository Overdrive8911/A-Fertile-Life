namespace NSInventoryAndItem {
  // NOTE - Add any new child classes to `AnyItemClass`
  // NOTE - Ny method that uses `dynamicData` / `data` as a parameter MUST also return an object resembling that structure. Also note that the parameter MUST be checked for if it's empty
  export namespace ItemType {
    // REVIEW - Types of food that reduce hunger and may give certain buffs or nerf?
    export class Food extends Item {
      constructor(data?: Partial<Item>) {
        super(data);
        this.addTags(ItemTag.FOOD);
      }
    }

    export class Clothing extends Item {
      #bodyArea: ClothingArea;

      constructor(data: Partial<Item | Clothing> = null) {
        super(data);
        this.addTags(ItemTag.CLOTHING);

        if (data) {
          for (const key in data as Item) {
            if (Object.prototype.hasOwnProperty.call(data as Item, key)) {
              const element = (data as Item)[key as keyof Item];

              //@ts-expect-error
              this[key as keyof Item] = clone(element);
            }
          }
        }
      }

      // SECTION - Clothing Item Methods
      defaultCallback(data?: ClothingDynamicData) {
        // ANCHOR - The stored clothing data is what we use to determine if a clothing item is equipped and what damage state it currently is
        const storedClothingData = Clothing.sanitiseClothingData(data);
        // TODO - Make clothing actually obey their state
        if (storedClothingData.clothingState) {
          // Toggle its state (whether it is worn or not)
          storedClothingData.clothingState ^= ClothingState.IN_USE;

          // TODO - If the clothing item is now in use reduce a durability point
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
        const storedClothingData = this.sanitiseClothingData(data);

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
              storedClothingData.clothingState &
                ClothingState.ALL_DURABILITY_POINTS
            ))
        );
      }

      static setDurabilityPoint(
        data: ClothingDynamicData,
        durabilityPoint: AllClothingDurabilityPoints
      ) {
        const storedClothingData = this.sanitiseClothingData(data);

        const getBitPos = (durPoint: AllClothingDurabilityPoints) => {
          return 31 - Math.clz32(durPoint);
        };

        const bitPosUpperBound = getBitPos(durabilityPoint);
        const bitPosLowerBound = getBitPos(
          ClothingState.LOWEST_DURABILITY_POINT
        );

        // Clear all the durability bits
        storedClothingData.clothingState =
          this.clearDurabilityPoints(storedClothingData);

        // Set all the bits (inclusively) between the 2 boundaries
        for (let i = bitPosLowerBound; i <= bitPosUpperBound; i++) {
          storedClothingData.clothingState |= 1 << i;
        }

        return storedClothingData;
      }

      static clearDurabilityPoints(data: ClothingDynamicData) {
        const storedClothingData = this.sanitiseClothingData(data);

        // Clear all the durability bits
        storedClothingData.clothingState &=
          ~ClothingState.ALL_DURABILITY_POINTS;

        return storedClothingData.clothingState;
      }

      static isEquipped(data: ClothingDynamicData) {
        const storedClothingData = this.sanitiseClothingData(data);

        return storedClothingData.clothingState & ClothingState.IN_USE;
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
            const storedClothingData =
              clothing.dynamicData as ClothingDynamicData;
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
        return this.#bodyArea != undefined ? this.#bodyArea : ClothingArea.NONE;
      }
      get isInnerWear() {
        return this.#bodyArea & ClothingArea.INNER;
      }
      // !SECTION

      // SECTION - Clothing Item Setters
      set bodyArea(val: ClothingArea) {
        if (val) this.#bodyArea = val;
      }
      // !SECTION
    }

    export class Drug extends Item {
      constructor(data?: Partial<Item>) {
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
  }
}
