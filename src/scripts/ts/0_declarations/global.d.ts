declare module "twine-sugarcube" {
  export interface SugarCubeSetupObject {
    getDistanceToTravelFromLocation: (
      passageName1: string,
      passageName2: string
    ) => number;
    updateGameTimeVariable: (timeInSeconds: number) => void;
    skipToNextDayWithSpecificTime: (hours: number, minutes: number) => void;
    initializeSaveVariables: () => void;
  }

  export interface SugarCubeStoryVariables {
    gameDateAndTime: Date;
    lastPregUpdateFunctionCall: Date;
    player: Player;
  }
}

export {};
