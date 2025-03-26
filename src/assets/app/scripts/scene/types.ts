import type { AreaUUID } from "../location/types_and_interfaces";

/**
 * Stores some data about a passage in a scene
 */
export interface Scene {
  passage: string;
  area: AreaUUID;
}
