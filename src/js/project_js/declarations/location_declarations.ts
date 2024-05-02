// const invalidLocation: number = -999;
// const invalidSubLocation: number = invalidLocation;
const distanceToMetresConversionRange: [min: number, max: number] = [
  0.85, 1.15,
];

// // This checks whether a location exists and returns its array index location else returns -999
// const getLocationDataIndex = (locationName: string) => {
//   // Create setup.locations if it doesn't exist. Although this would never really happen, just to appease the typescript gods
//   if (setup.locations === undefined) {
//     setup.locations = new Map();
//   }

//   for (let i = 0; i < setup.locations?.size; i++) {
//     const location = setup.locations[i];

//     if (location.name === locationName) {
//       // console.log(`index and element: ${i} and ${location.name}`);
//       // The location exists so exit this function
//       return i;
//     }
//   }

//   for (const keyAndValue of setup.locations) {
//     const locationKey = keyAndValue[0];
//     const locationData = keyAndValue[1];

//     if (locationData.name === locationName) {
//       // console.log(`index and element: ${i} and ${location.name}`);
//       // The location exists so exit this function
//       return i;
//     }
//   }

//   return invalidLocation;
// };

// const getSubLocationDataIndex = (
//   subLocationName: string,
//   locationName: string
// ) => {
//   let locationId = getLocationDataIndex(locationName);

//   // Create setup.locations and the subLocations if it doesn't exist. Although this would never really happen, just to appease the typescript gods
//   if (setup.locations === undefined) {
//     setup.locations = [];
//   }
//   if (setup.locations[locationId].subLocations === undefined) {
//     setup.locations[locationId].subLocations = [];
//   }

//   if (locationId != invalidLocation) {
//     // location exists
//     for (
//       let i = 0;
//       i < setup.locations[locationId]?.subLocations?.length;
//       i++
//     ) {
//       const subLocation = setup.locations[locationId]?.subLocations[i];

//       if (subLocation.name === subLocationName) {
//         return i;
//       }
//     }
//   }

//   return invalidSubLocation;
// };
