$(document).on(":passageend", () => {
  // SECTION - Add the settings, restart and save menus to the icons
  $(".ui-settings-button-settings").ariaClick(() => {
    UI.settings();
  });
  $(".ui-settings-button-save").ariaClick(() => {
    UI.saves();
  });
  $(".ui-settings-button-restart").ariaClick(() => {
    UI.restart();
  });

  // switchToAlternateUiStatBarIconWhenNeeded("901px", "24x24");
});

$(window).on("resize", () => {
  // Run it upon resize. Mostly applies to devices with resizeable browsers
  // switchToAlternateUiStatBarIconWhenNeeded("901px", "24x24");
});
