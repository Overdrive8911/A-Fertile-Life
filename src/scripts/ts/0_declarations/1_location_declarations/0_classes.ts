namespace NSLocation {
  // NOTE: Do not use this class directly. Use it's child classes instead.
  // A `map object` serves as a collection of different locations / sub-locations / areas.
  // TODO: Consider preventing in-explicitly set distances from having a value
  const defaultDistance = 1;
  class MapObject {
    //@ts-expect-error
    private map: Record<AreaId, MapChildData> = {};

    constructor(public baseData: GenericLocationData) {}

    getArea(id: AreaId) {
      return this.map[id];
    }
    protected addArea(
      id: AreaId,
      directionData?: CardinalDirAndDistanceType<AreaId>
    ) {
      // Initialize the child object to add to the map.
      let mapChild: MapChildData = this.getArea(id) ?? {
        locData: gLocationDataNew[id],
      };

      if (directionData) {
        mapChild.directions = mapChild.directions ?? {};

        // For every possible direction, initialize (if necessary) a new "map child"
        if (directionData.north) {
          const northId = directionData.north.area;
          const northDist = directionData.north.distance;
          const northData = this.getArea(northId);

          // No data is available so init a new map child with the required data
          if (!northData) {
            this.map[northId] = {
              locData: gLocationDataNew[northId],
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
          const eastId = directionData.east.area;
          const eastDist = directionData.east.distance;
          const eastData = this.getArea(eastId);

          // No data is available so init a new map child with the required data
          if (!eastData) {
            this.map[eastId] = {
              locData: gLocationDataNew[eastId],
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
          const southId = directionData.south.area;
          const southDist = directionData.south.distance;
          const southData = this.getArea(southId);

          // No data is available so init a new map child with the required data
          if (!southData) {
            this.map[southId] = {
              locData: gLocationDataNew[southId],
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
          const westId = directionData.west.area;
          const westDist = directionData.west.distance;
          const westData = this.getArea(westId);

          // No data is available so init a new map child with the required data
          if (!westData) {
            this.map[westId] = {
              locData: gLocationDataNew[westId],
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
      this.map[id] = mapChild;
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
      let entryAreas: MapChildData[] = [];

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
      subLocationId: MapSubLocation,
      directionData?: CardinalDirAndDistanceType<MapSubLocation>
    ) {
      this.addArea(subLocationId, directionData);
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
