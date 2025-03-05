import type { StoryFlags } from './scripts/declarations/general_declarations'
import type {
  AreaUniqueId,
  UUID,
} from './scripts/location/types_and_interfaces'

declare module 'twine-sugarcube' {
  export interface SugarCubeSetupObject {
    locationData: LocationObject
    initPlayerVars: () => void
    updateTime: () => void
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date
    gameTimeDisplay: string
    gameDateDisplay: string
    player: {
      /**
       * The unique id of the `MapEntity` / `SubLocation` instance that the player is currently in.
       */
      areaId: UUID
    }
    storyFlags: StoryFlags
  }
}

export {}
