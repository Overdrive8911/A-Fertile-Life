## Basic Components
Every possible area the player can navigate to can be denoted by its location and (optional) sub location. A location, for the most part, represents a group of related sub locations although, this is not required (e.g special areas that the player navigates in and out but can't explore). These sub locations represent a smaller "more general-purpose room" in the location, it could be a hallway or a bedroom or an office or whatever. For example, the player's house could be a location, while the bathroom, living room, dining room and porch could be its sub locations. Every location and sub location is defined as an id in `MapLocation` and `MapSubLocation` enums respectively.

## How the location and sub location ids are used
A lot of components, like the map and navigation buttons, rely on data indexed by location and sub location ids. The most important of which is:

### `gLocationData`
It's a large object consisting of sub-objects which contain important data for each location, as well as the sub locations within it. For a location, the data includes a name, a array of 2 to 3 coordinates on the X/Y/Z axis in respect to other locations, an optional sub-object that stores its sub locations, an optional 2d array that serves as the map for its sub locations, and an optional array containing the lowest coordinates from the aforementioned sub locations.

The latter of which, consists of an optional name (which will be auto-generated at runtime if not present), an array of 2 coordinates on the X/Y axis, and an optional object with direction data that determines if a direction is blocked or not