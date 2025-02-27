import type { Region, SubRegion, Location, SubLocation } from './classes'
import type {
  GlobalMapId,
  LocationId,
  RegionId,
  SubLocationId,
  SubRegionId,
} from './enums'

// NOTE: Any id for a possible area should be added to this union.
export type AreaId =
  | LocationId
  | SubLocationId
  | SubRegionId
  | RegionId
  | GlobalMapId
export type AreaUniqueId =
  `${GlobalMapId}_${RegionId}_${SubRegionId}_${LocationId}_${SubLocationId}`
export type SubAreas = Region | SubRegion | Location | SubLocation
export type Coords = { x: number; y: number; z: number }

export type SvgString = string
