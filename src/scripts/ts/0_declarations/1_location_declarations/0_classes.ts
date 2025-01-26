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
    //@ts-expect-error
    private map: Record<AreaId, DefaultMapChildData> = {};

    constructor(public baseData: DefaultGenericLocationData) {}

    getArea(id: AreaId) {
      if (!this.map[id]) {
        console.error(
          `No data with the id, ${id}, exists in the map, ${this.baseData.name}, with the id, ${this.baseData.id}`
        );
      }
      return this.map[id];
    }
    protected addArea(
      locData: DefaultGenericLocationData,
      directionData?: CardinalDirAndDistanceType<DefaultGenericLocationData>
    ) {
      // Initialize the child object to add to the map.
      let mapChild: DefaultMapChildData =
        this.getArea(locData.id) ?? new MapChildData(locData);

      if (directionData) {
        mapChild.directions = mapChild.directions ?? {};

        // For every possible direction, initialize (if necessary) a new "map child"
        if (directionData.north) {
          const northBaseLocData = directionData.north.area;
          const northId = northBaseLocData.id;
          const northDist = directionData.north.distance;
          const northData = this.getArea(northId);

          // No data is available so init a new map child with the required data
          if (!northData) {
            //@ts-expect-error
            this.map[northId] = {
              locData: northBaseLocData,
              directions: {
                south: {
                  area: mapChild,
                  distance: northDist ?? defaultDistance,
                },
              },
            };
          } else {
            // The map child exists so just add the required direction
            northData.directions = northData.directions ?? {};
            northData.directions.south = {
              area: mapChild,
              distance:
                northDist ??
                northData.directions.south?.distance ??
                defaultDistance,
            };
          }

          mapChild.directions.north = {
            area: this.map[northId],
            distance: northDist ?? defaultDistance,
          };
        }
        if (directionData.east) {
          const eastBaseLocData = directionData.east.area;
          const eastId = eastBaseLocData.id;
          const eastDist = directionData.east.distance;
          const eastData = this.getArea(eastId);

          // No data is available so init a new map child with the required data
          if (!eastData) {
            //@ts-expect-error
            this.map[eastId] = {
              locData: eastBaseLocData,
              directions: {
                west: { area: mapChild, distance: eastDist ?? defaultDistance },
              },
            };
          } else {
            // The map child exists so just add the required direction
            eastData.directions = eastData.directions ?? {};
            eastData.directions.west = {
              area: mapChild,
              distance:
                eastDist ??
                eastData.directions.west?.distance ??
                defaultDistance,
            };
          }

          mapChild.directions.east = {
            area: this.map[eastId],
            distance: eastDist ?? defaultDistance,
          };
        }
        if (directionData.south) {
          const southBaseLocData = directionData.south.area;
          const southId = southBaseLocData.id;
          const southDist = directionData.south.distance;
          const southData = this.getArea(southId);

          // No data is available so init a new map child with the required data
          if (!southData) {
            //@ts-expect-error
            this.map[southId] = {
              locData: southBaseLocData,
              directions: {
                north: {
                  area: mapChild,
                  distance: southDist ?? defaultDistance,
                },
              },
            };
          } else {
            // The map child exists so just add the required direction
            southData.directions = southData.directions ?? {};
            southData.directions.north = {
              area: mapChild,
              distance:
                southDist ??
                southData.directions.north?.distance ??
                defaultDistance,
            };
          }

          mapChild.directions.south = {
            area: this.map[southId],
            distance: southDist ?? defaultDistance,
          };
        }
        if (directionData.west) {
          const westBaseLocData = directionData.west.area;
          const westId = westBaseLocData.id;
          const westDist = directionData.west.distance;
          const westData = this.getArea(westId);

          // No data is available so init a new map child with the required data
          if (!westData) {
            //@ts-expect-error
            this.map[westId] = {
              locData: westBaseLocData,
              directions: {
                east: { area: mapChild, distance: westDist ?? defaultDistance },
              },
            };
          } else {
            // The map child exists so just add the required direction
            westData.directions = westData.directions ?? {};
            westData.directions.east = {
              area: mapChild,
              distance:
                westDist ??
                westData.directions.east?.distance ??
                defaultDistance,
            };
          }

          mapChild.directions.west = {
            area: this.map[westId],
            distance: westDist ?? defaultDistance,
          };
        }
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
  }

  // ANCHOR: This only stores map objects for sub locations. Each Instance of this is effectively a "Location"
  export class MapObjectOfSubLocations extends MapObject {
    constructor(...args: ConstructorParameters<typeof MapObject>) {
      super(...args);
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

  // ANCHOR: This only stores references to `SubLocationMapObject` instances.
  // NOTE: Basically if you have a hospital, each room on a floor would be a `subLocation`(which is the smallest place that the player can enter), each floor would be a `location`(which solely consists of `subLocation`s), and the entire hospital would be a collection of `locations`
  // NOTE: A Location may have extra coordinates like `up` and `down`. A subLocation, however, CANNOT
  export class MapObjectOfLocations extends MapObject {
    constructor(...args: ConstructorParameters<typeof MapObject>) {
      super(...args);
    }
    addLocation() {}
  }
}
