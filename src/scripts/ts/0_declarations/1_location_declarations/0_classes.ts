namespace NSLocation {
  const oppositeDirection = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.WEST]: Direction.EAST,
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
  };
  type MapChildConnectionDataType = Map<{ from: AreaId; to: AreaId }, number>;
  type MapDataInSessionStorage = Partial<
    Record<`mapChildConnections_${AreaUniqueId}`, MapChildConnectionDataType>
  >;

  // Base Generic Class Implementation that will be extended for use
  // NOTE: Most methods return a reference to the map entity for use in chaining
  // ANCHOR: There are 5 types of areas; Sub-Locations, Locations, Sub-Regions, Regions, and the Global Map
  /** Sub-Location -> A room in a house,
   * Location -> The house itself,
   * Sub-Region -> The neighbourhood or even a city,
   * Regions -> A standalone zone / region of sub regions,
   * Global Map -> Just to store everything :3,
   */
  class MapEntity<
    ChildType extends MapEntity<any, any, any>,
    IdType extends AreaId,
    ParentType extends MapEntity<any, any, any>
  > {
    // The `MapEntity` instance that contains this instance
    parent: ParentType | null = null;
    // All the `MapEntity` instances that are contained within this instance. Like a House containing rooms
    protected children: Map<AreaId, ChildType> | null = null;
    // The connections to other `MapEntity` instances in the same direction. Like a room connecting to another room
    private connections: Map<
      Direction,
      {
        area: MapEntity<ChildType, IdType, ParentType>;
        distance?: number | null;
      }
    > = new Map();
    type = MapType.GENERIC;
    // NOTE: This will be cleared when the player moves to another area (not a child area)
    private mapChildConnectionData: MapChildConnectionDataType | undefined;

    constructor(
      public readonly id: IdType,
      public readonly name: string,
      public readonly description?: string,
      public readonly flags = MapEntityFlags.NONE
    ) {}

    /**
     * A unique id is used to find out the exact instance of a map entity in the global map.
     * NOTE: THIS MUST BE IMPLEMENTED BY ALL CHILD INSTANCES
     *
     * @readonly
     * @type {AreaUniqueId}
     */
    get uniqueId(): AreaUniqueId {
      let globalId = GlobalMapId.GLOBAL,
        regionId = RegionId.DUMMY,
        subRegionId = SubRegionId.DUMMY,
        locationId = LocationId.DUMMY,
        subLocationId = SubLocationId.DUMMY;

      // if (this instanceof SubLocation) {
      //   subLocationId = this.id;
      //   locationId = this?.parent?.id ?? LocationId.DUMMY;
      //   subRegionId = this?.parent?.parent?.id ?? SubRegionId.DUMMY;
      //   regionId = this?.parent?.parent?.parent?.id ?? RegionId.DUMMY;
      // } else if (this instanceof Location) {
      //   locationId = this.id;
      //   subRegionId = this?.parent?.id ?? SubRegionId.DUMMY;
      //   regionId = this?.parent?.parent?.id ?? RegionId.DUMMY;
      // } else if (this instanceof SubRegion) {
      //   subRegionId = this.id;
      //   regionId = this?.parent?.id ?? RegionId.DUMMY;
      // } else if (this instanceof Region) {
      //   regionId = this.id;
      // }

      return `${globalId}_${regionId}_${subRegionId}_${locationId}_${subLocationId}`;
    }

    // NOTE: Check for the first entry area, else the first element in the `children` map is the origin area and will always have the coords of {x:0,y:0,z:0}
    private get originArea() {
      if (!this.children?.size) return null;
      let returnArea = null,
        firstArea = null;
      let hasSetFirstArea = false;
      for (const [, data] of this.children) {
        if (!hasSetFirstArea) {
          firstArea = data;
          hasSetFirstArea = true;
        }

        if (data.flags & MapEntityFlags.IS_ENTRY_POINT) {
          returnArea = data;
          break;
        }
        break;
      }
      return returnArea ?? firstArea;
    }
    addArea(...areas: ChildType[]): MapEntity<ChildType, IdType, ParentType> {
      if (!this.children) this.children = new Map();

      areas.forEach((area) => {
        if (this.children.has(area.id)) {
          console.error(
            `${area.name} already exists as a child of ${this.name}.\n\n OVERWRITING DATA ANYWAY.`
          );
        }

        area.parent = this;
        this.children.set(area.id, area);
      });

      return this;
    }

    removeArea(
      ...area: (ChildType | AreaId)[]
    ): MapEntity<ChildType, IdType, ParentType> {
      area.forEach((val) => {
        const idToRemove = typeof val == "number" ? val : val.id;

        if (!this.children.delete(idToRemove)) {
          console.warn(
            `There was no child data in the map entity, ${this.name}, with the id, ${idToRemove}`
          );
        }
      });

      return this;
    }

    getArea(areaId: AreaId): ChildType | null {
      return this.children?.get(areaId) ?? null;
    }

    // NOTE: This only works once and then silently does nothing if the area is already connected in that particular direction
    connectTo(
      ...data: {
        area: MapEntity<ChildType, IdType, ParentType>;
        dir: Direction;
        dist?: number;
      }[]
    ): MapEntity<ChildType, IdType, ParentType> {
      data.forEach((val) => {
        // Check if the connection doesn't exist already
        if (
          !this.connections.has(val.dir) &&
          !val.area.connections.has(oppositeDirection[val.dir])
        ) {
          const dist = val.dist ?? null;
          // Set the connection for this map entity
          this.connections.set(val.dir, { area: val.area, distance: dist });

          // Also set the connection on the other map entity for bi-directional travel
          val.area.connections.set(oppositeDirection[val.dir], {
            area: this,
            distance: dist,
          });
        }
      });

      return this;
    }

    /**
     *
     * @param childArea1 If this is an `AreaId`, ensure that it corresponds to that of the `ChildType`
     * @param childArea2 If this is an `AreaId`, ensure that it corresponds to that of the `ChildType`
     * @returns
     */
    async getDistance(
      childArea1: ChildType | ChildType["id"],
      childArea2: ChildType | ChildType["id"]
    ) {
      const childConnectionData = await this.getMapChildConnectionData();
      const id1: number = !(childArea1 instanceof MapEntity)
        ? childArea1
        : childArea1.id;
      const id2: number = !(childArea2 instanceof MapEntity)
        ? childArea2
        : childArea2.id;
      let dist = 10; // Just a silly default

      for (const [idPair, distance] of childConnectionData) {
        if (Object.values(idPair).includesAll(id1, id2)) {
          dist = distance;
          break;
        }
      }

      return dist;
    }

    /**
     *
     * @param forceGenerate - Default: `false`. If this is `true`, the data is always regenerated.
     * @returns
     */
    private async generateMapOfConnectionsForChildData(forceGenerate = false) {
      const sessionData = await this.getSessionMapData();
      // There's no data for this map entity's children so generate one
      if (forceGenerate || (!sessionData.size && this.children.size > 1)) {
        let finalMapOfConnections: MapChildConnectionDataType = new Map();

        const getMapChildConnectionPairData = async (
          area1: AreaId,
          area2: AreaId,
          data: MapChildConnectionDataType
        ) => {
          let passes = false;
          let dist = 0;
          let idPair: { from: AreaId; to: AreaId } = null;

          for (const [idObject, distance] of data) {
            if (Object.values(idObject).includesAll(area1, area2)) {
              passes = true;
              dist = distance ?? 1;
              idPair = idObject;
              break;
            }
          }

          return passes ? { idPair: idPair, dist: dist } : null;
        };

        const getDataOfAllConnectionsToChildArea = async (
          originAreaId: AreaId
        ) => {
          const queuedAreas: { id: AreaId; cumulativeDistance: number }[] = [
            { id: originAreaId, cumulativeDistance: 0 },
          ];
          const visitedAreas = new Set<AreaId>();
          const result: MapChildConnectionDataType = new Map();

          visitedAreas.add(originAreaId);

          while (queuedAreas.length > 0) {
            const currentAreaToIterateOver = queuedAreas.shift();
            const iteratedId = currentAreaToIterateOver.id;
            const iteratedCumulativeDistance =
              currentAreaToIterateOver.cumulativeDistance;

            if (iteratedId != originAreaId)
              result.set(
                { from: originAreaId, to: iteratedId },
                iteratedCumulativeDistance
              );

            // Enqueue all direct connections
            for await (const [, mapEntityDataForConnection] of this.getArea(
              iteratedId
            )?.connections) {
              const connectionId = mapEntityDataForConnection.area.id;
              if (!visitedAreas.has(connectionId)) {
                visitedAreas.add(connectionId);
                queuedAreas.push({
                  id: connectionId,
                  cumulativeDistance:
                    iteratedCumulativeDistance +
                    mapEntityDataForConnection.distance,
                });
              }
            }
          }

          return result;
        };

        // Loop through each child's connections and determine the total distance as well the directions
        for (const [, child] of this.children) {
          const childMapOfConnections =
            await getDataOfAllConnectionsToChildArea(child.id);

          // Prepend the contents of the child map
          for (const [idObject, distance] of childMapOfConnections) {
            // Check if a pair already exists (e.g {from: 1, to: 2} and {from:2, to:1} is considered a pair), if so, only overwrite it if the distance is smaller than what was previously stored
            const previouslyStoredData = await getMapChildConnectionPairData(
              idObject.from,
              idObject.to,
              finalMapOfConnections
            );
            const previousDist = previouslyStoredData?.dist ?? 1;

            if (previouslyStoredData) {
              finalMapOfConnections.set(
                previouslyStoredData.idPair,
                previousDist < distance ? previousDist : distance
              );
            } else {
              finalMapOfConnections.set(idObject, distance);
            }
          }
        }

        this.mapChildConnectionData = finalMapOfConnections;

        await this.setSessionMapData(this.mapChildConnectionData);

        return this.mapChildConnectionData;
      } else if (sessionData.size) {
        // Load up from the session data
        this.getMapChildConnectionData();
      }
    }

    private async setSessionMapData(value: MapChildConnectionDataType) {
      const key: keyof MapDataInSessionStorage = `mapChildConnections_${this.uniqueId}`;
      try {
        sessionStorage.setItem(key, JSON.stringify([...value]));
        return true;
      } catch (error) {
        const e = error as DOMException;
        console.error(
          "Could not store generated map connection data in session storage. The error is: ",
          e
        );
        return false;
      }
    }
    // TODO: compress this before storing
    private async getSessionMapData() {
      const noObjectInSessionStorageError = "Missing Data in session storage!";
      try {
        const deserializedObject = JSON.parse(
          sessionStorage.getItem(
            `mapChildConnections_${this.uniqueId}` as keyof MapDataInSessionStorage
          )
        );
        if (!deserializedObject) throw new Error(noObjectInSessionStorageError);

        const mapConnectionData = new Map(
          deserializedObject
        ) as MapChildConnectionDataType | null;

        return mapConnectionData;
      } catch (error) {
        // TODO
        const e = error as Error;
        if (e.message == noObjectInSessionStorageError) {
        }

        return new Map(); // Return an empty map so we can check if there's actually any data to use
      }
    }
    // NOTE: Always call this if you want the map connection data
    protected async getMapChildConnectionData() {
      try {
        let mapData: MapChildConnectionDataType;

        if (this.mapChildConnectionData) mapData = this.mapChildConnectionData;
        else {
          try {
            // Load up the data from the session storage, if any
            this.mapChildConnectionData = await this.getSessionMapData();

            if (!this.mapChildConnectionData.size)
              throw new Error(
                "No stored map connection data in session storage"
              );

            mapData = this.mapChildConnectionData;
          } catch (error) {
            // Regenerate the data
            return this.generateMapOfConnectionsForChildData(true);
          }
        }
        return mapData;
      } catch (error) {
        console.error("Error getting map child connection data");
      }
    }
  }

  // SECTION: Concrete Implementation to use
  export class SubLocation extends MapEntity<
    never,
    Exclude<SubLocationId, SubLocationId.DUMMY>,
    Location
  > {
    constructor(
      ...args: ConstructorParameters<
        typeof MapEntity<
          never,
          Exclude<SubLocationId, SubLocationId.DUMMY>,
          Location
        >
      >
    ) {
      super(...args);
      this.type = MapType.SUB_LOCATION;

      // Sub-Locations don't have children so delete the property
      delete this.children;
    }

    get uniqueId(): AreaUniqueId {
      let globalId = GlobalMapId.GLOBAL,
        regionId = this?.parent?.parent?.parent?.id ?? RegionId.DUMMY,
        subRegionId = this?.parent?.parent?.id ?? SubRegionId.DUMMY,
        locationId = this?.parent?.id ?? LocationId.DUMMY,
        subLocationId = this.id;

      return `${globalId}_${regionId}_${subRegionId}_${locationId}_${subLocationId}`;
    }
  }

  export class Location extends MapEntity<
    SubLocation,
    Exclude<LocationId, LocationId.DUMMY>,
    SubRegion
  > {
    constructor(
      ...args: ConstructorParameters<
        typeof MapEntity<
          SubLocation,
          Exclude<LocationId, LocationId.DUMMY>,
          SubRegion
        >
      >
    ) {
      super(...args);
      this.type = MapType.LOCATION;
    }

    get uniqueId(): AreaUniqueId {
      let subRegion = this?.parent;

      return `${GlobalMapId.GLOBAL}_${subRegion?.parent.id ?? RegionId.DUMMY}_${
        subRegion?.id
      }_${this.id}_${SubLocationId.DUMMY}`;
    }
  }

  export class SubRegion extends MapEntity<Location, SubRegionId, Region> {
    constructor(
      ...args: ConstructorParameters<
        typeof MapEntity<Location, SubRegionId, Region>
      >
    ) {
      super(...args);
      this.type = MapType.SUB_REGION;
    }

    get uniqueId(): AreaUniqueId {
      return `${GlobalMapId.GLOBAL}_${this?.parent.id ?? RegionId.DUMMY}_${
        this.id
      }_${LocationId.DUMMY}_${SubLocationId.DUMMY}`;
    }
  }

  export class Region extends MapEntity<
    SubRegion,
    Exclude<RegionId, RegionId.DUMMY>,
    GlobalMap
  > {
    constructor(
      ...args: ConstructorParameters<
        typeof MapEntity<
          SubRegion,
          Exclude<RegionId, RegionId.DUMMY>,
          GlobalMap
        >
      >
    ) {
      super(...args);
      this.type = MapType.REGION;
    }

    get uniqueId(): AreaUniqueId {
      return `${GlobalMapId.GLOBAL}_${this.id}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`;
    }
  }

  export class GlobalMap extends MapEntity<Region, GlobalMapId, never> {
    constructor(
      ...args: ConstructorParameters<
        typeof MapEntity<Region, GlobalMapId, never>
      >
    ) {
      super(...args);
      this.type = MapType.GLOBAL;

      // Global Map doesn't have a parent so delete the property
      delete this.parent;
    }

    get uniqueId(): AreaUniqueId {
      return `${this.id}_${RegionId.DUMMY}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`;
    }
  }
  // !SECTION
  //@ts-expect-error
  window.t = MapEntity;
}
