// This is just an object that stores at least on Breast. In most cases, the weighted average of all breasts will be used in calculations

import {
  AreolaDescription,
  CupSize,
  Location,
  MilkCapacity,
  NippleDescription,
  type SingleBreast,
} from "./body_stats_declarations";

// ANCHOR - Examples: new Breasts(); new Breasts(<another Breast Class>); new Breasts(null, {interface Single Breast object}) will create a pair of breasts matching the exact template
export class Breasts {
  data: Map<Location, SingleBreast> = new Map();

  constructor(
    classProperties: Breasts | null = null,
    sharedBreastData: SingleBreast | null = null,
    breastsToCreate = 2 // TODO - Let this also accept an array containing the exact breasts to create
  ) {
    // If `classProperties` is given, ignore all other properties and use that
    if (classProperties != null) {
      Object.keys(classProperties).forEach((prop) => {
        //@ts-expect-error
        this[prop] = clone(classProperties[prop]);
      }, this);
    } else {
      // Create the map entries for each possible breast.
      const validBreastLocations = Breasts.getValidBreastLocations();

      validBreastLocations.forEach((location) => {
        // NOTE - Only a max of 3 breasts can exist in one object. For my sanity.
        if (location < breastsToCreate) {
          if (sharedBreastData == null) {
            //ANCHOR - Default breast data
            this.data.set(location, {
              size: CupSize.C - random(20, 25),
              milkCapacity: MilkCapacity.AVERAGE - random(5, 15),
              isLactating: false,
              nipple: NippleDescription.PROTRUDING,
              areola: AreolaDescription.DEFAULT,
            });
          } else {
            this.data.set(location, sharedBreastData);
          }
        }
      });
    }
  }

  clone() {
    return new (this.constructor as typeof Breasts)(this);
  }
  toJSON() {
    const ownData: unknown = {};
    Object.keys(this).forEach((prop) => {
      //@ts-expect-error
      ownData[prop] = clone(this[prop]);
    }, this);

    return Serial.createReviver(
      `new ${(this.constructor as typeof Breasts).name}($ReviveData$)`,
      ownData
    );
  }
  static getValidBreastLocations() {
    // return Object.keys(Location).filter((value) => {
    //   return isNaN(value as unknown as number);
    // }) as unknown as (keyof typeof Location)[];
    return Object.values(Location).filter((value) => {
      return !isNaN(value as unknown as number);
    }) as Location[];
  }

  // NOTE - Use this to also check if a breast exists.
  getSpecificBreastData(location: Location) {
    return this.data.get(location);
  }
}
