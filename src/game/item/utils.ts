import { ItemTag } from "./enums";

/** Since the tag is a const enum, this is necessary for a string representation */
export function getNameOfItemTag(tag: ItemTag) {
	switch (tag) {
		case ItemTag.ALL:
			return "All";
		case ItemTag.KEY_ITEM:
			return "Key Item";
		case ItemTag.FOOD:
			return "Food";
		case ItemTag.CLOTHING:
			return "Clothing";
		case ItemTag.MISCELLANEOUS:
			return "Miscellaneous";
		case ItemTag.DRUGS:
			return "Drug";
		case ItemTag.TRASH:
			return "Trash";

		default:
			return "Dummy";
	}
}
