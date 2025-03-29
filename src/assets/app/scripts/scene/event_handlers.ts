import {
  dispatchCustomEvent,
  listenToCustomEvent,
} from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import { currentArea } from "../location/functions";
import { SceneData } from "./classes";
import { SceneEnum } from "./enums";
import { isSceneActive } from "./functions";

listenToCustomEvent(CustomEventName.SCENE_START, (sceneData) => {
  let storedSceneData = variables()[SceneEnum.STORY_VARIABLE_NAME];
  switch (sceneData.state) {
    case SceneEnum.STATE_PAUSED:
      // There's already the data of a scene stored so continue from there
      delete storedSceneData!.state;
      storedSceneData!.initialArea = currentArea();
      Engine.play(storedSceneData!.currentScene.passage);
      break;
    case SceneEnum.STATE_CANCELLED:
    // This shouldn't happen because a cancelled scene would not be stored
    default:
      variables()[SceneEnum.STORY_VARIABLE_NAME] = new SceneData(
        sceneData.passage,
        sceneData.area
      );
  }
});

listenToCustomEvent(CustomEventName.SCENE_END, (sceneData) => {
  switch (sceneData.state) {
    case SceneEnum.STATE_PAUSED:
      // Just "pause" the scene
      const scene = variables()[SceneEnum.STORY_VARIABLE_NAME]!;
      scene.state = SceneEnum.STATE_PAUSED;
      break;
    // This fallthrough is deliberate :3
    //@ts-ignore
    case SceneEnum.STATE_CANCELLED:
      // Revert to the state before this scene began
      const stateVariables = variables();
      const savedStateVariables =
        stateVariables[SceneEnum.STORY_VARIABLE_NAME]!.stateBackup;
      const stateVariableKeys = new Set<keyof typeof stateVariables>(
        Object.keys(stateVariables) as any[]
      );
      const savedStateVariableKeys = new Set<keyof typeof savedStateVariables>(
        Object.keys(savedStateVariables) as any[]
      );
      const unneededStateVariableKeys = stateVariableKeys.difference(
        savedStateVariableKeys
      );
      // Remove all the keys not present in the stored state
      unneededStateVariableKeys.forEach((key) => {
        delete stateVariables[key];
      });
      savedStateVariableKeys.forEach((key) => {
        //@ts-ignore
        stateVariables[key] = savedStateVariables[key];
      });
    // for (const key in savedStateVariables) {
    //   if (Object.prototype.hasOwnProperty.call(stateVariables, key)) {
    //     //@ts-ignore
    //     stateVariables[key] = savedStateVariables[key];
    //   }
    // }
    default:
      delete variables()[SceneEnum.STORY_VARIABLE_NAME];
  }
});

$(window).on(":passageend", () => {
  if (isSceneActive()) {
    // Add the current passage to the scene data
    const sceneData = variables()[SceneEnum.STORY_VARIABLE_NAME]!;
    sceneData.addScene(passage());

    dispatchCustomEvent(CustomEventName.SCENE_PROGRESS, { scene: sceneData });
  }
});
