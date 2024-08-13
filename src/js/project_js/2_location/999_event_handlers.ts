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

  const getZoomRatio = () => {
    // Check the transform value on the svg (It should be a scaled value i.e "matrix(2, 0, 0, 2, 0, 0)" corresponds with scale(2) ). If the property doesn't exist or if it's less than 1, default to 1
    // NOTE - Index 3 in "matrix(2, 0, 0, 2, 0, 0)" will be 2, which is the number that is currently being scaled by
    return $(".ui-side-bar-popout-map > svg").css("transform") != "none"
      ? parseFloat(
          $(".ui-side-bar-popout-map > svg").css("transform").split(",")[3]
        ) >= 1
        ? parseFloat(
            $(".ui-side-bar-popout-map > svg").css("transform").split(",")[3]
          )
        : 1
      : 1;
  };

  // Handlers for the zooming functionality of the map popout
  $(".ui-side-bar-popout-map-button-bar > .button-zoom-in").ariaClick(() => {
    // Increment the zoom ratio by 0.5
    $(".ui-side-bar-popout-map > svg").css(
      "transform",
      `scale(${getZoomRatio() + 0.5})`
    );
  });
  $(".ui-side-bar-popout-map-button-bar > .button-zoom-out").ariaClick(() => {
    // Decrement the zoom ratio by 0.5 but don't go lower than 1
    $(".ui-side-bar-popout-map > svg").css(
      "transform",
      `scale(${getZoomRatio() - 0.5 > 1 ? getZoomRatio() - 0.5 : 1})`
    );
  });
});
