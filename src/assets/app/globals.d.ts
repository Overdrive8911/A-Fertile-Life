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
    player: any
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date
    gameTimeDisplay: string
    gameDateDisplay: string
    player: any
  }
}

export {}
