import type { Brand } from "~/types/generics";

/** So we don't mix up regular numbers */
export type FoodEffect = Brand<number, "foodEffect">;
