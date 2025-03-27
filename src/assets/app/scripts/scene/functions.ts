import { dispatchCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import {
  clearStoryFlag,
  isAnyStoryFlagSet,
  player,
  setStoryFlag,
  StoryFlags,
} from "../declarations/general_declarations";
import { getAreaFromUUID, getAreaUUID } from "../location/functions";
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

/**
 * Ends / Cancels / Pauses the active scene
 *
 * @param option - If passed, can be used to "cancel" or "pause" a scene. The first reverts the game to how it was before the scene started which the latter temporarily postpones a scene.
 * @param passageOrArea - Teleports the player to this area. An `AreaUUID` must be able to be determined from this.
 */
export function endScene(
  option?: SceneState,
  passageOrArea?: string | AreaUUID
) {
  clearStoryFlag(StoryFlags.IS_SCENE_ACTIVE);

  // Warp the user back to a default passage
  Engine.play(
    getAreaFromUUID(getAreaUUID(passageOrArea ?? player().areaId)).passage ??
      variables()[SceneEnum.STORY_VARIABLE_NAME]!.initialArea.passage!
  );

  dispatchCustomEvent(CustomEventName.SCENE_END, {
    passage: passage(),
    area: player().areaId,
    state: option ?? variables()[SceneEnum.STORY_VARIABLE_NAME]?.state,
  });
}
