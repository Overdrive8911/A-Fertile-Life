/** biome-ignore-all lint/complexity/noBannedTypes: <For generics> */

import type { ExtractDataProperties } from "~/types/generics";
import type { PlayerV0_0_1 } from "../types/story-variables/player";
import type { BaseItem } from "./class";
import type { ItemTag } from "./enums";

type ItemConstructorArgs<TItem extends BaseItem> = Partial<
	Omit<ExtractDataProperties<TItem>, "tags"> & { tags: ItemTag[] }
>;

type InvertedEffect<TEffectType extends number> = {
	effect: TEffectType;
	invert: true;
};

type CustomEffect = (user: PlayerV0_0_1) => void;

/** Either an effect that should occur when the item is used, an object containing the effect and a flag that should invert it, or a custom callback */
type ItemEffect<TEffectType extends number> =
	| TEffectType
	| InvertedEffect<TEffectType>
	| CustomEffect;

export type {
	ItemConstructorArgs,
	ItemEffect as GenericItemEffect,
	InvertedEffect as GenericInvertedItemEffect,
};
