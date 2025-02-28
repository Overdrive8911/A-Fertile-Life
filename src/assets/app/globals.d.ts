import type { StoryFlags } from './scripts/declarations/general_declarations'
import type { AreaUniqueId } from './scripts/location/types_and_interfaces'

declare module 'twine-sugarcube' {
  export interface SugarCubeSetupObject {
    locationData: LocationObject
    getDistanceToTravelFromLocation: (
      passageName1: string,
      passageName2: string
    ) => number
    updateGameTimeVariable: (timeInSeconds: number) => void
    skipToNextDayWithSpecificTime: (hours: number, minutes: number) => void
    initializePlayerVariables: () => void
    updateGameDateAndTimeDisplay: () => void
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date
    gameTimeDisplay: string
    gameDateDisplay: string
    player: {
      /**
       * The unique id of the `MapEntity` / `SubLocation` instance that the player is currently in.
       */
      areaId: AreaUniqueId
    }
    storyFlags: StoryFlags
  }
}

export {}
