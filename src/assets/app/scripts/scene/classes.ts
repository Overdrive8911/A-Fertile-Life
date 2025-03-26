import {
  attachClassToWindow,
  player,
} from "../declarations/general_declarations";
import type { UUID } from "../location/types_and_interfaces";
import type { Scene } from "./types";

/**
 * Meant to keep track of the progress and other data about a scene in progress
 */
export class SceneData {
  /**
   * This will always have at least **one** element
   */
  scenes: Scene[] = [];

  constructor(passageName: string, area?: UUID) {
    this.scenes.push({ passage: passageName, area: area ?? player().areaId });
  }

  get initialScene() {
    return this.scenes[0];
  }
  get currentScene() {
    return this.scenes[this.scenes.length - 1];
  }
  get lastScene() {
    return this.scenes[this.scenes.length - 2];
  }
}

attachClassToWindow(SceneData);
