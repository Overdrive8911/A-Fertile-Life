/** biome-ignore-all lint/complexity/noBannedTypes: <For generics> */

import type { ExtractDataProperties } from "~/types/generics";
import type { BaseItem } from "./class";
import type { ItemId, ItemTag } from "./enums";

type ItemConstructorArgs<TItem extends BaseItem> = Partial<
	Omit<ExtractDataProperties<TItem>, "tags"> & { tags: ItemTag[] }
> & { id: ItemId };

export type { ItemConstructorArgs };
