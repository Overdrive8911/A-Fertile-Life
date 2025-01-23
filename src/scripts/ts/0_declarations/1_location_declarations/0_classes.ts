namespace NSLocation {
  // NOTE: Do not use this class directly. Use it's child classes instead.
  // A `map object` serves as a collection of different locations / sub-locations / areas.
  class MapObject {
    //@ts-expect-error
    private map: Record<AreaId, MapChildData> = {};

    constructor() {}

    protected getArea(id: AreaId) {
      return this.map[id];
    }
    protected addArea(id: AreaId, directionData?: CardinalDirType<AreaId>) {
      // Initialize the child object to add to the map.
      let mapChild: MapChildData = this.getArea(id) ?? {
        locData: gLocationDataNew[id],
      };

      if (directionData) {
        mapChild.directions = mapChild.directions ?? {};

        // For every possible direction, initialize (if necessary) a new "map child"
        if (directionData.north) {
          const northId = directionData.north;
          const northData = this.getArea(northId);

          // No data is available so init a new map child with the required data
          if (!northData) {
            this.map[northId] = {
              locData: gLocationDataNew[northId],
              directions: { south: mapChild },
            };
          } else {
            // The map child exists so just add the required direction
            northData.directions = northData.directions ?? {};
            northData.directions.south = mapChild;
          }

          mapChild.directions.north = this.map[northId];
        }
        if (directionData.east) {
          const eastId = directionData.east;
          const eastData = this.getArea(eastId);

          // No data is available so init a new map child with the required data
          if (!eastData) {
            this.map[eastId] = {
              locData: gLocationDataNew[eastId],
              directions: { west: mapChild },
            };
          } else {
            // The map child exists so just add the required direction
            eastData.directions = eastData.directions ?? {};
            eastData.directions.west = mapChild;
          }

          mapChild.directions.east = this.map[eastId];
        }
        if (directionData.south) {
          const southId = directionData.south;
          const southData = this.getArea(southId);

          // No data is available so init a new map child with the required data
          if (!southData) {
            this.map[southId] = {
              locData: gLocationDataNew[southId],
              directions: { north: mapChild },
            };
          } else {
            // The map child exists so just add the required direction
            southData.directions = southData.directions ?? {};
            southData.directions.north = mapChild;
          }

          mapChild.directions.south = this.map[southId];
        }
        if (directionData.west) {
          const westId = directionData.west;
          const westData = this.getArea(westId);

          // No data is available so init a new map child with the required data
          if (!westData) {
            this.map[westId] = {
              locData: gLocationDataNew[westId],
              directions: { east: mapChild },
            };
          } else {
            // The map child exists so just add the required direction
            westData.directions = westData.directions ?? {};
            westData.directions.east = mapChild;
          }

          mapChild.directions.west = this.map[westId];
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

    protected getAreasWithFlag(flag: MapChildDataFlags) {
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

  // ANCHOR: This only stores map objects for sub locations
  export class SubLocationMapObject extends MapObject {
    constructor() {
      super();
    }
  }
}
