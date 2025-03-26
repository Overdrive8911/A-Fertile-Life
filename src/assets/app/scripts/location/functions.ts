import { globalMap } from "./game_locations/global_map";
import type { AreaUUID } from "./types_and_interfaces";

export function getAreaUUID(uuidOrPassageName: AreaUUID | string) {
  return (
    globalMap.uuidFromPassage(uuidOrPassageName) ??
    (uuidOrPassageName as AreaUUID)
  );
}

export function getAreaFromUUID(uuidOrPassageName: AreaUUID | string) {
  return globalMap.areaFromUUID(getAreaUUID(uuidOrPassageName));
}
