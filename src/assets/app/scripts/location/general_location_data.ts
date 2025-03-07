import { Direction, SubLocationId } from './enums'
// TODO: Rename this file
export const backupPassageName = 'Backup_Passage'
export const oppositeDirection = {
  [Direction.NORTH]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.NORTH,
  [Direction.EAST]: Direction.WEST,
  [Direction.WEST]: Direction.EAST,
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
} as const
