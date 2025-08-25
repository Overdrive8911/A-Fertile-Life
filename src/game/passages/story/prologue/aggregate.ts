import type { JSX } from "solid-js/jsx-runtime";
import { PassagePrologueHomeEvent } from "./1-home-event";
import { PassagePrologueName } from "./enums";

export const PassagePrologueCollection = [
	{
		name: PassagePrologueName.PROLOGUE_BEGINNING,
		passage: PassagePrologueHomeEvent,
	},
] as const satisfies { name: string; passage: () => JSX.Element }[];
