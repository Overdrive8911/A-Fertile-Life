namespace NSLocation {
  // SECTION - For everything belonging to the map
  $(document).on(":passageend", () => {
    // Load the map whenever the side bar button for the map is clicked
    $("#ui-side-bar-toggle-map-button").on("click", function () {
      // Don't question this. It works
      if ($("#ui-side-bar-action-interface").hasClass("stowed")) {
        loadGameMap(
          variables().player.locationData.location,
          $(".ui-side-bar-popout-map")
        );
      }
    });
    $(document)
      .off("keyup.map")
      .on("keyup.map", function (e) {
        if (e.key.toLocaleLowerCase() == "z") {
          if ($("#ui-side-bar-action-interface").hasClass("stowed")) {
            loadGameMap(
              variables().player.locationData.location,
              $(".ui-side-bar-popout-map")
            );
          }
        }
      });

    const getZoomRatio = (element: JQuery<HTMLElement>) => {
      // Check the transform value on the svg (It should be a scaled value i.e "matrix(2, 0, 0, 2, 0, 0)" corresponds with scale(2) ). If the property doesn't exist or if it's less than 1, default to 1
      // NOTE - Index 3 in "matrix(2, 0, 0, 2, 0, 0)" will be 2, which is the number that is currently being scaled by
      return $(element).css("transform") != "none"
        ? parseFloat($(element).css("transform").split(",")[3]) >= 1
          ? parseFloat($(element).css("transform").split(",")[3])
          : 1
        : 1;
    };

    const zoomMap = (element: JQuery<HTMLElement>, amountToZoom: number) => {
      // Make sure the scale value doesn't go below 1
      element.css(
        "transform",
        `scale(${
          getZoomRatio(element) + amountToZoom > 1
            ? getZoomRatio(element) + amountToZoom
            : 1
        })`
      );

      if (element[0] == $(".ui-side-bar-popout-map > svg")[0]) {
        // Note that `element` represents the svg/image getting zoomed
        gMapPopoutZoomLvl = getZoomRatio(element);
      }
    };

    // Handlers for the zooming functionality of the map popout
    $(".ui-side-bar-popout-map-button-bar > .button-zoom-in").ariaClick(() => {
      // Check if the dialog for "Large View" is open
      if (!Dialog.isOpen("map-large-view")) {
        // Increment the zoom ratio by 0.5
        zoomMap($(".ui-side-bar-popout-map > svg"), 0.5);
      } else {
        // Do the same but for the large view of the map
        zoomMap($(".map-large-view > svg"), 0.5);
      }
    });
    $(".ui-side-bar-popout-map-button-bar > .button-zoom-out").ariaClick(() => {
      // Check if the dialog for "Large View" is open
      if (!Dialog.isOpen("map-large-view")) {
        // Decrement the zoom ratio by 0.5
        zoomMap($(".ui-side-bar-popout-map > svg"), -0.5);
      } else {
        // Do the same for the large view of the map
        zoomMap($(".map-large-view > svg"), -0.5);
      }
    });

    // For handling the "Large View" functionality (it just displays the map in a large dialog)
    $(".ui-side-bar-popout-map-button-bar > .button-large-view").ariaClick(
      () => {
        Dialog.setup("Large View", "map-large-view");
        // Add dummy data
        Dialog.append("");
        Dialog.open();

        // Load the map into here
        loadGameMap(
          variables().player.locationData.location,
          $(".map-large-view")
        );
      }
    );

    // Preload the player sprite. If not, the function that centers it in a path may end up positioning it wrong
    let preloadImage: HTMLImageElement = null;
    if (!preloadImage) {
      preloadImage = new Image();
      preloadImage.src = gPlayerMapSpriteSrc;
    }
  });
  // !SECTION

  // SECTION - For everything relating to the location/subLocation display that resides right below the top bar
  $(document).on(":passageend", () => {
    // Update the name of the location/sub location shown in "#ui-top-bar-current-location-view". An attribute "is-location-name" will store whether what is displayed is "true" or "false"
    const element = $("#ui-top-bar-current-location-view");
    const attrName = "is-location-name";

    const setSubLocationName = () => {
      element.text(
        getDefaultNameOfSubLocation(
          variables().player.locationData.location,
          variables().player.locationData.subLocation
        )
      );
      element.attr(attrName, "false");
    };
    const setLocationName = () => {
      element.text(
        setup.locationData[
          variables().player.locationData.location as MapLocation
        ].name
      );
      element.attr(attrName, "true");
    };

    if (
      setup.locationData[
        variables().player.locationData.location as MapLocation
      ].subLocations
    ) {
      setSubLocationName();
    } else {
      setLocationName();
    }

    // Add a handler to the element so that when clicked, it will alternate between the location's name and sub location's name
    element.ariaClick(() => {
      if (element.attr(attrName) == "true") {
        // The location's name is currently displayed so try to display the sub location (if any)
        if (
          setup.locationData[
            variables().player.locationData.location as MapLocation
          ].subLocations
        ) {
          setSubLocationName();
        }
      } else if (element.attr(attrName) == "false") {
        // The sub location's name is currently displayed so display it's location
        setLocationName();
      }
    });
  });
  // !SECTION

  // SECTION - For everything relating to the navigational buttons and the text displayed at the bottom of any "default" tagged passage
  $(document).on(":passageend", () => {
    const northButton = $("#ui-navigation-option-button-north");
    const eastButton = $("#ui-navigation-option-button-east");
    const southButton = $("#ui-navigation-option-button-south");
    const westButton = $("#ui-navigation-option-button-west");

    const currLocation = variables().player.locationData
      .location as MapLocation;
    const currSubLocation = variables().player.locationData
      .subLocation as MapSubLocation;

    // The copies of `lastWarpDestination` will be used for the bottom text displayed at the bottom of every "default" tagged passage
    const isNorthNavigable = isNavigationButtonUsable(GameMapDirection.NORTH);
    const northAreaId = lastWarpDestination;
    const isEastNavigable = isNavigationButtonUsable(GameMapDirection.EAST);
    const eastAreaId = lastWarpDestination;
    const isSouthNavigable = isNavigationButtonUsable(GameMapDirection.SOUTH);
    const southAreaId = lastWarpDestination;
    const isWestNavigable = isNavigationButtonUsable(GameMapDirection.WEST);
    const westAreaId = lastWarpDestination;
    console.warn("CHECKED ALL NAVIGATION BUTTONS FOR THEIR USABILITY.");

    const navigate = (direction: GameMapDirection) => {
      navigateInDirectionOnMap(direction, currLocation, currSubLocation);
    };

    // Click Events
    northButton.ariaClick(() => {
      navigate(GameMapDirection.NORTH);
    });
    eastButton.ariaClick(() => {
      navigate(GameMapDirection.EAST);
    });
    southButton.ariaClick(() => {
      navigate(GameMapDirection.SOUTH);
    });
    westButton.ariaClick(() => {
      navigate(GameMapDirection.WEST);
    });

    // Key Events
    $(document)
      .off("keyup.navigation_buttons") // To prevent multiple handlers from getting attached
      .on("keyup.navigation_buttons", (e) => {
        if (e.key.toLocaleLowerCase() == "w" && isNorthNavigable)
          navigate(GameMapDirection.NORTH);
      })
      .on("keyup.navigation_buttons", (e) => {
        if (e.key.toLocaleLowerCase() == "d" && isEastNavigable)
          navigate(GameMapDirection.EAST);
      })
      .on("keyup.navigation_buttons", (e) => {
        if (e.key.toLocaleLowerCase() == "s" && isSouthNavigable)
          navigate(GameMapDirection.SOUTH);
      })
      .on("keyup.navigation_buttons", (e) => {
        if (e.key.toLocaleLowerCase() == "a" && isWestNavigable)
          navigate(GameMapDirection.WEST);
      });

    const navButtonUsabilityActions = (
      canMoveInDirection: boolean,
      button: JQuery<HTMLElement>
    ) => {
      if (!canMoveInDirection) {
        button.prop("disabled", true);
        button.css("filter", "brightness(45%)").css("pointer-events", "none");
      } else {
        button.prop("disabled", false);
      }
    };

    // if `isNavigationButtonUsable()` is true for a direction, disable the respective button and dim the colors
    navButtonUsabilityActions(isNorthNavigable, northButton);
    navButtonUsabilityActions(isEastNavigable, eastButton);
    navButtonUsabilityActions(isSouthNavigable, southButton);
    navButtonUsabilityActions(isWestNavigable, westButton);

    // SECTION - Code to handle displaying helpful text at the bottom of an eligible passage
    // Display a text, with a horizontal line above to section it away, at the bottom of every passage with a default tag that will tell the player what places the directions accessible lead to. The places in question will be highlighted. Note that the text should be randomly chosen from an array. E.g From {CURR_LOCATION}, you can head {east} to {EAST_LOCATION} or perhaps {south} to {SOUTH_LOCATION}. You're pretty sure that {WEST_LOCATION} is in the {west} and {NORTH_LOCATION} is in the {north}
    if (Story.get(passage()).tags.includes("default")) {
      // TODO - Add *proper* support for regular locations
      const isLocationOrSubLocationValid = (
        locationOrSubLocation: MapLocation | MapSubLocation | null
      ) => {
        if (locationOrSubLocation == null || locationOrSubLocation == undefined)
          return false;

        return true;
      };

      // Only accounting for sub locations here
      let closestLocationOrSubLocation: {
        [key in GameMapDirection]: MapLocation | MapSubLocation | null;
      } = {
        [GameMapDirection.NORTH]: northAreaId.subLocation,
        [GameMapDirection.EAST]: eastAreaId.subLocation,
        [GameMapDirection.SOUTH]: southAreaId.subLocation,
        [GameMapDirection.WEST]: westAreaId.subLocation,
      };
      let numOfValidLocationsOrSubLocations = 1; // The 1 stands for the current location/sub location

      // Remove invalid entries and get the number of valid locations/sub locations
      for (const key in closestLocationOrSubLocation) {
        if (
          Object.prototype.hasOwnProperty.call(
            closestLocationOrSubLocation,
            key
          )
        ) {
          const direction = parseInt(key) as GameMapDirection;
          // TODO - Add better support for locations
          if (
            !isLocationOrSubLocationValid(
              closestLocationOrSubLocation[direction]
            )
          )
            delete closestLocationOrSubLocation[direction];
          else numOfValidLocationsOrSubLocations++;
        }
      }

      // Below is an array containing multiple sub arrays. Each sub array is split into 5 parts, to deal with a 4 possible location/sub location as well as the current location/sub location. One of sub arrays will be selected at random and appended to the end of the current passage ()
      let CURR_LOCATION = "CURRENT_LOCATION";
      let LOCATION = {
        1: {
          direction: "LOCATION_DIRECTION_1",
          locOrSubLocName: "LOCATION_NAME_1",
        },
        2: {
          direction: "LOCATION_DIRECTION_2",
          locOrSubLocName: "LOCATION_NAME_2",
        },
        3: {
          direction: "LOCATION_DIRECTION_3",
          locOrSubLocName: "LOCATION_NAME_3",
        },
        4: {
          direction: "LOCATION_DIRECTION_4",
          locOrSubLocName: "LOCATION_NAME_4",
        },
      };

      const greenColorClass = "otherSpeech";
      const orangeColorClass = "playerStatNeutral";
      const returnGreenText = (text: string) => {
        return `<span class=${greenColorClass}>${text}</span>`;
      };
      const returnOrangeText = (text: string) => {
        return `<span class=${orangeColorClass}>${text}</span>`;
      };
      /* NOTE 
  - No need to add unnecessary/messy whitespace 
  - Make sure that there is a punctuation at the end of each string (since if it will be the last string to be concatenated, the last character (i.e the punctuation) would be replaced with a period)
  */
      const possibleHelpfulTextArray: string[][] = [
        [
          `From ${CURR_LOCATION},`,

          `you can head ${LOCATION[1].direction} to ${LOCATION[1].locOrSubLocName},`,

          `or perhaps ${LOCATION[2].direction} to ${LOCATION[2].locOrSubLocName}.`,

          `You're pretty sure that ${LOCATION[3].locOrSubLocName} is in the ${LOCATION[3].direction},`,

          `and ${LOCATION[4].locOrSubLocName} is in the ${LOCATION[4].direction}.`,
        ],
        [
          `Currently, you're in ${CURR_LOCATION},`,

          `${LOCATION[1].locOrSubLocName} is ${LOCATION[1].direction} of here,`,

          `while ${LOCATION[2].locOrSubLocName} is likely ${LOCATION[2].direction}.`,

          `${LOCATION[3].locOrSubLocName} is definitely ${LOCATION[3].direction},`,

          `with ${LOCATION[4].locOrSubLocName} in the ${LOCATION[4].direction}.`,
        ],
        [
          `If you were to leave ${CURR_LOCATION},`,

          `${LOCATION[1].locOrSubLocName} is to the ${LOCATION[1].direction},`,

          `and ${LOCATION[2].locOrSubLocName}, ${LOCATION[2].direction}.`,

          `${LOCATION[3].locOrSubLocName} goes in the ${LOCATION[3].direction},`,

          `while ${LOCATION[4].locOrSubLocName} is ${LOCATION[4].direction}.`,
        ],
      ];

      // A function to randomly pick an entry in `possibleHelpfulTextArray[]` and fill in the variables
      const returnUpdatedRandomEntry = () => {
        // Get a random entry
        let randomEntry = possibleHelpfulTextArray.pluck();

        // Depending on the number of valid directions, reduce the size of the innermost array to match e.g 2 valid directions will only leave `LOCATION_1` and `LOCATION_2`
        let trimmedEntry = randomEntry.filter((stringPortion, i) => {
          return i < numOfValidLocationsOrSubLocations;
        });

        trimmedEntry[0] = trimmedEntry[0].replace(
          CURR_LOCATION,
          returnOrangeText(
            currSubLocation != null && currSubLocation != undefined
              ? getDefaultNameOfSubLocation(currLocation, currSubLocation)
              : setup.locationData[currLocation].name
          )
        );

        for (let i = 0; i < trimmedEntry.length - 1; i++) {
          // NOTE - Add better support for location
          // Store a random pair of key-values `closestLocationOrSubLocation` and then delete them from the original object
          const randKeyValuePair = Object.entries(
            closestLocationOrSubLocation
          ).pluck() as [string, MapLocation | MapSubLocation];
          const randKey = parseInt(randKeyValuePair[0]) as GameMapDirection;

          delete closestLocationOrSubLocation[randKey];

          trimmedEntry[i + 1] = trimmedEntry[i + 1]
            .replace(
              LOCATION[(i + 1) as 1 | 2 | 3 | 4].direction,
              returnGreenText(GameMapDirection[randKey].toLocaleLowerCase())
            )
            .replace(
              LOCATION[(i + 1) as 1 | 2 | 3 | 4].locOrSubLocName,
              returnGreenText(
                getDefaultNameOfSubLocation(
                  currLocation,
                  randKeyValuePair[1] as MapSubLocation
                )
              )
            );
        }

        // Concatenate the strings in `trimmedEntry[]` together
        let joinedString = "";
        trimmedEntry.forEach((stringPortion, index) => {
          if (index != trimmedEntry.length - 1) {
            // Not at the end of the string so add whitespace at the end
            joinedString += stringPortion + " ";
          } else {
            // No need for whitespace since this will be the last sentence/phrase. instead replace the last character with a period
            let editedStr =
              stringPortion.slice(0, stringPortion.length - 1) + ".";
            joinedString += editedStr;
          }
        });

        // Add the paragraph tags to the string and prepend it with a long horizontal line
        const strToReturn = `<br><br><br><hr><p>${joinedString}</p>`;

        return strToReturn;
      };

      const textToDisplay = returnUpdatedRandomEntry();
      const currentPassageOnDOM = $("#passages > [id^=passage]");

      // Append the text to the current passage
      currentPassageOnDOM.append(textToDisplay);
    }
    // !SECTION
  });
  // !SECTION
}
