namespace NSUi {
  function copyActionInterfaceContentsToSideBar() {
    const verySlimMobileWidth = "screen and (max-width: 415px)";

    if (window.matchMedia(verySlimMobileWidth).matches) {
      const actionInterface = $("[id='ui-side-bar-action-interface']");
      for (const actionInterfaceChild of actionInterface.children()) {
        // Copy the each child in the action interface e.g the map popout
        if (!actionInterface.hasClass("stowed")) {
          $("#ui-side-bar-backup-container1 > :nth-child(3)").append(
            $(actionInterfaceChild).clone(true)
          );
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container1 > :nth-child(3)").empty();
        }
      }
    }
  }

  // Define the handler for toggling the sidebar
  export function uiSideBarToggleHandler() {
    //SECTION - Deal with the mobile aspect
    // Copy the hidden icons from the top bar and paste them into the side bar if the screen is too narrow
    // Also hide the stat bars and display them in the sidebar too

    let prevMobileMaxWidth;
    const slimMobileWidth = "screen and (max-width: 500px)";
    const wideMobileWidth = "screen and (max-width: 780px)";
    const generalMobileUISettingsReset = () => {
      // TODO - PLEASE REVISE THIS
      $("#ui-side-bar-backup-container1 > div").empty();

      $("#ui-side-bar-backup-container2").empty();

      $("[id|='ui-navigation-option-button']").removeClass(
        "ui-navigation-button-small"
      );
    };

    // if (settings.uiSideBarToggle) {
    //   $("#ui-side-bar").addClass("stowed");
    // } else if (!settings.uiSideBarToggle) {
    //   $("#ui-side-bar").removeClass("stowed");
    // }
    if (window.matchMedia(slimMobileWidth).matches) {
      //SECTION - For slim portrait modes on mobile
      // Reset general changes if coming from another mobile width range
      if (prevMobileMaxWidth !== slimMobileWidth) {
        generalMobileUISettingsReset();
      }
      //Deal with the leftmost icons
      for (const uiIcon of $("#ui-settings-buttons").children()) {
        // Copy the data for all the leftmost icons with their event handlers and show them in the side bar
        if (!$("[id='ui-side-bar']").hasClass("stowed")) {
          $("#ui-side-bar-backup-container1 > :nth-child(1)").append(
            $(uiIcon).clone(true)
          );
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container1 > :nth-child(1)").empty();
        }
      }

      //Deal with the rightmost icons (money/rep)
      for (const uiIcon of $("#ui-stat-others").children()) {
        // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
        if (!$("[id='ui-side-bar']").hasClass("stowed")) {
          $("#ui-side-bar-backup-container1 > :nth-child(2)").append(
            $(uiIcon).clone(true)
          );
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container1 > :nth-child(2)").empty();
        }
      }

      //Deal with the stat bars
      // It will copy every stat bar individually and display it as a column in the side bar. To do that, I'll have to go through each stat bar column group and then get the stat bar. I think I could use `.find(".ui-stat-bar-and-icon") but eh
      for (const statBarColumnGroup of $("#ui-stat-bars").children()) {
        for (const statBar of $(statBarColumnGroup).children()) {
          // Copy the each stat bar and paste into the side bar
          if (!$("[id='ui-side-bar']").hasClass("stowed")) {
            $("#ui-side-bar-backup-container2").append($(statBar).clone(true));
          } else {
            // Empty the container
            $("#ui-side-bar-backup-container2").empty();
          }
        }
      }

      //Extra
      if (!$("[id='ui-side-bar']").hasClass("stowed")) {
        // Change the size of the bottom bar navigation settings
        $("[id|='ui-navigation-option-button']").addClass(
          "ui-navigation-button-small"
        );
      } else {
        $("[id|='ui-navigation-option-button']").removeClass(
          "ui-navigation-button-small"
        );
      }

      // Deal with the action interface's contents when the screen is even smaller
      copyActionInterfaceContentsToSideBar();
    }
    //SECTION - For wide portrait and relatively narrower landscape modes on mobile
    else if (window.matchMedia(wideMobileWidth).matches) {
      // Reset if coming from another mobile screen range
      if (prevMobileMaxWidth !== wideMobileWidth) {
        generalMobileUISettingsReset();
      }

      for (const uiIcon of $("#ui-settings-buttons").children()) {
        // Copy the data for all the leftmost icons with their event handlers and show them in the side bar
        if (!$("[id='ui-side-bar']").hasClass("stowed")) {
          $("#ui-side-bar-backup-container1 > :nth-child(1)").append(
            $(uiIcon).clone(true)
          );
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container1 > :nth-child(1)").empty();
        }
      }

      for (const uiIcon of $("#ui-stat-others").children()) {
        // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
        if (!$("[id='ui-side-bar']").hasClass("stowed")) {
          $("#ui-side-bar-backup-container1 > :nth-child(2)").append(
            $(uiIcon).clone(true)
          );
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container1 > :nth-child(2)").empty();
        }
      }
    }
    //SECTION - For much wider screens like laptops/desktops/i-pads, just reset it
    else {
      if (!$("[id='ui-side-bar']").hasClass("stowed")) {
        // The side bar is open and the user is probably in landscape mode/is on something like an ipad so empty the backup containers and restore the stat bars since there's enough space for them
        generalMobileUISettingsReset();
      }
    }
  }

  // SECTION - Define a handler for interacting with the action interface
  export function actionInterfaceToggleHandler(actionInterfaceChild: string) {
    $("#ui-side-bar-action-interface").toggleClass("stowed");
    $(actionInterfaceChild).toggleClass("hidden");

    copyActionInterfaceContentsToSideBar();
  }
}
