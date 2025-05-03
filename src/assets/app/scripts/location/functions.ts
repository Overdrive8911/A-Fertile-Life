import { player } from "../declarations/general_declarations";
import { SceneEnum } from "../scene/enums";
import { globalMap } from "./game_locations/global_map";
import type { AreaUUID, SubAreas } from "./types_and_interfaces";

function isValidAreaUUID(possibleUUID: string): boolean {
	return typeof globalMap.areaFromUUID(possibleUUID as AreaUUID) != "undefined"
		? true
		: false;
}
/**
 * This doesn't consider if a passage that isn't assigned to an area / not already passed in a scene is given, but that's a user error that'd pretty much only happen in twinescript
 */
export function getAreaUUID(uuidOrPassageName: AreaUUID | string) {
	return isValidAreaUUID(uuidOrPassageName)
		? (uuidOrPassageName as AreaUUID)
		: globalMap.uuidFromPassage(uuidOrPassageName) ?? globalMap.uuid;
}

export function getAreaFromUUID(uuidOrPassageName: AreaUUID | string) {
	return globalMap.areaFromUUID(getAreaUUID(uuidOrPassageName));
}

export function currentArea() {
	return getAreaFromUUID(player().areaId);
}

export function currentAreaConnections() {
	const currArea = currentArea();
	return currArea.parent.childrenData.get(currArea as any)!;
}
