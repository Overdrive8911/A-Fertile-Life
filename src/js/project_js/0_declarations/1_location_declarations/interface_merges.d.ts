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

declare global {
  // Namespace for every location-related variable or function
  namespace NSLocation {}
}

export {};
