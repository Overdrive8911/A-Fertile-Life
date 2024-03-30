// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO - Move setting declarations to another file
// Define the original and stowed widths for the sidebar
const uiSideBarOriginalWidth: string = $("html").css("--ui-side-bar-width");
const uiSideBarStowedWidth: string = "1rem";

// Define the handler for toggling the sidebar
const uiSideBarToggleHandler = () => {
  $("html").css(
    "--ui-side-bar-width",
    settings.uiSideBarToggle ? uiSideBarOriginalWidth : uiSideBarStowedWidth
  );

  // Change the stubbed arrow's facing direction depending on the state of the sidebar
  settings.uiSideBarToggle
    ? $("#ui-side-bar-toggle-button").text("◄")
    : $("#ui-side-bar-toggle-button").text("►");
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
  $("#ui-side-bar-toggle-button").ariaClick(() => {
    // Open or stow the side bar
    settings.uiSideBarToggle = !settings.uiSideBarToggle;
    uiSideBarToggleHandler();
    Setting.save();
  });
});
