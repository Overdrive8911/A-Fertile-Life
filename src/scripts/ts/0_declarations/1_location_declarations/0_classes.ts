namespace NSLocation {
  // NOTE: Do not use this class directly. Use it's child classes instead.
  // A `map object` serves as a collection of different locations / sub-locations / areas.
  // TODO: Consider preventing in-explicitly set distances from having a value
  export class MapChildData<IdType> {
    constructor(
      private locData: GenericLocationData<IdType>,
      public directions?: DefaultDirectionData,
      public flags?: MapChildDataFlags
    ) {}

    get data(): GenericLocationData<IdType> {
      return { id: this.id, name: this.name, description: this.description };
    }
    get id() {
      return this.locData.id;
    }
    get name() {
      return this.locData.name ?? "NO NAME AVAILABLE";
    }
    get description() {
      return this.locData.description ?? "NO DESCRIPTION AVAILABLE";
    }
    isFlagSet?(flag: MapChildDataFlags) {
      return this.flags & flag;
    }
  }

  const defaultDistance = 1;
  class MapObject {
    // TODO: Replace these with a map
    //@ts-expect-error
    private map: Record<AreaId, DefaultMapChildData> = {};
    // Used to determine the distance between 2 or more areas in the map

    private _coordinateMap: Map<AreaId, Coords> = new Map();

    constructor(public baseData?: DefaultGenericLocationData) {}

    getArea(id: AreaId) {
      if (!this.map[id]) {
        console.error(
          `No data with the id, ${id}, exists in the map, ${this.baseData?.name}, with the id, ${this.baseData?.id}`
        );
      }
      return this.map[id];
    }
    private returnUpdatedCoordinates(
      direction: keyof DefaultDirectionDataPlus,
      distance: number,
      coordsToBaseOff: Coords
    ): Coords {
      let coord_X = 0,
        coord_Y = 0,
        coord_Z = 0;

      // Depending on the direction, set the data in the `coord_*` variables
      switch (direction) {
        case "north":
          coord_Y = distance;
        case "east":
          coord_X = distance;
        case "south":
          coord_Y = -distance;
        case "west":
          coord_X = -distance;
        // TODO
        // case "up":
        //   coord_Z = distance;
        // case "down":
        //   coord_Z = -distance;
      }

      // Now get return new coordinates
      return {
        x: coordsToBaseOff.x + coord_X,
        y: coordsToBaseOff.y + coord_Y /*, z:coordsToBaseOff.z + coord_Z*/,
      };
    }
    private getCounterpartDirection(
      direction: keyof DefaultDirectionDataPlus
    ): keyof DefaultDirectionDataPlus {
      switch (direction) {
        case "north":
          return "south";
        case "up":
          return "down";
        case "down":
          return "up";
        case "east":
          return "west";
        case "south":
          return "north";
        case "west":
          return "east";
      }
    }
    protected addArea(
      locData: DefaultGenericLocationData,
      directionData?: CardinalDirAndDistanceType<DefaultGenericLocationData>
      // REVIEW: Explain this
      // coordsData?: { coordsToBaseOff: Coords, dirDataFromAreaToLinkWith:{dir: keyof DefaultDirectionData, distance:number}}
      // coordsToBaseOff?:Coords
    ) {
      const id = locData.id;

      // Initialize the child object to add to the map.
      let mapChild: DefaultMapChildData =
        this.getArea(id) ?? new MapChildData(locData);

      if (directionData) {
        // Default to (0,0,0) if this is the first area in the map
        if (!Object.keys(this.map).length)
          this._coordinateMap.set(id, { x: 0, y: 0, z: 0 });

        mapChild.directions = mapChild.directions ?? {};

        let hasFoundFirstEligibleDir = false;
        // Loop through each given direction
        for (const key in directionData) {
          if (Object.prototype.hasOwnProperty.call(directionData, key)) {
            const direction = directionData[key as keyof typeof directionData];
            const dirBaseLocData = direction.area;
            const dirId = dirBaseLocData.id;
            const dirDist = direction.distance ?? defaultDistance;
            const dirData = this.getArea(dirId);
            const counterpartDirection = this.getCounterpartDirection(
              key as keyof typeof directionData
            );

            // Look for the first direction to an area that has a coordinateMap
            const eligibleDirData = this._coordinateMap.get(dirId);
            console.log(eligibleDirData);
            console.log(key);
            console.log(dirId);
            if (
              eligibleDirData &&
              !hasFoundFirstEligibleDir &&
              Object.keys(this._coordinateMap).length > 1
            ) {
              this._coordinateMap.set(
                dirId,
                this.returnUpdatedCoordinates(
                  key as keyof typeof directionData,
                  dirDist,
                  eligibleDirData
                )
              );
              hasFoundFirstEligibleDir = true;
            }

            // No data is available so init a new map child with the required data
            if (!dirData) {
              // // Default to the counterpart for north
              // let a = {
              //   south: {
              //     area: mapChild,
              //     distance: dirDist ?? defaultDistance,
              //   },
              // } as DefaultDirectionDataPlus;
              // switch (key as keyof typeof directionData) {
              //   case "east":
              //     a = {
              //       west: {
              //         area: mapChild,
              //         distance: dirDist ?? defaultDistance,
              //       },
              //     };
              //   case "south":
              //     a = {
              //       north: {
              //         area: mapChild,
              //         distance: dirDist ?? defaultDistance,
              //       },
              //     };
              //   case "west":
              //     a = {
              //       east: {
              //         area: mapChild,
              //         distance: dirDist ?? defaultDistance,
              //       },
              //     };
              // }

              this.map[dirId] = new MapChildData(dirBaseLocData, {
                [`${counterpartDirection}`]: {
                  area: mapChild,
                  distance: dirDist ?? defaultDistance,
                },
              });
            } else {
              // The map child exists so just add the required direction
              dirData.directions = dirData.directions ?? {};
              //@ts-expect-error
              dirData.directions[`${counterpartDirection}`] = {
                area: mapChild,
                distance:
                  dirDist ??
                  //@ts-expect-error
                  dirData.directions[`${counterpartDirection}`]?.distance ??
                  defaultDistance,
              };
            }

            mapChild.directions[key as keyof typeof directionData] = {
              area: this.map[dirId],
              distance: dirDist ?? defaultDistance,
            };

            // Now give them the connections their coords if they don't have them.
            if (!this.coordinateMap1.get(dirId)) {
              // const coordsToAdd = this.returnUpdatedCoordinates(
              //   key as keyof typeof directionData,
              //   dirDist,
              //   this.coordinateMap1.get(id)
              // );

              this._coordinateMap.set(
                dirId,
                this.returnUpdatedCoordinates(
                  key as keyof typeof directionData,
                  dirDist,
                  this.coordinateMap1.get(id)
                )
              );
            }
          }
        }

        // // TODO: Shorten this
        // // For every possible direction, initialize (if necessary) a new "map child"
        // if (directionData.north) {
        //   const northBaseLocData = directionData.north.area;
        //   const northId = northBaseLocData.id;
        //   const northDist = directionData.north.distance;
        //   const northData = this.getArea(northId);

        //   // No data is available so init a new map child with the required data
        //   if (!northData) {
        //     this.map[northId] = new MapChildData(northBaseLocData, {
        //       south: { area: mapChild, distance: northDist ?? defaultDistance },
        //     });
        //   } else {
        //     // The map child exists so just add the required direction
        //     northData.directions = northData.directions ?? {};
        //     northData.directions.south = {
        //       area: mapChild,
        //       distance:
        //         northDist ??
        //         northData.directions.south?.distance ??
        //         defaultDistance,
        //     };
        //   }

        //   mapChild.directions.north = {
        //     area: this.map[northId],
        //     distance: northDist ?? defaultDistance,
        //   };
        // }
        // if (directionData.east) {
        //   const eastBaseLocData = directionData.east.area;
        //   const eastId = eastBaseLocData.id;
        //   const eastDist = directionData.east.distance;
        //   const eastData = this.getArea(eastId);

        //   // No data is available so init a new map child with the required data
        //   if (!eastData) {
        //     this.map[eastId] = new MapChildData(eastBaseLocData, {
        //       west: { area: mapChild, distance: eastDist ?? defaultDistance },
        //     });
        //   } else {
        //     // The map child exists so just add the required direction
        //     eastData.directions = eastData.directions ?? {};
        //     eastData.directions.west = {
        //       area: mapChild,
        //       distance:
        //         eastDist ??
        //         eastData.directions.west?.distance ??
        //         defaultDistance,
        //     };
        //   }

        //   mapChild.directions.east = {
        //     area: this.map[eastId],
        //     distance: eastDist ?? defaultDistance,
        //   };
        // }
        // if (directionData.south) {
        //   const southBaseLocData = directionData.south.area;
        //   const southId = southBaseLocData.id;
        //   const southDist = directionData.south.distance;
        //   const southData = this.getArea(southId);

        //   // No data is available so init a new map child with the required data
        //   if (!southData) {
        //     this.map[southId] = new MapChildData(southBaseLocData, {
        //       north: { area: mapChild, distance: southDist ?? defaultDistance },
        //     });
        //   } else {
        //     // The map child exists so just add the required direction
        //     southData.directions = southData.directions ?? {};
        //     southData.directions.north = {
        //       area: mapChild,
        //       distance:
        //         southDist ??
        //         southData.directions.north?.distance ??
        //         defaultDistance,
        //     };
        //   }

        //   mapChild.directions.south = {
        //     area: this.map[southId],
        //     distance: southDist ?? defaultDistance,
        //   };
        // }
        // if (directionData.west) {
        //   const westBaseLocData = directionData.west.area;
        //   const westId = westBaseLocData.id;
        //   const westDist = directionData.west.distance;
        //   const westData = this.getArea(westId);

        //   // No data is available so init a new map child with the required data
        //   if (!westData) {
        //     this.map[westId] = new MapChildData(westBaseLocData, {
        //       east: { area: mapChild, distance: westDist ?? defaultDistance },
        //     });
        //   } else {
        //     // The map child exists so just add the required direction
        //     westData.directions = westData.directions ?? {};
        //     westData.directions.east = {
        //       area: mapChild,
        //       distance:
        //         westDist ??
        //         westData.directions.east?.distance ??
        //         defaultDistance,
        //     };
        //   }

        //   mapChild.directions.west = {
        //     area: this.map[westId],
        //     distance: westDist ?? defaultDistance,
        //   };
        // }
      }

      // Add the mapChild to the map
      this.map[locData.id] = mapChild;
    }
    protected removeArea(id: AreaId) {
      if (this.getArea(id)) {
        // The map child exists so we can delete
        delete this.map[id];
      } else {
        console.warn("There is nothing matching the id that can be deleted.");
      }
    }

    getAreasWithFlag(flag: MapChildDataFlags) {
      let entryAreas: DefaultMapChildData[] = [];

      for (const key in this.map) {
        if (Object.prototype.hasOwnProperty.call(this.map, key)) {
          const area = this.map[key as unknown as keyof typeof this.map];

          if (area.flags & flag) {
            entryAreas.push(area);
          }
        }
      }

      return entryAreas;
    }

    protected get coordinateMap1() {
      return this._coordinateMap;
    }

    // protected getConnectedAreaData(id: AreaId): {
    //   // The ID of a connected area
    //   id: AreaId;
    //   // The direction to follow to find the connected area
    //   direction: keyof DefaultDirectionData | keyof DefaultDirectionDataPlus;
    //   // The actual distance between the connected area and the current area
    //   distance: number;
    // }[] {
    //   const area = this.getArea(id);
    //   const availableDirections = Object.keys(
    //     area.directions
    //   ) as (keyof typeof area.directions)[];

    //   return availableDirections.map((cardinalDirection) => {
    //     return {
    //       direction: cardinalDirection,
    //       id: area.directions[cardinalDirection].area.id,
    //       distance:
    //         area.directions[cardinalDirection].distance /* ?? defaultDistance*/,
    //     };
    //   });
    // }

    // // NOTE: This may be computationally expensive to call. It should ONLY be used when required and no other feasible alternatives exist (e.g warping to areas not directly connected to each other)
    // // Returns an object that containing 2/3 key objects representing x-y/x-y-z coordinates. Each coordinate array is indexed with the appropriate id
    // get coordinateMap() {
    //   const obj: Partial<Record<AreaId, Coords>> = {};
    //   const mapChildKeys = Object.keys(this.map).map((val) =>
    //     parseInt(val)
    //   ) as AreaId[];

    //   // ANCHOR: Now, we pick the first id in the map and search each available direction for more areas. Then we calculate their coordinates and add them to the aforementioned object.
    //   const firstMapChildId = mapChildKeys[0];
    //   // const firstMapChildArea = this.getArea(firstMapChildId);
    //   // Assume the first area's coordinates to be 0,0,0 and base every other area off this.
    //   obj[firstMapChildId] = { x: 0, y: 0, z: 0 };

    //   // ANCHOR: Search all available directions of the first areas

    //   type ExtractElementTypeFromArray<T> = T extends (infer R)[] ? R : never;
    //   // These two are utility function to prevent repeating myself
    //   const addAreaData = (
    //     val: ExtractElementTypeFromArray<
    //       ReturnType<typeof this.getConnectedAreaData>
    //     >
    //   ) => {
    //     let coord_X = 0,
    //       coord_Y = 0,
    //       coord_Z = 0;

    //     // Depending on the direction, set the data in the `coord_*` variables
    //     switch (val.direction) {
    //       case "north":
    //         coord_Y = val.distance;
    //       case "east":
    //         coord_X = val.distance;
    //       case "south":
    //         coord_Y = -val.distance;
    //       case "west":
    //         coord_X = -val.distance;
    //       case "up":
    //         coord_Z = val.distance;
    //       case "down":
    //         coord_Z = -val.distance;
    //     }

    //     obj[val.id] = { x: coord_X, y: coord_Y, z: coord_Z };
    //   };
    //   // TODO: Improve on this later
    //   // REVIEW: Ensure that this doesn't loop infinitely
    //   const addAreaDataRecursively = (startingAreaId: AreaId) => {
    //     this.getConnectedAreaData(startingAreaId).forEach((val) => {
    //       // To prevent infinite recursion
    //       if (val.id != startingAreaId) {
    //         // Add the appropriate data for the current iterated area
    //         addAreaData(val);
    //         console.log(obj);

    //         // Do the same for any connected areas of the current iteration's area
    //         addAreaDataRecursively(val.id);
    //       }
    //     });
    //   };

    //   // ANCHOR: This is where it all happens :D
    //   addAreaDataRecursively(firstMapChildId);

    //   return obj;
    // }
  }

  // ANCHOR: This only stores map objects for sub locations. Each Instance of this is effectively a "Location"
  export class MapObjectOfSubLocations extends MapObject {
    constructor(
      public baseData?: GenericLocationData<MapLocation>
    ) /*public directions?: CardinalDirAndDistanceTypePlus<MapObject>*/ {
      super(baseData /*,directions*/);
    }

    addSubLocation(
      subLocationData: GenericLocationData<MapSubLocation>,
      directionData?: CardinalDirAndDistanceType<
        GenericLocationData<MapSubLocation>
      >
    ) {
      this.addArea(subLocationData, directionData);
    }
    removeSubLocation(subLocationId: MapSubLocation) {
      this.removeArea(subLocationId);
    }
  }

  // // ANCHOR: This only stores references to `SubLocationMapObject` instances.
  // // NOTE: Basically if you have a hospital, each room on a floor would be a `subLocation`(which is the smallest place that the player can enter), each floor would be a `location`(which solely consists of `subLocation`s), and the entire hospital would be a collection of `locations`
  // NOTE: A Location may have extra coordinates like `up` and `down`. A subLocation, however, CANNOT
  // ANCHOR: This is the structure of the `Global Map`
  export class MapObjectOfLocations extends MapObject {
    constructor(...args: ConstructorParameters<typeof MapObject>) {
      super(...args);
    }
    addLocation() {}
  }

  //@ts-expect-error
  window.t = NSLocation;
}
