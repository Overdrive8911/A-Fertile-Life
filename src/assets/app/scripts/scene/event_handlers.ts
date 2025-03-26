import { listenToCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";
import { SceneData } from "./classes";
import { SceneEnum } from "./enums";

listenToCustomEvent(CustomEventName.SCENE_START, (scene) => {
  variables()[SceneEnum.STORY_VARIABLE_NAME] = new SceneData(
    scene.passage,
    scene.area
  );
});

listenToCustomEvent(CustomEventName.SCENE_END, (_) => {
  delete variables()[SceneEnum.STORY_VARIABLE_NAME];
});
