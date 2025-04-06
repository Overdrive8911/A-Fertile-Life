import type { SugarCubeStoryVariables } from "twine-sugarcube";
import {
  attachClassToWindow,
  player,
} from "../declarations/general_declarations";
import { currentArea } from "../location/functions";
import type { AreaUUID } from "../location/types_and_interfaces";
import type { Scene } from "./types";
import { SceneEnum } from "./enums";

/**
 * Meant to keep track of the progress and other data about a scene in progress.
 *
 * NOTE: Only one instance of this should exist at any time (for now)
 */
export class SceneData {
  /**
   * This will always have at least **one** element
   */
  scenes: Scene[] = [];
  /**
   * The area uuid of the last area the player was in before this class was instantiated
   */
  initialArea = currentArea().uuid;

  /**
   * Useful to know whether a current scene is paused
   */
  state?: SceneEnum.STATE_PAUSED;

  /**
   * A backup of all other story variables as at the time of this class's instantiation
   */
  stateBackup: Omit<SugarCubeStoryVariables, SceneEnum.STORY_VARIABLE_NAME> =
    {} as any;

  constructor(passageName: string, area?: AreaUUID);
  constructor(classOrClassLikeObject: SceneData);
  constructor(passageNameOrClassLike: string | SceneData, area?: AreaUUID) {
    if (typeof passageNameOrClassLike == "string") {
      this.addScene(passageNameOrClassLike, area);
      const stateVariables = variables();

      // Copy over the current state of the variables
      Object.keys(stateVariables).forEach((prop) => {
        if (prop != SceneEnum.STORY_VARIABLE_NAME)
          //@ts-expect-error
          this.stateBackup[prop] = clone(stateVariables[prop]);
      }, this);
    } else {
      Object.keys(passageNameOrClassLike).forEach((prop) => {
        //@ts-expect-error
        this[prop] = clone(passageNameOrClassLike[prop]);
      }, this);
    }
  }

  clone() {
    return new SceneData(this);
  }
  toJSON() {
    var ownData = {};
    Object.keys(this).forEach((prop) => {
      //@ts-ignore
      ownData[prop] = clone(this[prop]);
    });
    return Serial.createReviver(`new ${SceneData.name}($ReviveData$)`, ownData);
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

  /**
   * Gets the scene (if any) that has the same passage name with the given argument
   */
  scene(passageName: string) {
    return this.scenes.find((scene) => scene.passage == passageName);
  }

  addScene(passageName: string, area = player().areaId) {
    // This isn't a mistake and I don't really wanna change the type rn
    if (this.currentScene?.passage != passageName)
      this.scenes.push({ passage: passageName, area: area });
  }
}

attachClassToWindow(SceneData);
