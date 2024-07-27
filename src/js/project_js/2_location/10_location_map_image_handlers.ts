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
