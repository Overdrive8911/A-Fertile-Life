import type { StoryFlags } from "./scripts/declarations/general_declarations";
import type {
  AreaUniqueId,
  UUID,
} from "./scripts/location/types_and_interfaces";

declare module "twine-sugarcube" {
  export interface SugarCubeSetupObject {
    locationData: LocationObject;
    initPlayerVars: () => void;
    updateTime: () => void;
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date;
    gameTimeDisplay: string;
    gameDateDisplay: string;
    player: Player;
    storyFlags: StoryFlags;
  }
}

export {};
