import { globalMap } from "../location/game_locations/global_map";
import type { UUID } from "../location/types_and_interfaces";
import type { SugarcubeVariable } from "./types";

export const enum StoryFlags {
  NONE = 0,
  /**
   * Used to determine if a particular story-important scene is active
   */
  IS_SCENE_ACTIVE = 1 << 0,
}

/**
 * NOTE: **This only tests if *all* the bits in the flag match, otherwise it returns false. So be careful with it for flags with multiple set bits. Use `isAnyStoryFlagActive()` instead.**
 */
export function areAllStoryFlagSet(flag: StoryFlags) {
  return (variables().storyFlags & flag) == StoryFlags.NONE ? false : true;
}

/**
 * NOTE: **This only tests if *any* the bits in the flag match, otherwise it returns false.**
 */
export function isAnyStoryFlagSet(flags: StoryFlags) {
  return variables().storyFlags & flags ? true : false;
}

export function setStoryFlag(flag: StoryFlags) {
  variables().storyFlags |= flag;
}

export function clearStoryFlag(flag: StoryFlags) {
  variables().storyFlags &= ~flag;
}

export function toggleStoryFlag(flag: StoryFlags) {
  variables().storyFlags ^= flag;
}

// SECTION: Location specific helper functions
export function activeArea() {
  return globalMap.activeArea;
}

export function getAreaFromUUID(uuid: UUID) {
  return globalMap.areaFromUUID(uuid);
}

export const getRandomNumberFromRangeInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
export const getWeightedAverage = (...input: number[]) => {
  // Get the total sum
  let sum = 0;
  input.forEach((number) => {
    sum += number;
  });

  // Use the sum to produce ratios and multiply each ratio by 100
  const weights = input.map((number) => {
    return (number / sum) * 100;
  });

  // Multiply each initial number and their weight, then obtain their sum
  let sumOfWeightedValues = 0;
  input.forEach((number, index) => {
    sumOfWeightedValues += number * weights[index];
  });

  // Divided the sum of weighted values by 100 and return the answer
  return sumOfWeightedValues / 100;
};

export function isEditableElementSelected(e: any | Event) {
  // Note that "e" must be an event
  if (
    e.target instanceof HTMLElement &&
    (["INPUT", "TEXTAREA"].includes(e.target.nodeName) ||
      e.target.attributes.hasOwnProperty("contenteditable"))
  ) {
    return true;
  }
  return false;
}

export const getSugarCubeVariableValue = (varName: SugarcubeVariable) => {
  return State.getVar(varName) as unknown;
};

/** Only needed for stateful custom classes */
export const attachClassToWindow = (classConstructor: Function) => {
  (window as any)[classConstructor.name] = classConstructor;
};
