import type { SugarCubeSetupObject } from "twine-sugarcube";
import type {
  SugarCubeStoryVariables,
  SugarCubeTemporaryVariables,
} from "twine-sugarcube/userdata";

// SECTION - Variable-specific functions
// Constructs all valid paths into a nested object T
type Path<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...Path<T[K]>];
    }[keyof T]
  : [];
function getStoryVar<T, P extends Path<T>>(obj: T, ...path: P) {
  const identifier =
    obj == variables() ? "$" : obj == temporary() ? "_" : "setup.";

  return `${identifier}${path.join(".")}` as const;
}
export function stateFulVar<P extends Path<SugarCubeStoryVariables>>(
  //@ts-ignore
  ...args: P
) {
  //@ts-ignore
  return getStoryVar(variables(), ...args) as `$${string}`;
}
export function tempVar<P extends Path<SugarCubeTemporaryVariables>>(
  ...args: P
) {
  return getStoryVar(temporary(), ...args) as `_${string}`;
}
/** Utility func for counters in passages */
export const tempCounterVar = tempVar("counter") as "_counter";
export function staticVar<P extends Path<SugarCubeSetupObject>>(...args: P) {
  return getStoryVar(setup, ...args) as `setup.${string}`;
}
// Just to reduce repetition :3
export function playerVar<P extends Path<SugarCubeStoryVariables["player"]>>(
  ...args: P
) {
  //@ts-ignore
  return stateFulVar("player", ...args);
}
export function playerWombVar<
  P extends Path<SugarCubeStoryVariables["player"]["womb"]>
>(...args: P) {
  //@ts-ignore
  return playerVar("womb", ...args);
}
export function gameDateAndTimeVar<
  P extends Path<SugarCubeStoryVariables["gameDateAndTime"]>
>(...args: P) {
  //@ts-ignore
  return stateFulVar("gameDateAndTime", ...args);
}

// SECTION - Others
/**
 * Use this on a string that evaluates to a variable so that changes made to the variable show up on the passage :D
 */
export function liveVar(variable: string) {
  return `{{${variable}}}` as const;
}
