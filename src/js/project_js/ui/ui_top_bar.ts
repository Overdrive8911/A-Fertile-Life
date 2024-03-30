$(document).on(":passageend", () => {
  //Add the settings, restart and save menus to the icons
  $("#ui-settings-button-settings").ariaClick(() => {
    UI.settings();
  });
  $("#ui-settings-button-save").ariaClick(() => {
    UI.saves();
  });
  $("#ui-settings-button-restart").ariaClick(() => {
    UI.restart();
  });
});
