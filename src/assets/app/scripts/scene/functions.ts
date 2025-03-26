import { dispatchCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import {
  clearStoryFlag,
  isAnyStoryFlagSet,
  player,
  setStoryFlag,
  StoryFlags,
} from "../declarations/general_declarations";
import type { AreaUUID } from "../location/types_and_interfaces";
import { SceneEnum } from "./enums";
import type { SceneState } from "./types";

/**
 * Sets a variable and some save stuff and dispatches a custom event for stuff to react to.
 */
export function startScene(passageName: string, area?: AreaUUID) {
  if (!isSceneActive()) {
    setStoryFlag(StoryFlags.IS_SCENE_ACTIVE);
  } else {
    throw Error(
      "A scene is currently in progress. As such a new one may not be started."
    );
  }

  dispatchCustomEvent(CustomEventName.SCENE_START, {
    passage: passageName,
    area: area ?? player().areaId,
    state: variables()[SceneEnum.STORY_VARIABLE_NAME]?.state,
  });

  // TODO: Create a variable here to store the progress of a scene
}

export function isSceneActive() {
  return isAnyStoryFlagSet(StoryFlags.IS_SCENE_ACTIVE);
}

export function endScene(option?: SceneState) {
  clearStoryFlag(StoryFlags.IS_SCENE_ACTIVE);

  dispatchCustomEvent(CustomEventName.SCENE_END, {
    passage: passage(),
    area: player().areaId,
    state: option ?? variables()[SceneEnum.STORY_VARIABLE_NAME]?.state,
  });
}
