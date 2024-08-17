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

  // For displaying a mini player sprite on the right sub location
  const subLocation: MapSubLocation =
    variables().player.locationData.subLocation;
  // Check whether the sub location and it's entry exist
  if (
    subLocation != undefined &&
    setup.locationData[locationId].subLocations[subLocation] != undefined
  ) {
    // In our svg map, all the paths are given text values like "HALLWAY_2" or "RECEPTION". These will be used to determine what path/area to display the player sprite

    // Find the required path
    const subLocationString = MapSubLocation[subLocation];
    const path = mapArea.find(`path#${subLocationString}`);

    if (path.length == 0) {
      console.error(
        `There is no path in the map with an id matching "${subLocationString}"`
      );
      return;
    }

    // The function to spawn the sprite on the path
    const spawnPlayerSpriteOnMap = () => {
      const mapDimensions = mapArea.children("svg")[0].getBoundingClientRect();
      const pathDimensions = path[0].getBoundingClientRect();

      // Get the view box dimensions too
      const viewBoxWidth = parseFloat(
        mapArea.children("svg").attr("viewBox").split(" ")[2]
      );
      const viewBoxHeight = parseFloat(
        mapArea.children("svg").attr("viewBox").split(" ")[3]
      );

      // Get the x, y, width and height for the nested <svg>. I could've used <foreignObject> instead but for some reason it kept on messing up the position of my image
      let x =
        ((pathDimensions.left - mapDimensions.left) / mapDimensions.width) *
        viewBoxWidth;
      let y =
        ((pathDimensions.top - mapDimensions.top) / mapDimensions.height) *
        viewBoxHeight;
      let width = (pathDimensions.width / mapDimensions.width) * viewBoxWidth;
      let height =
        (pathDimensions.height / mapDimensions.height) * viewBoxHeight;

      mapArea.children("svg").append(
        `<svg version="1.1" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}" x="${x}" y="${y}">
          <image x="${x}" y="${y}" width="50%" height="auto" href="assets/img/map/icons/player_map_sprite.webp" class='pixel-art' />
        </svg>`
      );

      // To center the image, get half of the difference between the image's bounding box (height and width) and the svg's/original path's
      const playerMapSprite = mapArea
        .children("svg")
        .children("svg")
        .children("image");
      const playerMapSpriteDimensions =
        playerMapSprite[0].getBoundingClientRect();

      const imageX =
        ((pathDimensions.width - playerMapSpriteDimensions.width) /
          2 /
          pathDimensions.width) *
          width +
        x;
      const imageY =
        ((pathDimensions.height - playerMapSpriteDimensions.height) /
          2 /
          pathDimensions.height) *
          height +
        y;

      // Now center it
      playerMapSprite.attr("x", imageX);
      playerMapSprite.attr("y", imageY);

      // Ensure that if the current path has a text as its sibling, remove it. It'll be displayed in the passage
      // NOTE - This assumes that related text and path are grouped (honestly, this should be expected)
      if (path.siblings("text").length == 1) {
        path.siblings("text").detach();
      }

      // "Reload" the map after changes
      mapArea.children("svg").html(mapArea.children("svg").html());
    };

    // If there's a transition, then this event handler should take care of it
    if (mapArea.css("transition") == "") {
      spawnPlayerSpriteOnMap();
    } else {
      // This should be long enough to get values close enough
      mapArea.one("transitionend", () => {
        spawnPlayerSpriteOnMap();
      });
    }
  }
}
