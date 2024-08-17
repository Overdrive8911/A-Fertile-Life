$(document).one(":passageend", () => {
  // Load the map whenever the side bar button for the map is clicked
  $("#ui-side-bar-toggle-map-button").on("click", function () {
    loadGameMap(
      variables().player.locationData.location,
      $(".ui-side-bar-popout-map")
    );
  });
  $(document).on("keypress", function () {
    loadGameMap(
      variables().player.locationData.location,
      $(".ui-side-bar-popout-map")
    );
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
