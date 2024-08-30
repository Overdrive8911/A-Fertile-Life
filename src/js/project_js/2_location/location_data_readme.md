# Date and Time

## How It Works

- Every passage that exists in a location has a tag for that location (and a sub-location if the location has multiple sections e.g The "location_player_house" location would have sub locations like "subLocation_kitchen", "subLocation_bedroom", etc).
- All locations will be stored in an object that contains the name of the location as well as its co-ordinates on the global map.
- Using the co-ordinates of locations on the global map, a calculated amount of minutes will be consumed when the player moves from one to another. The same goes for sub-locations in a single location, however the time taken is much lower.
- Locations with coordinates of [0, 0] are not available on the map and are special, e.g dreams, fast travel, etc.

## How co-ordinates are calculated into distance

- Using the formula to calculate the shortest distance between 2 points, the result is then multiplied by a value randomly between (0.85 metres and 1.15 metres).
- Note that the coordinates of close sub-locations should be designed in a way that consumes 10 to 20 seconds.
- This distance is then evaluated with the movement speed of the PC into the time taken. This time is then added to the global time.

## Stuff that affect it

- Moving from location/sub-location consumes energy if done on foot/bicycle.
- Once the player's energy goes below 40%, their travel time on foot/bicycle increases by a bit with every extra reduction in energy.
- Once below 15% energy, the player is warned to seek rest or food.
- Reaching 0 energy will cause the player to black out and wake up wherever, most likely losing a bunch of their items.
- It is assumed that the player walks from a location/sub-location to another location/sub-location. Conditions can affect the time taken.
- The player is also capable of running however, it consumes more energy.
- Using transportation like a car or bus reduces the amount taken to move through locations by a random percentage within a set range. This range can be affected by various factors.

## How sub location co-ordinates are calculated on the map

* Sub locations have a `24x24` image that will be displayed (see `export/assets/img/map/sub_location/`for all the available images and `export\assets\img\map\sub_location_map_example.webp` for an example of how it'd look for the ground floor of Fertilo Inc)
* A large canvas would be created (`1200x1200`), the center of which will be used as the new origin for the coordinates of the sub locations (i.e so a sublocation with coordinates, `[6, 7]` would be rendered at `[606, 607]`)
* A connector line would be drawn from the center of each sub location to the other sub location referenced in the former's `nav_locations` member. A sub location can have, at most, 4 connectors in each of the cardinal directions.
