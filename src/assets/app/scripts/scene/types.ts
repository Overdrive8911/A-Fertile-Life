import type { AreaUUID } from "../location/types_and_interfaces";
import type { SceneEnum } from "./enums";

/**
 * Stores some data about a passage in a scene
 */
export interface Scene {
  passage: string;
  area: AreaUUID;
}

export type SceneState = SceneEnum.STATE_PAUSED | SceneEnum.STATE_CANCELLED;

/**
 * The structure of the data sent in the custom events fro starting and ending scenes
 */
export interface SceneEventData extends Scene {
  state?: SceneState;
}
