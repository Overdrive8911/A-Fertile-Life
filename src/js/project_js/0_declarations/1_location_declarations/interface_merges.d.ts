declare module "twine-sugarcube" {
  export interface SugarCubeSetupObject {
    locationData: { [nameOfLocation in MapLocation]?: GameLocation };
    getDistanceToTravelFromLocation: (
      prevPassageTitle: string,
      currPassageTitle: string
    ) => number;
    initializeExtraLocationData: () => void;
  }
}

export {};
