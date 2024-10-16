declare module "twine-sugarcube" {
  export interface SugarCubeSetupObject {
    locationData: LocationObject;
    getDistanceToTravelFromLocation: (
      prevPassageTitle: string,
      currPassageTitle: string
    ) => number;
  }
}

declare global {
  // Namespace for every location-related variable or function
  namespace NSLocation {}
}

export {};
