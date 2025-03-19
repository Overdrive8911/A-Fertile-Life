import { ItemTag } from "../../declarations/item_enums";
import type { ItemConstructorArgs } from "../../declarations/types_and_interfaces";
import { Item } from "../item";

export class Drug extends Item {
  constructor(data?: ItemConstructorArgs<Drug>) {
    super(data);
    this.addTags(ItemTag.DRUGS);
  }
}
