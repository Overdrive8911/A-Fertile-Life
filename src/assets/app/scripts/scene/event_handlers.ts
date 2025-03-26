import { listenToCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import { SceneData } from "./classes";
import { SceneEnum } from "./enums";

listenToCustomEvent(CustomEventName.SCENE_START, (sceneData) => {
  variables()[SceneEnum.STORY_VARIABLE_NAME] = new SceneData(
    sceneData.passage,
    sceneData.area
  );
});

listenToCustomEvent(CustomEventName.SCENE_END, (sceneData) => {
  delete variables()[SceneEnum.STORY_VARIABLE_NAME];
});
