namespace NSInventoryAndItem {
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

      doesClothCoverBodyPart(bodyPart: ClothingArea) {
        return this.bodyArea != ClothingArea.NONE
          ? bodyPart == (this.bodyArea & bodyPart)
          : false;
      }

      get isInnerWear() {
        return this.bodyArea & ClothingArea.INNER;
      }

      defaultCallback() {
        // TODO - This should add or remove clothing depending on if it is equipped or not
      }
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
