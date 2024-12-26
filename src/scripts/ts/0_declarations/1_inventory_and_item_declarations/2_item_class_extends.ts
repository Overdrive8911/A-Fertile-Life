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
