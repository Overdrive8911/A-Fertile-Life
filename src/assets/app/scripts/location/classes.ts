import { compress, decompress } from 'lz-string'
import {
  Direction,
  MapEntityFlags,
  GlobalMapId,
  RegionId,
  SubRegionId,
  LocationId,
  SubLocationId,
} from './enums'
import type { AreaId, AreaUniqueId, SubAreas } from './types_and_interfaces'
import { oppositeDirection } from './general_location_data'

type ChildConnectionMap = Map<
  { from: AreaId; to: AreaId },
  {
    dist: number
    /**
     * An array of `Direction`s needed to transverse between the areas
     */
    dir: Direction[]
  }
>
type ChildConnectionSessionStorageKey = `mapChildConnections_${AreaUniqueId}`
type ChildConnectionSessionStorageData = Partial<
  Record<ChildConnectionSessionStorageKey, ChildConnectionMap>
>
/**
 * Used to determine when to clear older entries in the session storage
 */
type ChildConnectionSessionStorageIndex = ChildConnectionSessionStorageKey[]
type ChildConnectionSessionStorageIndexName = 'mapDataIndex'
// type SessionStorageIndexes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type Connections<T extends MapEntity<any, any, any>> = Map<
  Direction,
  { area: T; distance?: number }
>
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
  parent: ParentType extends never ? undefined : ParentType = null as any

  /**
   * All the `MapEntity` instances that are contained within this instance. Like a House containing rooms. Each child has some direction data that relates it to other children in this `MapEntity`
   *
   */
  childrenData: ChildType extends never
    ? undefined
    : Map<ChildType, Connections<ChildType>> = new Map() as any

  /**
   * This is a temporary cache used to quickly determine the distance between any two child areas.
   *
   * NOTE: This will be cleared when the player moves to another area (not a child area)
   */
  #mapChildConnectionData: ChildConnectionMap | undefined

  /**
   * Solely used as a makeshift type
   */
  //@ts-ignore
  private classType?: MapEntity<ChildType, IdType, ParentType>

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
    delete this.classType

    if (classData) {
      for (const key in classData) {
        if (Object.prototype.hasOwnProperty.call(classData, key)) {
          const prop = key as keyof typeof this.classType
          //@ts-ignore
          this[prop] = classData[prop]
        }
      }
    }
  }
  clone() {
    //@ts-ignore
    return new (this.constructor as typeof this.classType)(...[, , , ,], this)
  }
  toJSON() {
    //@ts-ignore
    const ownData: typeof this.classType = {}

    Object.keys(this).forEach(pn => {
      const p = pn as keyof typeof ownData

      //@ts-ignore
      ownData[p] = clone((this as unknown as Partial<typeof this.classType>)[p])
    }, this)

    return Serial.createReviver(
      `new ${this.constructor.name}(...[,,,,],$ReviveData$)`,
      ownData
    )
  }

  /**
   * A unique id is used to find out the exact instance of a map entity in the global map.
   *
   * NOTE: **THIS MUST BE IMPLEMENTED BY ALL CHILD INSTANCES**
   */
  get uniqueId(): AreaUniqueId {
    let globalId = GlobalMapId.GLOBAL,
      regionId = RegionId.DUMMY,
      subRegionId = SubRegionId.DUMMY,
      locationId = LocationId.DUMMY,
      subLocationId = SubLocationId.DUMMY

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

    return `${globalId}_${regionId}_${subRegionId}_${locationId}_${subLocationId}`
  }

  /**
   * NOTE: The value of this depends on the arguments that instantiated the class. As such, **multiple classes with identical arguments will have the same uuid**. This is by design though.
   *
   * TODO: Perhaps I could trim off other data bar the passage?
   */
  get uuid(): GlobalMapId | string {
    if (this instanceof GlobalMap) return this.id

    const getIdData = (classInstance: this | ParentType) => {
      return (
        classInstance.id +
        classInstance.name +
        (classInstance.passage ?? '') +
        (classInstance.description ?? '')
      )
    }

    return compress(getIdData(this))
  }

  /**
   * @param multiple - If given, an array of all possible entrypoints is returned.
   * @returns
   * NOTE: Check for the first entry area, else the first element in the `children` map is the origin area and will always have the coords of {x:0,y:0,z:0}
   */
  #originArea(): ChildType | null
  #originArea(multiple: boolean): ChildType[] | null
  #originArea(multiple = false): ChildType | ChildType[] | null {
    if (!this.childrenData?.size) return null
    let returnArea: ChildType[] = [],
      firstArea: ChildType | null = null
    let hasSetFirstArea = false
    for (const [child] of this.childrenData) {
      const d = child as ChildType
      if (!hasSetFirstArea) {
        firstArea = d
        hasSetFirstArea = true
      }

      if (d.flags & MapEntityFlags.IS_ENTRY_POINT) {
        returnArea.push(d)
        if (!multiple) break
      }
      break
    }
    return multiple ? returnArea ?? [firstArea] : returnArea[0] ?? firstArea
  }

  /**
   * NOTE: *Child areas added like this will not have any directions*
   *
   * @returns The class that this method belongs to
   */
  addArea(...areas: ChildType[]): typeof this.classType {
    if (!this.childrenData) this.childrenData = new Map() as any

    areas.forEach(area => {
      if (this.childrenData.has(area)) {
        console.error(
          `${area.name} already exists as a child of ${this.name}.\n\n OVERWRITING DATA ANYWAY.`
        )
      }

      area.parent = this
      this.childrenData.set(area, new Map())
    })

    return this
  }

  removeArea(...area: (ChildType | ChildType['id'])[]): typeof this.classType {
    area.forEach(val => {
      // `ChildType["id"]` will always bea number
      //@ts-ignore
      const idToRemove = typeof val == 'number' ? val : val.id

      if (!this.childrenData?.delete(idToRemove)) {
        console.warn(
          `There was no child data in the map entity, ${this.name}, with the id, ${idToRemove}`
        )
      }
    })

    return this
  }

  getArea(areaId: ChildType['id']) {
    let childArea: ChildType | null = null

    for (const [child] of this.childrenData) {
      if (child.id == areaId) {
        childArea = child as ChildType
        break
      }
    }

    return childArea
  }

  /**
   * NOTE: This only works once and then silently does nothing if the area is already connected in that particular direction.
   *
   * @returns The class that this method belongs to.
   */
  connect(
    ...data: {
      from: ChildType
      areas: { to: ChildType; dir: Direction; dist?: number }[]
    }[]
  ): typeof this.classType {
    data.forEach(val => {
      val.areas.forEach(area => {
        const oppositeDir = oppositeDirection[area.dir],
          currArea = val.from,
          destArea = area.to
        let currAreaDirections = this.childrenData.get(currArea),
          destAreaDirections = this.childrenData.get(destArea)

        // Ensure we aren't working with undefined values
        if (!currAreaDirections) {
          this.addArea(currArea)
          currAreaDirections = this.childrenData.get(currArea)
        }
        if (!destAreaDirections) {
          this.addArea(destArea)
          destAreaDirections = this.childrenData.get(destArea)
        }

        const currAreaDir = currAreaDirections as Connections<ChildType>
        const destAreaDir = destAreaDirections as Connections<ChildType>

        // Check if the connection doesn't exist already
        if (!currAreaDir.has(area.dir) && !destAreaDir.has(oppositeDir)) {
          const dist = area.dist ?? 1
          // Set the connection for this map entity
          currAreaDir.set(area.dir, { area: destArea, distance: dist })

          // Also set the connection on the other map entity for bi-directional travel
          destAreaDir.set(oppositeDir, {
            area: currArea,
            distance: dist,
          })
        } else {
          console.warn(
            `In the Map Entity, ${this.name}, the children, ${currArea.name} and ${destArea.name}, cannot be connected to each since either of them is already connected to another area with the same direction.`
          )
        }
      })
    })

    return this
  }

  /**
   *
   * @param childArea1 If this is an `AreaId`, ensure that it corresponds to that of the `ChildType`
   * @param childArea2 If this is an `AreaId`, ensure that it corresponds to that of the `ChildType`
   * @returns
   */
  async getDistance(
    childArea1: ChildType | ChildType['id'],
    childArea2: ChildType | ChildType['id']
  ) {
    const childConnectionData = await this.getChildConnections()
    const id1: number = !(childArea1 instanceof MapEntity)
      ? childArea1
      : childArea1.id
    const id2: number = !(childArea2 instanceof MapEntity)
      ? childArea2
      : childArea2.id
    let dist = 10 // Just a silly default

    for (const [idPair, data] of childConnectionData) {
      if (Object.values(idPair).includesAll(id1, id2)) {
        dist = data.dist
        break
      }
    }

    return dist
  }

  /**
   *
   * @param forceGenerate - Default: `false`. If this is `true`, the data is always regenerated.
   * @returns
   */
  async #generateMapOfConnectionsForChildData(forceGenerate = false) {
    const sessionData = await this.#getSessionMapData()
    // There's no data for this map entity's children so generate one
    if (forceGenerate || (!sessionData.size && this.childrenData.size > 1)) {
      let finalMapOfConnections: ChildConnectionMap = new Map()

      const getMapChildConnectionPairData = async (
        area1: AreaId,
        area2: AreaId,
        data: ChildConnectionMap
      ) => {
        let passes = false
        let dist = 0
        let idPair: { from: AreaId; to: AreaId } | null = null

        for (const [idObject, d] of data) {
          if (Object.values(idObject).includesAll(area1, area2)) {
            passes = true
            dist = d.dist ?? 1
            idPair = idObject
            break
          }
        }

        return passes
          ? { idPair: idPair as { from: AreaId; to: AreaId }, dist: dist }
          : null
      }

      const getDataOfAllConnectionsToChildArea = async (
        originAreaId: AreaId
      ) => {
        const queuedAreas: {
          id: AreaId
          /**
           * `cumulativeDistance`
           */
          accDist: number
          /**
           * This will be an array of the directions it takes to reach here from `originAreaId`
           */
          dir: Direction[]
        }[] = [{ id: originAreaId, accDist: 0, dir: [] }]
        const visitedAreas = new Set<AreaId>()
        const result: ChildConnectionMap = new Map()

        visitedAreas.add(originAreaId)

        while (queuedAreas.length > 0) {
          const currentAreaToIterateOver = queuedAreas.shift() as Exclude<
            (typeof queuedAreas)[0],
            undefined | null
          >
          const iteratedId = currentAreaToIterateOver.id
          const iteratedCumulativeDistance = currentAreaToIterateOver.accDist
          const iteratedArrayOfDirections = currentAreaToIterateOver.dir

          if (iteratedId != originAreaId)
            result.set(
              { from: originAreaId, to: iteratedId },
              {
                dist: iteratedCumulativeDistance,
                dir: iteratedArrayOfDirections,
              }
            )

          // Enqueue all direct connections
          const iteratedAreaConnections = this.childrenData.get(
            this.getArea(iteratedId) as ChildType
          ) as Connections<ChildType>

          for await (const [
            direction,
            mapEntityDataForConnection,
          ] of iteratedAreaConnections) {
            const connectionId = mapEntityDataForConnection.area.id
            if (!visitedAreas.has(connectionId)) {
              visitedAreas.add(connectionId)
              const newDirArray = clone(iteratedArrayOfDirections)
              newDirArray.push(direction)
              queuedAreas.push({
                id: connectionId,
                accDist:
                  iteratedCumulativeDistance +
                  (mapEntityDataForConnection.distance ?? 1),
                dir: newDirArray,
              })
            }
          }
        }

        return result
      }

      // Loop through each child's connections and determine the total distance as well the directions
      for (const [child] of this.childrenData) {
        const childMapOfConnections = await getDataOfAllConnectionsToChildArea(
          child.id
        )

        // Prepend the contents of the child map
        for (const [idObject, { dir, dist }] of childMapOfConnections) {
          // Check if a pair already exists (e.g {from: 1, to: 2} and {from:2, to:1} is considered a pair), if so, only overwrite it if the distance is smaller than what was previously stored
          const previouslyStoredData = await getMapChildConnectionPairData(
            idObject.from,
            idObject.to,
            finalMapOfConnections
          )
          const previousDist = previouslyStoredData?.dist ?? 1

          if (previouslyStoredData) {
            finalMapOfConnections.set(previouslyStoredData.idPair, {
              dist: previousDist < dist ? previousDist : dist,
              dir: dir,
            })
          } else {
            finalMapOfConnections.set(idObject, { dir: dir, dist: dist })
          }
        }
      }

      this.#mapChildConnectionData = finalMapOfConnections

      await this.#setSessionMapData(this.#mapChildConnectionData)

      return this.#mapChildConnectionData
    } else if (sessionData.size) {
      // Load up from the session data
      this.getChildConnections()
    }
  }

  /**
   * Returns an array containing the strings that index the cached data (e.g `mapChildConnections_${AreaUniqueId}`) for areas
   *
   */
  static get #arrOfStoredMapData(): ChildConnectionSessionStorageIndex {
    const parsedData = sessionStorage.getItem(
      'mapDataIndex' as ChildConnectionSessionStorageIndexName
    )

    return parsedData ? JSON.parse(decompress(parsedData)) : []
  }

  /**
   *
   */
  static #addToStoredMapData(
    dataStringIndex: ChildConnectionSessionStorageKey
  ) {
    const storedMapData = this.#arrOfStoredMapData

    if (!storedMapData.includes(dataStringIndex)) {
      if (storedMapData.length >= SessionStorage.LIMIT) {
        const indexOfMapDataToDelete = storedMapData.shift()
        sessionStorage.removeItem(indexOfMapDataToDelete ?? '')
      }

      storedMapData.push(dataStringIndex)

      sessionStorage.setItem(
        'mapDataIndex' as ChildConnectionSessionStorageIndexName,
        compress(JSON.stringify(storedMapData))
      )
    }
  }

  async #setSessionMapData(value: ChildConnectionMap) {
    const key: keyof ChildConnectionSessionStorageData = `mapChildConnections_${this.uniqueId}`
    try {
      // const storedMapDataIndex = MapEntity.arrOfStoredMapData.length
      sessionStorage.setItem(key, compress(JSON.stringify([...value])))
      MapEntity.#addToStoredMapData(key)
      return true
    } catch (error) {
      const e = error as DOMException
      console.error(
        'Could not store generated map connection data in session storage. The error is: ',
        e
      )
      return false
    }
  }
  // TODO: compress this before storing
  async #getSessionMapData() {
    const noObjectInSessionStorageError = 'Missing Data in session storage!'
    try {
      const deserializedObject = JSON.parse(
        decompress(
          sessionStorage.getItem(
            `mapChildConnections_${this.uniqueId}` as keyof ChildConnectionSessionStorageData
          ) as string // Yes, this can still fail :p
        )
      )
      if (!deserializedObject) throw new Error(noObjectInSessionStorageError)

      const mapConnectionData = new Map(
        deserializedObject
      ) as ChildConnectionMap

      return mapConnectionData
    } catch (error) {
      // TODO
      const e = error as Error
      if (e.message == noObjectInSessionStorageError) {
      }

      return new Map() as ChildConnectionMap // Return an empty map so we can check if there's actually any data to use
    }
  }
  // NOTE: Always call this if you want the map connection data
  protected async getChildConnections(): Promise<ChildConnectionMap> {
    // try {
    let mapData: ChildConnectionMap

    if (this.#mapChildConnectionData) mapData = this.#mapChildConnectionData
    else {
      try {
        // Load up the data from the session storage, if any
        this.#mapChildConnectionData = await this.#getSessionMapData()

        if (!this.#mapChildConnectionData.size)
          throw new Error('No stored map connection data in session storage')

        mapData = this.#mapChildConnectionData
      } catch (error) {
        // Regenerate the data
        return this.#generateMapOfConnectionsForChildData(
          true
        ) as Promise<ChildConnectionMap>
      }
    }
    return mapData
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
  /**
   * The name of the passage to be loaded when the player is in this sub location
   */
  constructor(
    ...args: ConstructorParameters<
      typeof MapEntity<
        never,
        Exclude<SubLocationId, SubLocationId.DUMMY>,
        Location
      >
    >
  ) {
    super(...args)
    // Sub-Locations don't have children so delete the property
    delete this.childrenData
  }

  get uniqueId(): AreaUniqueId {
    let globalId = GlobalMapId.GLOBAL,
      regionId = this?.parent?.parent?.parent?.id ?? RegionId.DUMMY,
      subRegionId = this?.parent?.parent?.id ?? SubRegionId.DUMMY,
      locationId = this?.parent?.id ?? LocationId.DUMMY,
      subLocationId = this.id

    return `${globalId}_${regionId}_${subRegionId}_${locationId}_${subLocationId}`
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
    super(...args)
    // delete this.passage
  }

  get uniqueId(): AreaUniqueId {
    let subRegion = this?.parent
    let region = subRegion?.parent

    return `${GlobalMapId.GLOBAL}_${region?.id ?? RegionId.DUMMY}_${
      subRegion?.id ?? SubRegionId.DUMMY
    }_${this.id}_${SubLocationId.DUMMY}`
  }
}

export class SubRegion extends MapEntity<Location, SubRegionId, Region> {
  constructor(
    ...args: ConstructorParameters<
      typeof MapEntity<Location, SubRegionId, Region>
    >
  ) {
    super(...args)
    // delete this.passage
  }

  get uniqueId(): AreaUniqueId {
    return `${GlobalMapId.GLOBAL}_${this?.parent?.id ?? RegionId.DUMMY}_${
      this.id
    }_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  }
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
    super(...args)
    // delete this.passage
  }

  get uniqueId(): AreaUniqueId {
    return `${GlobalMapId.GLOBAL}_${this.id}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  }
}

/**
 * NOTE: **THERE SHOULD ONLY BE ONE INSTANCE OF THIS**
 */
export class GlobalMap extends MapEntity<Region, GlobalMapId, never> {
  constructor(
    ...args: ConstructorParameters<typeof MapEntity<Region, GlobalMapId, never>>
  ) {
    super(...args)
    // delete this.passage

    // Global Map doesn't have a parent so delete the property
    delete this.parent
  }

  get uniqueId(): AreaUniqueId {
    return `${this.id}_${RegionId.DUMMY}_${SubRegionId.DUMMY}_${LocationId.DUMMY}_${SubLocationId.DUMMY}`
  }

  /**
   * Returns an object where each of the four properties is a reference to the appropriate `MapEntity` instance (excluding the `GlobalMap`)
   */
  areasFromUniqueId(id: AreaUniqueId) {
    // Expecting an array of 5 numbers here
    const ids = id.match(/(\d+)/g) as unknown as number[]

    const region = this.getArea(ids[1]),
      subRegion = region?.getArea(ids[2]) ?? null,
      location = subRegion?.getArea(ids[3]) ?? null,
      subLocation = location?.getArea(ids[4]) ?? null

    return {
      region: region,
      subRegion: subRegion,
      location: location,
      subLocation: subLocation,
    }
  }

  /**
   * Returns a reference to the current area the player is in, if any.
   */
  get activeArea(): SubAreas {
    return this.getOccupiedArea(variables().player.areaId)
  }

  /**
   * Gets the actual area from either an idea or an object of map entities.
   *
   * E.g If the `id` is "0_1_2_5_0", it means that there is no `SubLocation`, since it's id (the last digit) is zero, so the actual area inhabited is the `Location`'s id
   */
  getOccupiedArea(
    idOrObject: AreaUniqueId | ReturnType<typeof this.areasFromUniqueId>
  ): SubAreas {
    const mapEntities =
      typeof idOrObject == 'string'
        ? this.areasFromUniqueId(idOrObject)
        : idOrObject

    return (
      mapEntities.subLocation ??
      mapEntities.location ??
      mapEntities.subRegion ??
      (mapEntities.region as Region)
    )
  }
}
// !SECTION
