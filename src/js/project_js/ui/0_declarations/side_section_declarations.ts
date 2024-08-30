// // Define a handler for altering the height of #ui-passage-action-interface-shadow-spacer
// const uiSideBarActionInterfaceShadowSpacerHandler = (
//   spaceObject: JQuery<HTMLElement>
// ) => {
//   let scrollBarPosition = $("html").scrollTop();

//   if (!$("[id='ui-side-bar-action-interface']").hasClass("stowed")) {
//     spaceObject.css("height", scrollBarPosition);
//     // Without this, increasing the size of innerPassagePrependedContainerSpacer will also alter the height of the passage and slightly move the scroll bar causing this function to be called again and again as it forcefully moves the scrollbar in either direction :(
//     $("html").scrollTop(scrollBarPosition);
//   }
// };

// Define handler for altering the dimensions and position of #ui-passage-action-interface-shadow as well as adjusting its position as the user scrolls through the passage
const uiSideBarActionInterfaceShadowHandler = () => {
  let innerPassagePrependedContainer = $(
    "[id|='passage'] > [id='ui-passage-action-interface-shadow']"
  );
  let uiSideBarActionInterface = $("[id='ui-side-bar-action-interface']");

  // For ease of clarity, define variables for the stuff I'll used to calculate the width of innerPassagePrependedContainer
  let passagesWidth = $("[id='passages']").css("width");
  let innerPassageWidth = $("[id|='passage']").css("width");
  let uiSideBarActionInterfaceWidth = $("html").css(
    "--ui-side-bar-action-interface-total-width"
  );
  let uiSideBarActionMenuWidth = $("html").css(
    "--ui-side-bar-action-menu-width"
  );

  if (uiSideBarActionInterface.hasClass("stowed")) {
    innerPassagePrependedContainer.css("width", "") /*.css("height", "0px")*/;
  } else {
    innerPassagePrependedContainer
      // .css("float", "left")
      // .css("clear", "left")
      // .css("margin-top", uiSideBarActionInterface.css("margin-top"))
      // .css("height", uiSideBarActionInterface.css("height"))
      .css(
        "width",
        `calc(((${uiSideBarActionMenuWidth} + ${uiSideBarActionInterfaceWidth}) - ((${passagesWidth} - ${innerPassageWidth}) * 0.5)) + 0.25rem)`
      );
  }

  //
  // // Position the spacer container #ui-passage-action-interface-shadow-spacer properly
  // let innerPassagePrependedContainerSpacer = $(
  //   "[id|='passage'] > [id='ui-passage-action-interface-shadow-spacer']"
  // );
  // uiSideBarActionInterfaceShadowSpacerHandler(
  //   innerPassagePrependedContainerSpacer
  // );
};

// NOTE - Commented out since it's probably not worth the stress. It looks pretty
const copyActionInterfaceContentsToSideBar = () => {
  // const verySlimMobileWidth = "screen and (max-width: 415px)";
  // if (window.matchMedia(verySlimMobileWidth).matches) {
  //   const actionInterface = $("[id='ui-side-bar-action-interface']");
  //   for (const actionInterfaceChild of actionInterface.children()) {
  //     // Copy the each child in the action interface e.g the map popout
  //     if (!actionInterface.hasClass("stowed")) {
  //       $("#ui-side-bar-backup-container1 > :nth-child(3)").append(
  //         $(actionInterfaceChild).clone(true)
  //       );
  //     } else {
  //       // Empty the container
  //       $("#ui-side-bar-backup-container1 > :nth-child(3)").empty();
  //     }
  //   }
  // }
};

// Define the handler for toggling the sidebar
const uiSideBarToggleHandler = () => {
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

  uiSideBarActionInterfaceShadowHandler();
};

// SECTION - Define a handler for interacting with the action interface
// NOTE - Every new item for the action interface needs some code here
let ui_isActionInterfaceOpen = false;
let ui_isMapInActionInterfaceOpen = false;
const actionInterfaceToggleHandler = (actionInterfaceChild: string) => {
  // $("#ui-side-bar-action-interface").toggleClass("stowed");
  // if ($("#ui-side-bar-action-interface").hasClass("stowed")) ui_isActionInterfaceOpen = false;
  // else ui_isActionInterfaceOpen = true;
  ui_isActionInterfaceOpen = !ui_isActionInterfaceOpen;
  if (ui_isActionInterfaceOpen) {
    $("#ui-side-bar-action-interface").removeClass("stowed");
    // $(actionInterfaceChild).addClass("hidden");
  } else {
    $("#ui-side-bar-action-interface").addClass("stowed");
    // $(actionInterfaceChild).removeClass("hidden");
  }

  if (actionInterfaceChild == ".ui-side-bar-popout-map") {
    ui_isMapInActionInterfaceOpen = !ui_isMapInActionInterfaceOpen;
    if (ui_isMapInActionInterfaceOpen) {
      $(actionInterfaceChild).removeClass("hidden");
    } else {
      $(actionInterfaceChild).addClass("hidden");
    }
  } else {
    ui_isMapInActionInterfaceOpen = false;
  }

  copyActionInterfaceContentsToSideBar();
};
