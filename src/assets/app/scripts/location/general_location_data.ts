import { SubLocationId } from './enums'
// TODO: Rename this file

function getUrl(subLocation: string) {
  return `/media/img/map/icons/sub_location/${subLocation}.webp`
}

// Stores relative urls to the icons for sub locations
// NOTE - Add the urls of sub locations with mini icons here. Use lowercase
export const gSubLocationIcons24x24: { [key in SubLocationId]?: string } = {
  [SubLocationId.DUMMY]: getUrl('dummy'),

  [SubLocationId.RECEPTION]: getUrl('reception'),

  [SubLocationId.HALLWAY_1]: getUrl('hallway'),
  [SubLocationId.HALLWAY_2]: getUrl('hallway'),
  [SubLocationId.HALLWAY_3]: getUrl('hallway'),
  [SubLocationId.HALLWAY_4]: getUrl('hallway'),
  [SubLocationId.HALLWAY_5]: getUrl('hallway'),
  [SubLocationId.HALLWAY_6]: getUrl('hallway'),
  [SubLocationId.HALLWAY_7]: getUrl('hallway'),

  [SubLocationId.PHARMACY_1]: getUrl('pharmacy'),
  [SubLocationId.PHARMACY_2]: getUrl('pharmacy'),

  [SubLocationId.PORCH]: getUrl('porch'),

  [SubLocationId.CORRIDOR_1]: getUrl('corridor'),
  [SubLocationId.CORRIDOR_2]: getUrl('corridor'),
  [SubLocationId.CORRIDOR_3]: getUrl('corridor'),

  [SubLocationId.ROOM_1]: getUrl('room'),
  [SubLocationId.ROOM_2]: getUrl('room'),
  [SubLocationId.ROOM_3]: getUrl('room'),
  [SubLocationId.ROOM_4]: getUrl('room'),
  [SubLocationId.ROOM_5]: getUrl('room'),

  [SubLocationId.LAB]: getUrl('lab'),

  [SubLocationId.CONSULTATION]: getUrl('consultation'),

  [SubLocationId.OFFICE_WORK]: getUrl('office_work'),

  [SubLocationId.MEASUREMENT_CLOSET]: getUrl('measurement_closet'),

  [SubLocationId.PLAYER_ROOM]: getUrl('room'),
  [SubLocationId.BEDROOM]: getUrl('bedroom'),
  [SubLocationId.BATHROOM]: getUrl('bathroom'),
  [SubLocationId.LIVING_ROOM]: getUrl('living_room'),
}
