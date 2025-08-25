import type { JSX } from "solid-js/jsx-runtime";
import {
	PassagePrologueHomeEvent,
	PassagePrologueHomeEventBathroom,
} from "./1-home-event";
import { PassagePrologueName } from "./enums";

export const PassagePrologueCollection = [
	{
		name: PassagePrologueName.PROLOGUE_BEGINNING,
		passage: PassagePrologueHomeEvent,
	},
	{
		name: PassagePrologueName.PROLOGUE_WAKE_UP_AND_BRUSH_TEETH,
		passage: PassagePrologueHomeEventBathroom,
	},
] as const satisfies { name: string; passage: () => JSX.Element }[];
