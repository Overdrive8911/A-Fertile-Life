// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO - Move setting declarations to another file

// Define the handler for toggling the sidebar
const uiSideBarToggleHandler = () => {
  // Open and stow the side bar
  $("html").css("--ui-side-bar-width", settings.uiSideBarToggle ? "" : "1rem");

  // Change the stubbed arrow's facing direction depending on the state of the sidebar
  $("#ui-side-bar-toggle-button").text(settings.uiSideBarToggle ? "◄" : "►");

  // Toggle the visibility all the contents of the sidebar
  for (const child of $("#ui-side-bar").children()) {
    $(child).css("display", settings.uiSideBarToggle ? "" : "none");
  }

  // Fill the sidebar with a solid color when stowed
  $("#ui-side-bar").css(
    "background-color",
    settings.uiSideBarToggle ? "" : $("html").css("--ui-bar-border-color")
  );
};

// Create a toggle for the side bar.
// "True" means the side bar will be Open while "false" closes it
Setting.addToggle("uiSideBarToggle", {
  label: "Toggle the side bar's state.",
  default: true,
  onInit: uiSideBarToggleHandler,
  onChange: uiSideBarToggleHandler,
});

$(document).on(":passageend", () => {
  // To make sure the changes stick around when loading the game
  uiSideBarToggleHandler();

  $("#ui-side-bar-toggle-button").ariaClick(() => {
    // Open or stow the side bar
    settings.uiSideBarToggle = !settings.uiSideBarToggle;
    uiSideBarToggleHandler();
    Setting.save();
  });
});
