import type { GameDateAndTime } from "./scripts/date_and_time/classes";
import type { StoryFlags } from "./scripts/declarations/general_declarations";
import type { Player } from "./scripts/declarations/player_declarations";
import type {
	AreaUniqueId,
	AreaUUID,
} from "./scripts/location/types_and_interfaces";
import type { SceneData } from "./scripts/scene/classes";
import type { SceneEnum } from "./scripts/scene/enums";
import type { Widgets } from "./scripts/ui/widgets/types";

declare module "twine-sugarcube" {
	export interface SugarCubeSetupObject {
		locationData: LocationObject;
		initSaveVars: () => void;
		initPassages: () => void;
		widget: Widgets;
	}

	export interface SugarCubeStoryVariables {
		[SceneEnum.STORY_VARIABLE_NAME]?: SceneData;
		gameDateAndTime: GameDateAndTime;
		player: Player;
		storyFlags: StoryFlags;
	}

	export interface SugarCubeTemporaryVariables {}
}

export {};
