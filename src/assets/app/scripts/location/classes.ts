import { compress, decompress } from "lz-string";
import {
  Direction,
  MapEntityFlags,
  GlobalMapId,
  RegionId,
  SubRegionId,
  LocationId,
  SubLocationId,
  MapEntityId,
} from "./enums";
import type {
  AnyArea,
  AreaId,
  SubAreas,
  SuperAreas,
  AreaUUID,
} from "./types_and_interfaces";
import { oppositeDirection } from "./general_location_data";
import Queue from "yocto-queue";
import { player } from "../declarations/general_declarations";
import { isSceneActive } from "../scene/functions";
import { SceneEnum } from "../scene/enums";
import dummyImg from "./../../../media/img/map/icons/sub_location/dummy.webp";
import receptionImg from "./../../../media/img/map/icons/sub_location/reception.webp";
import hallwayImg from "./../../../media/img/map/icons/sub_location/hallway.webp";
import pharmacyImg from "./../../../media/img/map/icons/sub_location/pharmacy.webp";
import porchImg from "./../../../media/img/map/icons/sub_location/porch.webp";
import corridorImg from "./../../../media/img/map/icons/sub_location/corridor.webp";
import roomImg from "./../../../media/img/map/icons/sub_location/room.webp";
import labImg from "./../../../media/img/map/icons/sub_location/lab.webp";
import consultationImg from "./../../../media/img/map/icons/sub_location/consultation.webp";
import officeImg from "./../../../media/img/map/icons/sub_location/office_work.webp";
import measureClosetImg from "./../../../media/img/map/icons/sub_location/measuring_closet.webp";
import bedroomImg from "./../../../media/img/map/icons/sub_location/bedroom.webp";
import bathroomImg from "./../../../media/img/map/icons/sub_location/bathroom.webp";
import livingRoomImg from "./../../../media/img/map/icons/sub_location/living_room.webp";

type ChildConnectionMap = Map<
  { from: AreaUUID; to: AreaUUID },
  {
    dist: number;
    /**
     * An array of `Direction`s needed to transverse between the areas
     */
    dir: Direction[];
  }
>;
type ChildConnectionSessionStorageKey = `mapChildConnections_${string}`;
type ChildConnectionSessionStorageData = Partial<
  Record<ChildConnectionSessionStorageKey, ChildConnectionMap>
>;
/**
 * Used to determine when to clear older entries in the session storage
 */
type ChildConnectionSessionStorageIndex = ChildConnectionSessionStorageKey[];
type ChildConnectionSessionStorageIndexName = "mapDataIndex";
// type SessionStorageIndexes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type Connections<T extends MapEntity<any, any, any>> = Map<
  Direction,
  { area: T; distance?: number }
>;
const enum SessionStorage {
  LIMIT = 10,
}

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
  /**
   * The `MapEntity` instance that contains this instance
   *
   */
  parent: ParentType extends never ? undefined : ParentType = null as any;

  /**
   * All the `MapEntity` instances that are contained within this instance. Like a House containing rooms. Each child has some direction data that relates it to other children in this `MapEntity`
   *
   */
  childrenData: ChildType extends never
    ? undefined
    : Map<ChildType, Connections<ChildType>> = new Map() as any;

  uuid: AreaUUID;

  /**
   * This is a temporary cache used to quickly determine the distance between any two child areas.
   *
   * NOTE: This will be cleared when the player moves to another area (not a child area)
   */
  #mapChildConnectionData: ChildConnectionMap | undefined;

  /**
   * Solely used as a makeshift type
   */
  //@ts-ignore
  private classType: MapEntity<ChildType, IdType, ParentType>;
  /**
   * Solely used as a makeshift type
   */
  //@ts-ignore
  private uuidType: Exclude<typeof this.classType, undefined>["uuid"];

  //SECTION - Static properties

  /**
   * regionUUIDCounter
   */
  private static r = 0;

  /**
   * subRegionUUIDCounter
   */
  private static sR = 0;

  /**
   * locationUUIDCounter
   */
  private static l = 0;

  /**
   * subLocationUUIDCounter
   */
  private static sL = 0;
  //!SECTION

  constructor(
    /**
     * This refers to any value from `AreaId` and is used to determine stuff like what icon to use, or any specific rules.
     *
     * NOTE: **THIS IS NOT MEANT TO SERVE AS A UNIQUE ID**. That's the job of `uuid`
     */
    public readonly id: IdType,
    public readonly name: string,
    public readonly passage?: string,
    public readonly description?: string,
    public flags = MapEntityFlags.NONE,
    /**
     * Used for cloning and stringifying this data
     */
    classData?: Partial<typeof this.classType>
  ) {
    //@ts-ignore
    delete this.classType;
    //@ts-ignore
    delete this.uuidType;

    const constructor = this.constructor as typeof MapEntity;

    this.uuid =
      this instanceof SubLocation
        ? `${MapEntityId.SUB_LOCATION}_${constructor.sL++}`
        : this instanceof Location
        ? `${MapEntityId.LOCATION}_${constructor.l++}`
        : this instanceof SubRegion
        ? `${MapEntityId.SUB_REGION}_${constructor.sR++}`
        : this instanceof Region
        ? `${MapEntityId.REGION}_${constructor.r++}`
        : this instanceof GlobalMap
        ? MapEntityId.GLOBAL_MAP
        : MapEntityId.DUMMY;

    if (classData) {
      for (const key in classData) {
        if (Object.prototype.hasOwnProperty.call(classData, key)) {
          const prop = key as keyof typeof this.classType;
          //@ts-ignore
          this[prop] = classData[prop];
        }
      }
    }
  }
  clone() {
    //@ts-ignore
    return new (this.constructor as typeof this.classType)(...[, , , ,], this);
  }
  toJSON() {
    //@ts-ignore
    const ownData: typeof this.classType = {};

    Object.keys(this).forEach((pn) => {
      const p = pn as keyof typeof ownData;

      //@ts-ignore
      ownData[p] = clone(
        (this as unknown as Partial<typeof this.classType>)[p]
      );
    }, this);

    return Serial.createReviver(
      `new ${this.constructor.name}(...[,,,,],$ReviveData$)`,
      ownData
    );
  }

  /**
   * NOTE: This also includes the class instance that called this getter
   */
  get siblings() {
    return this.parent?.childrenData;
  }

  /**
   * Gets the appropriate "origin area" that acts as the main entry point (or exit in some case)
   *
   * @param referenceArea - If given and multiple origin areas exist, the closest origin area is picked.
   */
  async originArea(): Promise<ChildType[] | null>;
  async originArea(referenceArea: ChildType): Promise<ChildType | null>;
  async originArea(
    referenceArea?: ChildType
  ): Promise<ChildType | ChildType[] | null> {
    if (!this.childrenData?.size) return null;

    const returnAreas: ChildType[] = [];
    let firstArea: ChildType | null = null;
    let hasSetFirstArea = false;

    for (const c of this.childrenData.keys()) {
      const child = c as ChildType;

      if (!hasSetFirstArea) {
        firstArea = child;
        hasSetFirstArea = true;
      }

      if (child.flags & MapEntityFlags.IS_ENTRY_POINT) returnAreas.push(child);
    }

    if (!returnAreas.length) return firstArea;

    if (referenceArea) {
      return (async () => {
        const distances = await Promise.all(
          returnAreas.map(async (area) => ({
            area,
            distance: await this.getDistance(area, referenceArea),
          }))
        );

        // Sort in ascending order so the shortest path will be at index0
        distances.sort((a, b) => a.distance - b.distance);

        return distances.map((d) => d.area)[0];
      })();
    }

    return returnAreas.length ? returnAreas : firstArea;
  }

  /**
   * NOTE: *Child areas added like this will not have any directions*
   *
   * @returns The class that this method belongs to
   */
  addArea(...areas: ChildType[]): typeof this.classType {
    if (!this.childrenData) this.childrenData = new Map() as any;

    areas.forEach((area) => {
      if (this.childrenData.has(area)) {
        console.error(
          `${area.name} already exists as a child of ${this.name}.\n\n OVERWRITING DATA ANYWAY.`
        );
      }

      area.parent = this;
      this.childrenData.set(area, new Map());
    });

    return this;
  }

  removeArea(...area: (ChildType | ChildType["id"])[]): typeof this.classType {
    area.forEach((val) => {
      // `ChildType["id"]` will always bea number
      //@ts-ignore
      const idToRemove = typeof val == "number" ? val : val.id;

      if (!this.childrenData?.delete(idToRemove)) {
        console.warn(
          `There was no child data in the map entity, ${this.name}, with the id, ${idToRemove}`
        );
      }
    });

    return this;
  }

  // getArea(areaId: ChildType['id']) {
  //   let childArea: ChildType | null = null

  //   for (const [child] of this.childrenData) {
  //     if (child.id == areaId) {
  //       childArea = child as ChildType
  //       break
  //     }
  //   }

  //   return childArea
  // }

  /**
   * NOTE: This only works once and then silently does nothing if the area is already connected in that particular direction.
   *
   * @returns The class that this method belongs to.
   */
  connect(
    ...data: {
      from: ChildType;
      areas: { to: ChildType; dir: Direction; dist?: number }[];
    }[]
  ): typeof this.classType {
    data.forEach((val) => {
      val.areas.forEach((area) => {
        const oppositeDir = oppositeDirection[area.dir],
          currArea = val.from,
          destArea = area.to;
        let currAreaDirections = this.childrenData.get(currArea),
          destAreaDirections = this.childrenData.get(destArea);

        // Ensure we aren't working with undefined values
        if (!currAreaDirections) {
          this.addArea(currArea);
          currAreaDirections = this.childrenData.get(currArea);
        }
        if (!destAreaDirections) {
          this.addArea(destArea);
          destAreaDirections = this.childrenData.get(destArea);
        }

        const currAreaDir = currAreaDirections as Connections<ChildType>;
        const destAreaDir = destAreaDirections as Connections<ChildType>;

        // Check if the connection doesn't exist already
        if (!currAreaDir.has(area.dir) && !destAreaDir.has(oppositeDir)) {
          const dist = area.dist ?? 1;
          // Set the connection for this map entity
          currAreaDir.set(area.dir, { area: destArea, distance: dist });

          // Also set the connection on the other map entity for bi-directional travel
          destAreaDir.set(oppositeDir, {
            area: currArea,
            distance: dist,
          });
        } else {
          console.warn(
            `In the Map Entity, ${this.name}, the children, ${currArea.name} and ${destArea.name}, cannot be connected to each since either of them is already connected to another area with the same direction.`
          );
        }
      });
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
    if (childArea1 == childArea2) return 0;

    const childConnectionData = await this.getChildConnections();
    const id1: typeof this.uuidType = !(childArea1 instanceof MapEntity)
      ? childArea1
      : childArea1.uuid;
    const id2: typeof this.uuidType = !(childArea2 instanceof MapEntity)
      ? childArea2
      : childArea2.uuid;
    let dist = random(1, 10); // Just a silly default

    for (const [idPair, data] of childConnectionData) {
      if (Object.values(idPair).includesAll(id1, id2)) {
        dist = data.dist;
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
  async #generateMapOfConnectionsForChildData(forceGenerate = false) {
    const sessionData = await this.#getSessionMapData();
    // There's no data for this map entity's children so generate one
    if (forceGenerate || (!sessionData.size && this.childrenData.size > 1)) {
      let finalMapOfConnections: ChildConnectionMap = new Map();

      const getMapChildConnectionPairData = async (
        area1: typeof this.uuidType,
        area2: typeof this.uuidType,
        data: ChildConnectionMap
      ) => {
        let passes = false;
        let dist = 0;
        let idPair: { from: AreaUUID; to: AreaUUID } | null = null;

        for (const [idObject, d] of data) {
          if (Object.values(idObject).includesAll(area1, area2)) {
            passes = true;
            dist = d.dist ?? 1;
            idPair = idObject;
            break;
          }
        }

        return passes
          ? { idPair: idPair as { from: AreaUUID; to: AreaUUID }, dist: dist }
          : null;
      };

      const getDataOfAllConnectionsToChildArea = async (
        originArea: ChildType
      ) => {
        type QueueElement = {
          area: typeof originArea;
          /**
           * `cumulativeDistance`
           */
          accDist: number;
          /**
           * This will be an array of the directions it takes to reach here from `originAreaId`
           */
          dir: Direction[];
        };
        const queuedAreas = new Queue<QueueElement>();
        queuedAreas.enqueue({ area: originArea, accDist: 0, dir: [] });
        const visitedAreas = new Set<typeof originArea>();
        const result: ChildConnectionMap = new Map();

        visitedAreas.add(originArea);

        while (queuedAreas.size > 0) {
          const currentAreaToIterateOver =
            queuedAreas.dequeue() as QueueElement;
          const iteratedArea = currentAreaToIterateOver.area;
          const iteratedCumulativeDistance = currentAreaToIterateOver.accDist;
          const iteratedArrayOfDirections = currentAreaToIterateOver.dir;

          if (iteratedArea != originArea)
            result.set(
              { from: originArea.uuid, to: iteratedArea.uuid },
              {
                dist: iteratedCumulativeDistance,
                dir: iteratedArrayOfDirections,
              }
            );

          // Enqueue all direct connections
          const iteratedAreaConnections = this.childrenData?.get(
            iteratedArea
          ) as Connections<ChildType>;

          if (iteratedAreaConnections) {
            for await (const [
              direction,
              mapEntityDataForConnection,
            ] of iteratedAreaConnections) {
              const connectionArea = mapEntityDataForConnection.area;
              if (!visitedAreas.has(connectionArea)) {
                visitedAreas.add(connectionArea);
                const newDirArray = clone(iteratedArrayOfDirections);
                newDirArray.push(direction);
                queuedAreas.enqueue({
                  area: connectionArea,
                  accDist:
                    iteratedCumulativeDistance +
                    (mapEntityDataForConnection.distance ?? 1),
                  dir: newDirArray,
                });
              }
            }
          }
        }

        return result;
      };

      // Loop through each child's connections and determine the total distance as well the directions
      for (const [child] of this.childrenData) {
        const childMapOfConnections = await getDataOfAllConnectionsToChildArea(
          child as ChildType
        );

        // Prepend the contents of the child map
        for (const [idObject, { dir, dist }] of childMapOfConnections) {
          // Check if a pair already exists (e.g {from: 1, to: 2} and {from:2, to:1} is considered a pair), if so, only overwrite it if the distance is smaller than what was previously stored
          const previouslyStoredData = await getMapChildConnectionPairData(
            idObject.from,
            idObject.to,
            finalMapOfConnections
          );
          const previousDist = previouslyStoredData?.dist ?? 1;

          if (previouslyStoredData) {
            finalMapOfConnections.set(previouslyStoredData.idPair, {
              dist: previousDist < dist ? previousDist : dist,
              dir: dir,
            });
          } else {
            finalMapOfConnections.set(idObject, { dir: dir, dist: dist });
          }
        }
      }

      this.#mapChildConnectionData = finalMapOfConnections;

      await this.#setSessionMapData(this.#mapChildConnectionData);

      return this.#mapChildConnectionData;
    } else if (sessionData.size) {
      // Load up from the session data
      this.getChildConnections();
    }
  }

  /**
   * Returns an array containing the strings that index the cached data (e.g `mapChildConnections_${AreaUniqueId}`) for areas
   *
   */
  static get #arrOfStoredMapData(): ChildConnectionSessionStorageIndex {
    const parsedData = sessionStorage.getItem(
      "mapDataIndex" as ChildConnectionSessionStorageIndexName
    );

    return parsedData ? JSON.parse(decompress(parsedData)) : [];
  }

  /**
   *
   */
  static #addToStoredMapData(
    dataStringIndex: ChildConnectionSessionStorageKey
  ) {
    const storedMapData = this.#arrOfStoredMapData;

    if (!storedMapData.includes(dataStringIndex)) {
      if (storedMapData.length >= SessionStorage.LIMIT) {
        const indexOfMapDataToDelete = storedMapData.shift();
        sessionStorage.removeItem(indexOfMapDataToDelete ?? "");
      }

      storedMapData.push(dataStringIndex);

      sessionStorage.setItem(
        "mapDataIndex" as ChildConnectionSessionStorageIndexName,
        compress(JSON.stringify(storedMapData))
      );
    }
  }

  async #setSessionMapData(value: ChildConnectionMap) {
    const key: keyof ChildConnectionSessionStorageData = `mapChildConnections_${this.uuid}`;
    try {
      // const storedMapDataIndex = MapEntity.arrOfStoredMapData.length
      sessionStorage.setItem(key, compress(JSON.stringify([...value])));
      MapEntity.#addToStoredMapData(key);
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
  async #getSessionMapData() {
    const noObjectInSessionStorageError = "Missing Data in session storage!";
    try {
      const deserializedObject = JSON.parse(
        decompress(
          sessionStorage.getItem(
            `mapChildConnections_${this.uuid}` as keyof ChildConnectionSessionStorageData
          ) as string // Yes, this can still fail :p
        )
      );
      if (!deserializedObject) throw new Error(noObjectInSessionStorageError);

      const mapConnectionData = new Map(
        deserializedObject
      ) as ChildConnectionMap;

      return mapConnectionData;
    } catch (error) {
      // TODO
      const e = error as Error;
      if (e.message == noObjectInSessionStorageError) {
      }

      return new Map() as ChildConnectionMap; // Return an empty map so we can check if there's actually any data to use
    }
  }
  // NOTE: Always call this if you want the map connection data
  protected async getChildConnections(): Promise<ChildConnectionMap> {
    // try {
    let mapData: ChildConnectionMap;

    if (this.#mapChildConnectionData) mapData = this.#mapChildConnectionData;
    else {
      try {
        // Load up the data from the session storage, if any
        this.#mapChildConnectionData = await this.#getSessionMapData();

        if (!this.#mapChildConnectionData.size)
          throw new Error("No stored map connection data in session storage");

        mapData = this.#mapChildConnectionData;
      } catch (error) {
        // Regenerate the data
        return this.#generateMapOfConnectionsForChildData(
          true
        ) as Promise<ChildConnectionMap>;
      }
    }
    return mapData;
    // } catch (error) {
    //   console.error("Error getting map child connection data");
    // }
  }
}

// SECTION: Concrete Implementation to use
/**
 * This is the smallest area that the player can access and also the only areas that are directly linked to passages. Every other `MapEntity` child instance is just a container that directly or indirectly contains this.
 */
export class SubLocation extends MapEntity<
  never,
  Exclude<SubLocationId, SubLocationId.DUMMY>,
  Location
> {
  // Stores relative urls to the icons for sub locations
  // NOTE - Add the urls of sub locations with mini icons here. Use lowercase
  static #icons: Partial<Record<SubLocationId, string>> = {
    [SubLocationId.DUMMY]: dummyImg,

    [SubLocationId.RECEPTION]: receptionImg,

    [SubLocationId.HALLWAY]: hallwayImg,

    [SubLocationId.PHARMACY]: pharmacyImg,

    [SubLocationId.PORCH]: porchImg,

    [SubLocationId.CORRIDOR]: corridorImg,

    [SubLocationId.ROOM]: roomImg,

    [SubLocationId.LAB]: labImg,

    [SubLocationId.CONSULTATION]: consultationImg,

    [SubLocationId.OFFICE_WORK]: officeImg,

    [SubLocationId.MEASUREMENT_CLOSET]: measureClosetImg,

    // [SubLocationId.KITCHEN]: SubLocation.#getUrl("room"),
    [SubLocationId.BEDROOM]: bedroomImg,
    [SubLocationId.BATHROOM]: bathroomImg,
    [SubLocationId.LIVING_ROOM]: livingRoomImg,
  };

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
    // Sub-Locations don't have children so delete the property
    delete this.childrenData;
  }

  get iconUrl() {
    const icons = SubLocation.#icons;
    return icons[this.id] ?? (icons[SubLocationId.DUMMY] as string);
  }

  // get uniqueId(): AreaUniqueId {
  //   let globalId = GlobalMapId.GLOBAL,
  //     regionId = this?.parent?.parent?.parent?.id ?? RegionId.DUMMY,
  //     subRegionId = this?.parent?.parent?.id ?? SubRegionId.DUMMY,
  //     locationId = this?.parent?.id ?? LocationId.DUMMY,
  //     subLocationId = this.id

  //   return `${globalId}_${regionId}_${subRegionId}_${locationId}_${subLocationId}`
  // }
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
    // delete this.passage
  }

  // get uniqueId(): AreaUniqueId {
  //   let subRegion = this?.parent
  //   let region = subRegion?.parent

  //   return `${GlobalMapId.GLOBAL}_${region?.id ?? RegionId.DUMMY}_${
  //     subRegion?.id ?? SubRegionId.DUMMY
  //   }_${this.id}_${SubLocationId.DUMMY}`
  // }
}

export class SubRegion extends MapEntity<Location, SubRegionId, Region> {
  constructor(
    ...args: ConstructorParameters<
      typeof MapEntity<Location, SubRegionId, Region>
    >
  ) {
    super(...args);
    // delete this.passage
  }

  // get uniqueId(): AreaUniqueId {
  //   return `${GlobalMapId.GLOBAL}_${this?.parent?.id ?? RegionId.DUMMY}_${
  //     this.id
  //   }_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  // }
}

export class Region extends MapEntity<
  SubRegion,
  Exclude<RegionId, RegionId.DUMMY>,
  GlobalMap
> {
  constructor(
    ...args: ConstructorParameters<
      typeof MapEntity<SubRegion, Exclude<RegionId, RegionId.DUMMY>, GlobalMap>
    >
  ) {
    super(...args);
    // delete this.passage
  }

  // get uniqueId(): AreaUniqueId {
  //   return `${GlobalMapId.GLOBAL}_${this.id}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  // }
}

/**
 * NOTE: **THERE SHOULD ONLY BE ONE INSTANCE OF THIS**
 */
export class GlobalMap extends MapEntity<Region, GlobalMapId, never> {
  /**
   * Used to quickly get right map entity instance from its uuid
   *
   * @type {Map<typeof this.uuid, SubAreas>}
   */
  #uuidMapCache: Map<typeof this.uuid, SubAreas> = new Map();

  /**
   * Used to fetch the required UUID from a passage
   */
  #passageUUIDCache: Map<string, AreaUUID[]> = new Map();

  constructor(
    ...args: ConstructorParameters<typeof MapEntity<Region, GlobalMapId, never>>
  ) {
    super(...args);
    // delete this.passage

    // Global Map doesn't have a parent so delete the property
    delete this.parent;
  }

  async initMapCache() {
    if (!this.childrenData.size) return;

    // Use BFS to cache all the uuids and their corresponding class instance references
    this.#uuidMapCache = await (async () => {
      type QueueElement = { area: AnyArea };

      const queuedAreas = new Queue<QueueElement>();
      queuedAreas.enqueue({ area: this });

      const visitedAreas = new Set<AnyArea>();
      const result = new Map<typeof this.uuid, SubAreas>();

      visitedAreas.add(this);

      while (queuedAreas.size > 0) {
        //REVIEW - Maybe I could implement a queue class?
        const areaToWorkWith = queuedAreas.dequeue();
        const iteratedArea = areaToWorkWith!.area;
        // if (iteratedArea != this) {
        const iteratedUUID = iteratedArea.uuid;
        result.set(iteratedUUID, iteratedArea as SubAreas);

        const iteratedPassageName = iteratedArea.passage ?? "";
        const existingPassageData =
          this.#passageUUIDCache.get(iteratedPassageName);

        if (existingPassageData) {
          // Append this passage's uuid
          existingPassageData.push(iteratedUUID);
        } else {
          // Init a new array for the data
          this.#passageUUIDCache.set(iteratedPassageName, [iteratedUUID]);
        }
        // }

        // Enqueue all child areas
        const iteratedAreaChildren = iteratedArea.childrenData?.keys();

        if (iteratedAreaChildren) {
          for await (const area of iteratedAreaChildren) {
            if (!visitedAreas.has(area)) {
              visitedAreas.add(area);
              queuedAreas.enqueue({ area: area });
            }
          }
        }
      }
      return result;
    })();
  }

  // get uniqueId(): AreaUniqueId {
  //   return `${this.id}_${RegionId.DUMMY}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  // }

  /**
   * NOTE: **ENSURE THAT `this.initMapCache()` HAS BEEN CALLED BEFORE USING THIS.** Otherwise, it throws an error.
   */
  areaFromUUID(uuid: typeof this.uuid) {
    if (this.#uuidMapCache.size == 0) {
      this.initMapCache();
      throw new Error("Map Cache is empty!");
    }

    //TODO: Find a way to return the user to a default area if this is invalid.
    return this.#uuidMapCache.get(uuid) as SubAreas;
    // // Expecting an array of 5 numbers here
    // const ids = uuid.match(/(\d+)/g) as unknown as number[]

    // const region = this.getArea(ids[1]),
    //   subRegion = region?.getArea(ids[2]) ?? null,
    //   location = subRegion?.getArea(ids[3]) ?? null,
    //   subLocation = location?.getArea(ids[4]) ?? null

    // return {
    //   region: region,
    //   subRegion: subRegion,
    //   location: location,
    //   subLocation: subLocation,
    // }
  }

  /**
   * Returns a reference to the current area the player is in, if any. If it cannot infer the player's location, it simply defaults to the `GlobalMap`
   */
  get activeArea(): SubAreas | GlobalMap {
    const uuid = player()?.areaId ?? "1_0";
    const currPassage = passage();

    // This will, always have at least 1 item
    const passageLinkedUUIDs = this.#passageUUIDCache.get(currPassage);

    return isSceneActive() &&
      variables()[SceneEnum.STORY_VARIABLE_NAME]!.scene(currPassage)?.area
      ? this.areaFromUUID(
          variables()[SceneEnum.STORY_VARIABLE_NAME]!.scene(currPassage)!.area
        )
      : passageLinkedUUIDs
      ? passageLinkedUUIDs.includes(uuid)
        ? this.areaFromUUID(uuid)
        : this.areaFromUUID(
            passageLinkedUUIDs[random(99) % passageLinkedUUIDs.length]
          )
      : this;
  }

  uuidFromPassage(passageName: string) {
    const uuids = this.#passageUUIDCache.get(passageName);
    return uuids ? either(...uuids) : null;
  }

  /**
   * Gets the shortest distance between any 2 sub areas beneath this, regardless of their "level"
   * @param area1
   * @param area2
   */
  async getDistance2(area1: AnyArea, area2: AnyArea): Promise<number> {
    let travelDist = 0;
    let commonParent: Exclude<AnyArea, SubLocation>;

    if (area1 instanceof GlobalMap || area2 instanceof GlobalMap)
      commonParent = this;
    else if (area1.parent == area2.parent) {
      return area1.parent.getDistance(area1 as any, area2 as any);
    } else {
      const getCommonParent = (area1: SubAreas, area2: SubAreas) => {
        const parent1 = area1.parent;
        const parent2 = area2.parent;

        if (parent1 instanceof GlobalMap || parent2 instanceof GlobalMap) {
          return this;
        }

        if (parent1 != parent2) {
          return getCommonParent(parent1, parent2);
        } else {
          return parent1;
        }
      };

      commonParent = getCommonParent(area1, area2);
    }

    const getDistanceToSpecificParent = async (
      area: AnyArea,
      specificParent: SuperAreas,
      dist = 0
    ) => {
      if (area instanceof GlobalMap) return dist;

      const parent = area.parent;

      const accumulatedDist =
        dist +
        (await parent.getDistance(
          area as any,
          (await parent.originArea(area as any)) as any
        ));

      if (parent == specificParent) return accumulatedDist;
      else
        return getDistanceToSpecificParent(
          parent,
          specificParent,
          accumulatedDist
        );
    };

    const dist1 = await getDistanceToSpecificParent(area1, commonParent),
      dist2 = await getDistanceToSpecificParent(area2, commonParent);

    travelDist = (dist1 ?? 0) + (dist2 ?? 0);

    return travelDist;
  }
}
// !SECTION
