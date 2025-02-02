namespace NSLocation {
  // ANCHOR: There are 5 types of areas; Sub-Locations, Locations, Sub-Regions, Regions, and the Global Map
  /*  Sub-Location -> A room in a house,
      Location -> The house itself,
      Sub-Region -> The neighbourhood or even a city,
      Regions -> A standalone zone / region of sub regions,
      Global Map -> Just to store everything :3,
   */

  const oppositeDirection = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.WEST]: Direction.EAST,
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
  };

  // Base Generic Class Implementation that will be extended for use
  // NOTE: Most methods return a reference to the map entity for use in chaining
  class MapEntity<ChildType extends MapEntity<any>> {
    // The `MapEntity` instance that contains this instance
    parent: MapEntity<any> | null = null;
    // All the `MapEntity` instances that are contained within this instance. Like a House containing rooms
    protected children: Map<AreaId, ChildType> | null = null;
    // The connections to other `MapEntity` instances in the same direction. Like a room connecting to another room
    private connections: Map<
      Direction,
      { area: MapEntity<ChildType>; distance?: number | null }
    > = new Map();
    type = MapType.GENERIC;

    constructor(
      public readonly id: AreaId,
      public readonly name: string,
      public readonly description?: string,
      public readonly flags = MapEntityFlags.NONE
    ) {}

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
    // NOTE: This may be computationally intensive if there are a lot of areas
    // This looks for the shortest path between two areas in the map entity. It returns an Array of the area ids in order of traversal and the total distance
    findPath(
      fromId: AreaId,
      toId: AreaId,
      visited = new Set<AreaId>()
    ): { path: AreaId[]; dist: number } | null {
      if (fromId === toId) return { path: [fromId], dist: 0 };

      visited.add(fromId);
      let shortestPath: { path: AreaId[]; dist: number } | null = null;

      const currentArea = this.children.get(fromId);
      if (!currentArea) return null;

      for (const { area, distance } of currentArea.connections.values()) {
        if (visited.has(area.id)) continue;
        const result = area.findPath(area.id, toId, new Set(visited));
        if (result) {
          const newPath = {
            path: [fromId, ...result.path],
            dist: distance + result.dist,
          };
          if (!shortestPath || newPath.dist < shortestPath.dist) {
            shortestPath = newPath;
          }
        }
      }

      return shortestPath;
    }
    addArea(...areas: ChildType[]): MapEntity<ChildType> {
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

    removeArea(...area: (ChildType | AreaId)[]): MapEntity<ChildType> {
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
      ...data: { area: MapEntity<ChildType>; dir: Direction; dist?: number }[]
    ): MapEntity<ChildType> {
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
  }

  // SECTION: Concrete Implementation to use
  export class SubLocation extends MapEntity<never> {
    constructor(...args: ConstructorParameters<typeof MapEntity>) {
      super(...args);
      this.type = MapType.SUB_LOCATION;

      // Sub-Locations don't have children so delete the property
      delete this.children;
    }
  }

  export class Location extends MapEntity<SubLocation> {
    constructor(...args: ConstructorParameters<typeof MapEntity>) {
      super(...args);
      this.type = MapType.LOCATION;
    }
  }

  export class SubRegion extends MapEntity<Location> {
    constructor(...args: ConstructorParameters<typeof MapEntity>) {
      super(...args);
      this.type = MapType.SUB_REGION;
    }
  }

  export class Region extends MapEntity<SubRegion> {
    constructor(...args: ConstructorParameters<typeof MapEntity>) {
      super(...args);
      this.type = MapType.REGION;
    }
  }

  export class GlobalMap extends MapEntity<Region> {
    constructor(...args: ConstructorParameters<typeof MapEntity>) {
      super(...args);
      this.type = MapType.GLOBAL;

      // Global Map doesn't have a parent so delete the property
      delete this.parent;
    }
  }
  // !SECTION
  //@ts-expect-error
  window.t = MapEntity;
}
