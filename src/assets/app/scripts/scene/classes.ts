import {
  attachClassToWindow,
  player,
} from "../declarations/general_declarations";
import type { AreaUUID } from "../location/types_and_interfaces";
import type { Scene } from "./types";

/**
 * Meant to keep track of the progress and other data about a scene in progress
 */
export class SceneData {
  /**
   * This will always have at least **one** element
   */
  scenes: Scene[] = [];

  constructor(passageName: string, area?: AreaUUID) {
    this.scenes.push({ passage: passageName, area: area ?? player().areaId });
  }

  /**
   * Retrieves the first scene in the scenes array, representing the initial scene.
   */
  get initialScene() {
    return this.scenes[0];
  }
  /**
   * Retrieves the scene that is currently active or in progress.
   */
  get currentScene() {
    return this.scenes[this.scenes.length - 1];
  }
  /**
   * Retrieves the second-to-last scene in the scenes array, if it exists.
   *
   * Returns `null` if there is only one or no scene in the array.
   */
  get lastScene() {
    return this.scenes.length > 1 ? this.scenes[this.scenes.length - 2] : null;
  }
}

attachClassToWindow(SceneData);
