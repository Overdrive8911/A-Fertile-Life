declare module "twine-sugarcube" {
  export interface SugarCubeSetupObject {
    getDistanceToTravelFromLocation: (
      passageName1: string,
      passageName2: string
    ) => number;
    updateGameTimeVariable: (timeInSeconds: number) => void;
    skipToNextDayWithSpecificTime: (hours: number, minutes: number) => void;
    updateGameDateAndTimeDisplay: () => void;
    initializeLocationDataArray: () => void;
    initializeSaveVariables: () => void;
    // locations: Map;
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date;
    gameTimeDisplay: string;
    gameDateDisplay: string;
    player: Player;
  }
}

export {};
