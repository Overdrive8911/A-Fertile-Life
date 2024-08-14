// Get the appropriate image for a subLocation
function getSubLocationMapImage(subLocation: MapSubLocation) {
  // Assume the sub location we're dealing with is HALLWAY_2

  // We'll have "HALLWAY_2" here
  const rawSubLocationString = MapSubLocation[subLocation];

  // Check if there's a number immediately after an underscore at the end of the string. It just means that the sub location is a "duplicate". Henceforth, they'd share the same image.
  const regexp = /(?<=[A-Z])_\d+$/;
  // We'll have "HALLWAY" here
  const splitSubLocationString = rawSubLocationString.split(regexp)[0];

  const img = new Image();
  img.src = `assets/img/map/sub_location/${splitSubLocationString.toLocaleLowerCase()}.webp`;

  // TODO - Check if the image is valid. If true, return the appropriate src else return the dummy image
  return `assets/img/map/sub_location/${splitSubLocationString.toLocaleLowerCase()}.webp`;
}

function populateSubLocationMap(location: MapLocation) {
  if (!setup.locationData[location].subLocationMap) {
    // Create an empty array first and set its length to the `GameMapArraySize`
    setup.locationData[location].subLocationMap =
      [] as any as GameMapForSubLocations<typeof gGameMapSubLocationArraySize>;
    setup.locationData[location].subLocationMap.length =
      gGameMapSubLocationArraySize;

    let mapOfSubLocations = setup.locationData[location].subLocationMap;

    // Fill the sub location map with "empty" elements
    for (let x = 0; x < gGameMapSubLocationArraySize; x++) {
      // let yAxis = mapOfSubLocations[x];

      if (mapOfSubLocations[x] == undefined) {
        // Initialize an empty sub array
        mapOfSubLocations[x] = [] as any as GameMapTuple<
          number,
          typeof gGameMapSubLocationArraySize
        >;
        mapOfSubLocations[x].length = gGameMapSubLocationArraySize;

        for (let y = 0; y < gGameMapSubLocationArraySize; y++) {
          mapOfSubLocations[x][y] = GameMapCoordinate.EMPTY;
        }
      }
    }

    // Store the sub locations in this map using their coordinates
    // NOTE - The sub locations will be added to the map in relative to the center of the map i.e `GameMapSubLocationArraySize/2`
    for (const id in setup.locationData[location].subLocations) {
      if (
        Object.prototype.hasOwnProperty.call(
          setup.locationData[location].subLocations,
          id
        )
      ) {
        if (parseInt(id) != undefined) {
          const subLocationId = parseInt(id) as MapSubLocation;
          const subLocationCoords =
            setup.locationData[location].subLocations[subLocationId].coords;

          // Get the relative indexes and make sure they aren't out of bounds. Please do not allow the latter to happen. This check I'm doing for it is to prevent the game from erroring out.
          let relativeXIndex =
            Math.abs(
              subLocationCoords[LocationCoordIndex.X] +
                gGameMapSubLocationArraySize / 2
            ) % gGameMapSubLocationArraySize;
          let relativeYIndex =
            Math.abs(
              subLocationCoords[LocationCoordIndex.Y] +
                gGameMapSubLocationArraySize / 2
            ) % gGameMapSubLocationArraySize;

          mapOfSubLocations[relativeXIndex][relativeYIndex] = subLocationId;
        }
      }
    }
  }
}

function loadGameMap(
  locationId: MapLocation,
  mapArea: JQuery<HTMLElement>,
  includeZoomButtons = true
) {
  // Copy away the zoom buttons and their events (they'll be added back at the end)
  const mapButtonBar = $(".ui-side-bar-popout-map-button-bar").clone(true);

  // Load up the map by copying the svg contents of the corresponding map into the map popout section (clear the previous contents first)
  mapArea.empty();

  // Set a default image for locations without a custom image/sub locations
  let mapData = `<img src="assets/img/map/location/default.webp" class="pixel-art" style="width:inherit; height:auto;"/>`;
  if (
    gLocationMapSvgTable[locationId] &&
    setup.locationData[locationId].subLocations
  )
    mapData = gLocationMapSvgTable[locationId];

  // By default, the zoom buttons will be included
  if (includeZoomButtons) mapArea.append(mapData).append(mapButtonBar);
  else mapArea.append(mapData);

  // For the panning
  const imagePanning = (area: JQuery<HTMLElement>) => {
    let isPan = false;
    let initialCoords: { x: number; y: number } = { x: 0, y: 0 };
    let transformOffset: { x: number; y: number } = { x: 0, y: 0 };

    // PointerEvent.movementX/movementY wasn't working for some reason so :p

    area
      .on("pointerdown" as any, (e: PointerEvent) => {
        e.preventDefault();
        isPan = true;
        initialCoords.x = e.clientX - transformOffset.x;
        initialCoords.y = e.clientY - transformOffset.y;
      })
      .on("pointermove" as any, (e: PointerEvent) => {
        if (!isPan) return;

        transformOffset.x = e.clientX - initialCoords.x;
        transformOffset.y = e.clientY - initialCoords.y;
        area.css("translate", `${transformOffset.x}px ${transformOffset.y}px`);
      })
      .on("pointerup", () => {
        isPan = false;
      })
      .on("dragstart", () => {
        // Stop the image from being draggable
        return false;
      });
  };
  imagePanning(mapArea.children("svg") as any);
}
