import type { JSX } from "solid-js/jsx-runtime";
import {
	PassagePrologueHomeEvent,
	PassagePrologueHomeEventBathroom,
} from "./1-home-event";
import { PassagePrologueDressedAndEnteringBus } from "./2-bus-event";

export const PassagePrologueCollection = [
	PassagePrologueHomeEvent,
	PassagePrologueHomeEventBathroom,
	PassagePrologueDressedAndEnteringBus,
] as const satisfies { name: string; passage: () => JSX.Element }[];
