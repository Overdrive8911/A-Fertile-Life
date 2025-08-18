import { Item } from "../class";
import { ItemTag } from "../enums";
import type { ItemConstructorArgs } from "../types";

export class Drug extends Item {
	constructor(data?: ItemConstructorArgs<Drug>) {
		super(data);
		this.addTags(ItemTag.DRUGS);
	}
}
