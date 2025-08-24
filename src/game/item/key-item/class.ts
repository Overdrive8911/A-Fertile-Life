import { BaseItem } from "../class";
import { ItemTag } from "../enums";
import type { ItemConstructorArgs } from "../types";

class KeyItem extends BaseItem {
	constructor(arg?: ItemConstructorArgs<KeyItem>) {
		super(arg);

		this.tags.add(ItemTag.KEY_ITEM);
	}
}

export { KeyItem };
