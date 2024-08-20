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
  $(document).on("keypress", function () {
    if ($("#ui-side-bar-action-interface").hasClass("stowed")) {
      loadGameMap(
        variables().player.locationData.location,
        $(".ui-side-bar-popout-map")
      );
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
  $(".ui-side-bar-popout-map-button-bar > .button-large-view").ariaClick(() => {
    Dialog.setup("Large View", "map-large-view");
    // Add dummy data
    Dialog.append("");
    Dialog.open();

    // Load the map into here
    loadGameMap(variables().player.locationData.location, $(".map-large-view"));
  });
});

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
    setup.locationData[variables().player.locationData.location as MapLocation]
      .subLocations
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

// SECTION - For everything relating to the navigational buttons
$(document).on(":passageend", () => {
  const northButton = $("#ui-navigation-option-button-north");
  const eastButton = $("#ui-navigation-option-button-east");
  const southButton = $("#ui-navigation-option-button-south");
  const westButton = $("#ui-navigation-option-button-west");

  const navigate = (direction: GameMapDirection) => {
    navigateInDirectionOnMap(
      direction,
      variables().player.locationData.location as MapLocation,
      variables().player.locationData.subLocation as MapSubLocation
    );
  };

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
});
