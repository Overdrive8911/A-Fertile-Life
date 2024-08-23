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
          let relativeXIndex = getEffectiveCoordInGameMap(
            subLocationCoords[LocationCoordIndex.X],
            gGameMapSubLocationArraySize
          );
          let relativeYIndex = getEffectiveCoordInGameMap(
            subLocationCoords[LocationCoordIndex.Y],
            gGameMapSubLocationArraySize
          );

          mapOfSubLocations[relativeXIndex][relativeYIndex] = subLocationId;
        }
      }
    }
  }
}

let lastSVGTranslateOffset = { x: 0, y: 0 };
// NOTE - `defaultZoomLevel` requires `shouldChangeDefaultZoomLevel` to be true to work
function loadGameMap(
  locationId: MapLocation,
  mapArea: JQuery<HTMLElement>,
  includeZoomButtons = true,
  shouldChangeDefaultZoomLevel = true,
  defaultZoomLevel: number = null
) {
  const attrToDenoteIfMapHasLoaded = "has-map-loaded";
  const attrValue = "true";
  // If the map is already loaded, do nothing
  if (mapArea.attr(attrToDenoteIfMapHasLoaded) == attrValue) return;

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

  // SECTION - For the panning
  let transformOffset: { x: number; y: number } = { x: 0, y: 0 };
  const imagePanning = (area: JQuery<HTMLElement>) => {
    let isPan = false;
    let initialCoords: { x: number; y: number } = {
      x: 0,
      y: 0,
    };

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

        // Copy away the last transform offset. It will be used to ensure a smother flow during map navigation
        lastSVGTranslateOffset = { x: transformOffset.x, y: transformOffset.y };
      })
      .on("dragstart", () => {
        // Stop the image from being draggable
        return false;
      });
  };
  imagePanning(mapArea.children("svg") as any);

  // For displaying a mini player sprite on the right sub location
  const isParentUIDialog = mapArea.parent()[0] == $("#ui-dialog")[0];
  const isParentMapPopout =
    mapArea.parent()[0] == $(".ui-side-bar-popout-map")[0];
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

    // SECTION - The function to spawn the sprite on the path
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

      // Copy over the image in the svg to a new image object and get the natural width and height there
      const svgMainImg = mapArea.children("svg").children("image");
      const newImgCopy = new Image();
      newImgCopy.src =
        svgMainImg.attr("xlink:href") != undefined
          ? svgMainImg.attr("xlink:href")
          : svgMainImg.attr("href");

      const naturalImgWidth = newImgCopy.naturalWidth;
      const naturalImgHeight = newImgCopy.naturalHeight;

      // const playerSpriteWidthInPercent = 7;
      const playerSpriteDimensionInPixels = 16; // It's a square
      let svgPlayerSpriteDimension =
        (playerSpriteDimensionInPixels /
          ((naturalImgWidth + naturalImgHeight) / 2)) *
        ((viewBoxWidth + viewBoxHeight) / 2);

      svgPlayerSpriteDimension =
        width < height
          ? svgPlayerSpriteDimension > width
            ? width * 0.75
            : svgPlayerSpriteDimension
          : svgPlayerSpriteDimension > height
          ? height * 0.75
          : svgPlayerSpriteDimension;

      mapArea.children("svg").append(
        `<svg version="1.1" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}" x="${x}" y="${y}">
          <image x="${x}" y="${y}" width="${svgPlayerSpriteDimension}" href="assets/img/map/icons/player_map_sprite.webp" class='pixel-art' id = '${gPlayerMapSpriteId}'/>
        </svg>`
      );

      // To center the image, get half of the difference between the image's bounding box (height and width) and the svg's/original path's
      const playerMapSprite = mapArea.find(`#${gPlayerMapSpriteId}`);
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
    // This observer will make sure that the map for the player sprite has its dimensions ready
    const playerMapSpriteSpawnObserver = new ResizeObserver(() => {
      if (
        mapArea.children("svg")[0].getBoundingClientRect().width != 0 &&
        mapArea.children("svg")[0].getBoundingClientRect().height != 0
      ) {
        spawnPlayerSpriteOnMap();

        const ensureCorrectPlayerSpriteDimensions = new ResizeObserver(() => {
          if (
            mapArea.find(`#${gPlayerMapSpriteId}`)[0].getBoundingClientRect()
              .width != 0 &&
            mapArea.find(`#${gPlayerMapSpriteId}`)[0].getBoundingClientRect()
              .height != 0
          ) {
            setInitialZoomLvl(mapArea.children("svg") as any);
            centerMapOnPlayerSprite(mapArea.children("svg") as any);
            ensureCorrectPlayerSpriteDimensions.disconnect();
          }
        });

        ensureCorrectPlayerSpriteDimensions.observe(mapArea[0]);

        playerMapSpriteSpawnObserver.disconnect();
      }
    });

    // SECTION - The function to set the initial zoom level of the map as well as adjust the view to the player's sprite
    const minPlayerMapSpriteSize = 32; // in px. This is the minimum size that the player sprite should be when the map is opened. Use transform() to get a value close to this
    const setInitialZoomLvl = (
      element: JQuery<HTMLElement> /* Give it the svg/img */,
      elementContainer?: JQuery<HTMLElement>
    ) => {
      // Note that the player's sprite should be roughly a square
      const playerMapSpriteDimensions = element
        .find(`#${gPlayerMapSpriteId}`)[0]
        .getBoundingClientRect();

      if (playerMapSpriteDimensions.width < minPlayerMapSpriteSize) {
        const rawTransformValue =
          minPlayerMapSpriteSize / playerMapSpriteDimensions.width;
        const roundedTransformValue = Math.round(rawTransformValue);

        if (defaultZoomLevel == null) {
          // The aim is to get a transform value like 2, 2.5, 3, 3.5, 4, 4.5, etc
          if (roundedTransformValue > rawTransformValue) {
            // rounded up so our answer is roundedTransformValue - 0.5
            element.css("transform", `scale(${roundedTransformValue - 0.5})`);
            if (isParentMapPopout)
              gMapPopoutZoomLvl = roundedTransformValue - 0.5;
          } else {
            element.css("transform", `scale(${roundedTransformValue})`);
            if (isParentMapPopout) gMapPopoutZoomLvl = roundedTransformValue;
          }
        } else {
          // Use the default zoom level given to scale
          element.css("transform", `scale(${defaultZoomLevel})`);
          if (isParentMapPopout) gMapPopoutZoomLvl = defaultZoomLevel;
        }
      }
    };

    const centerMapOnPlayerSprite = (
      element: JQuery<HTMLElement> /* Give it the svg/img */
    ) => {
      // Translate the view from the center of the map to the center of player's sprite
      const elementCenterDimensions = element[0].getBoundingClientRect();
      const mapCenter = {
        x: elementCenterDimensions.x + elementCenterDimensions.width / 2,
        y: elementCenterDimensions.y + elementCenterDimensions.height / 2,
      };
      const newPlayerMapSpriteDimensions = element
        .find(`#${gPlayerMapSpriteId}`)[0]
        .getBoundingClientRect();
      const playerMapSpriteCenter = {
        x:
          newPlayerMapSpriteDimensions.x +
          newPlayerMapSpriteDimensions.width / 2,
        y:
          newPlayerMapSpriteDimensions.y +
          newPlayerMapSpriteDimensions.height / 2,
      };

      element.css(
        "translate",
        `${mapCenter.x - playerMapSpriteCenter.x}px ${
          mapCenter.y - playerMapSpriteCenter.y
        }px`
      );

      // Alter the transform offset for the panning else it'll jump back to the middle when the user tries to pan
      transformOffset = {
        x: mapCenter.x - playerMapSpriteCenter.x,
        y: mapCenter.y - playerMapSpriteCenter.y,
      };
    };

    // If there's a transition, then this event handler should take care of it
    if (mapArea.css("transition") == "" || mapArea.css("transition") == "all") {
      if (defaultZoomLevel != null) {
        // Set the zoom level instantly instead of waiting for the setTimeout
        mapArea.children("svg").css("transform", `scale(${gMapPopoutZoomLvl})`);

        // Set the translate value of the newly made svg to the previous one (to look smoother when eventually overwritten by the settimeout function
        mapArea
          .children("svg")
          .css(
            "translate",
            `${lastSVGTranslateOffset.x}px ${lastSVGTranslateOffset.y}px`
          );
      }

      playerMapSpriteSpawnObserver.observe(mapArea[0]);
    } else {
      // This should be long enough to get values close enough
      mapArea.one("transitionend", () => {
        playerMapSpriteSpawnObserver.observe(mapArea[0]);
      });
    }
  }

  // Set an attribute to denote that the map has been loaded (don't do this for any dialog though)
  if (!isParentUIDialog) mapArea.attr(attrToDenoteIfMapHasLoaded, attrValue);
}
