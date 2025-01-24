namespace NSLocation {
  export interface GameLocation {
    name: string;
    coords: LocationCoords;
    subLocations?: {
      [nameOfSubLocation in MapSubLocation]?: GameSubLocation;
    };
    subLocationMap?: GameMapForSubLocations<number>;
    minSubLocationCoords?: LocationCoords;
    maxSubLocationCoords?: LocationCoords;
  }

  export interface GameSubLocation {
    name?: string;
    coords: LocationCoords;
    // Defaults to `GameMapCoordinate.EMPTY` if undefined
    extraDirectionInfo?: {
      north?: GameMapCoordinate;
      east?: GameMapCoordinate;
      south?: GameMapCoordinate;
      west?: GameMapCoordinate;
    };
  }

  // NOTE: Any id for a possible area should be added to this union.
  export type AreaId = MapLocation | MapSubLocation;
  interface CardinalDirType<T> {
    north?: T;
    east?: T;
    south?: T;
    west?: T;
  }
  export type CardinalDirAndDistanceType<T> = CardinalDirType<{
    area: T;
    distance?: number /* Default to 0 or the previous value if not given */;
  }>;
  type DirectionData = CardinalDirAndDistanceType<MapChildData>;
  // This just gives the bare essential data for a single location / sub-location without it's connections
  export interface GenericLocationData {
    name?: string;
    description?: string;
    id: AreaId;
  }
  export interface MapChildData {
    locData: GenericLocationData;
    directions?: DirectionData;
    flags?: MapChildDataFlags;
  }

  export type LocationObject = {
    [nameOfLocation in MapLocation]?: GameLocation;
  };

  export type LocationCoords = [x: number, y: number, z?: number];

  // The game map would be a 2d/3d array to store all 3 possible coords for locations or sub locations. The id's for the respective location/sub locations are stored in the spot that their coords point to
  // NOTE - Any locations/sub locations that can be navigated to via north, east, south or west directions must share the same axis, i.e the x axis in east/ west and y axis in north/south.
  // NOTE - The first array represents the x axis, the second represents the y axis and the third (if present) represents the z axis
  // REVIEW - I doubt these have any more use :/
  export type GameMapForLocations<Size extends number> = GameMapTuple<
    GameMapTuple<GameMapTuple<number, Size>, Size>,
    Size
  >; // 3d array
  export type GameMapForSubLocations<Size extends number> = GameMapTuple<
    GameMapTuple<number, Size>,
    Size
  >; // 2d array
  export type GameMapTuple<Coord, AxisLength extends number> = [
    Coord,
    ...Coord[]
  ] & {
    length: AxisLength;
  };

  // General type for stuff that can expect either
  export type GameMap<Size extends number> =
    | GameMapForLocations<Size>
    | GameMapForSubLocations<Size>;
  // type GameMapTuple<Coord> = GameMapTupleType<Coord, 100>

  // For grouping related locations under a single id
  export type RelatedMapLocations = {
    [key in MapLocationContainer]: {
      name: string;
      generalCoords: LocationCoords;
      relatedLocations: MapLocation[];
    };
  };

  export type SvgString = string;
}
