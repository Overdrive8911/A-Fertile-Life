// Load the map whenever the side bar button for the map is clicked
$(document).one(":passageend", () => {
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
});
