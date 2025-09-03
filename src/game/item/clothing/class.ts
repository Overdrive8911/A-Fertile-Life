import type { PositiveStatusEffect } from "~/game/shared/enums";
import { EquippableItem } from "../class";
import { ItemTag } from "../enums";
import type { ItemConstructorArgs } from "../types";

class Clothing extends EquippableItem<PositiveStatusEffect> {
	constructor(data: ItemConstructorArgs<Clothing>) {
		super(data);

		this.tags.add(ItemTag.CLOTHING);
	}
}

export { Clothing };
