import type { TimeUpdateEventData } from "../date_and_time/types";
import type {
  Scene,
  SceneEventData,
  SceneProgressEventData,
} from "../scene/types";
import type { CustomEventName } from "./enums";
// NOTE: All custom event definitions should be placed here
export function dispatchCustomEvent(
  eventName: CustomEventName.TIME_UPDATE,
  data: TimeUpdateEventData
): void;
export function dispatchCustomEvent(
  eventName: CustomEventName.SCENE_START,
  data: SceneEventData
): void;
export function dispatchCustomEvent(
  eventName: CustomEventName.SCENE_PROGRESS,
  data: SceneProgressEventData
): void;
export function dispatchCustomEvent(
  eventName: CustomEventName.SCENE_END,
  data: SceneEventData
): void;
export function dispatchCustomEvent(eventName: CustomEventName, data: any) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}

export function listenToCustomEvent(
  eventName: CustomEventName.TIME_UPDATE,
  func: (data: TimeUpdateEventData) => void
): void;
export function listenToCustomEvent(
  eventName: CustomEventName.SCENE_START,
  func: (data: SceneEventData) => void
): void;
export function listenToCustomEvent(
  eventName: CustomEventName.SCENE_PROGRESS,
  func: (data: SceneProgressEventData) => void
): void;
export function listenToCustomEvent(
  eventName: CustomEventName.SCENE_END,
  func: (data: SceneEventData) => void
): void;
export function listenToCustomEvent(
  eventName: CustomEventName,
  func: (data: any) => void
) {
  $(window).on(eventName, (e) => {
    func(e.detail);
  });
}
