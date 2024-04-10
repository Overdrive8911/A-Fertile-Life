// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// TODO - Move setting declarations to another file

// Define a handler for altering the height of #ui-passage-action-interface-shadow-spacer
const uiSideBarActionInterfaceShadowSpacerHandler = (
  spaceObject: JQuery<HTMLElement>
) => {
  let scrollBarPosition = $("html").scrollTop();

  if (!$("[id='ui-side-bar-action-interface']").hasClass("stowed")) {
    spaceObject.css("height", scrollBarPosition);
    // Without this, increasing the size of innerPassagePrependedContainerSpacer will also alter the height of the passage and slightly move the scroll bar causing this function to be called again and again as it forcefully moves the scrollbar in either direction :(
    $("html").scrollTop(scrollBarPosition);
  }
};

// Define handler for altering the dimensions and position of #ui-passage-action-interface-shadow as well as adjusting its position as the user scrolls through the passage
const uiSideBarActionInterfaceShadowHandler = () => {
  let innerPassagePrependedContainer = $(
    "[id|='passage'] > [id='ui-passage-action-interface-shadow']"
  );
  let uiSideBarActionInterface = $("[id='ui-side-bar-action-interface']");

  // For ease of clarity, define variables for the stuff I'll used to calculate the width of innerPassagePrependedContainer
  let passagesWidth = $("[id='passages']").css("width");
  let innerPassageWidth = $("[id|='passage']").css("width");
  let uiSideBarActionInterfaceWidth = uiSideBarActionInterface.css("width");
  let uiSideBarActionMenuWidth = $("[id='ui-side-bar-action-menu']").css(
    "width"
  );

  if (uiSideBarActionInterface.hasClass("stowed")) {
    innerPassagePrependedContainer.css("width", "0px").css("height", "0px");
  } else {
    innerPassagePrependedContainer
      .css("float", "left")
      .css("clear", "left")
      // .css("margin-top", uiSideBarActionInterface.css("margin-top"))
      .css("height", uiSideBarActionInterface.css("height"))
      .css(
        "width",
        `calc(((${uiSideBarActionMenuWidth} + ${uiSideBarActionInterfaceWidth}) - ((${passagesWidth} - ${innerPassageWidth}) * 0.5)) + 1rem)`
      );
  }

  //
  // Position the spacer container #ui-passage-action-interface-shadow-spacer properly
  let innerPassagePrependedContainerSpacer = $(
    "[id|='passage'] > [id='ui-passage-action-interface-shadow-spacer']"
  );
  uiSideBarActionInterfaceShadowSpacerHandler(
    innerPassagePrependedContainerSpacer
  );
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
    $("#ui-side-bar-backup-container1 > :first-child").empty();
    $("#ui-side-bar-backup-container1 > :last-child").empty();

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
        $("#ui-side-bar-backup-container1 > :first-child").append(
          $(uiIcon).clone(true)
        );
      } else {
        // Empty the container
        $("#ui-side-bar-backup-container1 > :first-child").empty();
      }
    }

    //Deal with the rightmost icons (money/rep)
    for (const uiIcon of $("#ui-stat-others").children()) {
      // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
      if (!$("[id='ui-side-bar']").hasClass("stowed")) {
        $("#ui-side-bar-backup-container1 > :last-child").append(
          $(uiIcon).clone(true)
        );
      } else {
        // Empty the container
        $("#ui-side-bar-backup-container1 > :last-child").empty();
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
        $("#ui-side-bar-backup-container1 > :first-child").append(
          $(uiIcon).clone(true)
        );
      } else {
        // Empty the container
        $("#ui-side-bar-backup-container1 > :first-child").empty();
      }
    }

    for (const uiIcon of $("#ui-stat-others").children()) {
      // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
      if (!$("[id='ui-side-bar']").hasClass("stowed")) {
        $("#ui-side-bar-backup-container1 > :last-child").append(
          $(uiIcon).clone(true)
        );
      } else {
        // Empty the container
        $("#ui-side-bar-backup-container1 > :last-child").empty();
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

$(document).on(":passageend", () => {
  // To make sure the changes stick around when loading the game
  uiSideBarToggleHandler();

  $("#ui-side-bar-toggle-state-button").ariaClick(() => {
    // Open or stow the side bar
    $("[id='ui-side-bar']").toggleClass("stowed");
    uiSideBarToggleHandler();
  });

  $("#ui-side-bar-toggle-map-button").ariaClick(() => {
    // Open or stow the map interface
    $("#ui-side-bar-action-interface").toggleClass("stowed");
    $("#ui-side-bar-popout-map").toggleClass("hidden");
    uiSideBarActionInterfaceShadowHandler();
    // Wait for 1 second so the button can't be infinitely spammed
    setTimeout(() => {}, 1000);
  });

  // Create a div container in the actual passage and use it to push the passage's content to the right depending on the dimensions of #ui-side-bar-action-interface and the extra space between it and the side bar
  $("[id|='passage']").prepend(
    "<div id='ui-passage-action-interface-shadow'></div>"
  );
  // Create another div container above #ui-passage-action-interface-shadow and use it to adjust its position as the user scrolls along the passage
  $("[id|='passage']").prepend(
    "<div id='ui-passage-action-interface-shadow-spacer'></div>"
  );

  //
  //
  // Deal with the spacer container #ui-passage-action-interface-shadow-spacer
  let innerPassagePrependedContainerSpacer = $(
    "[id|='passage'] > [id='ui-passage-action-interface-shadow-spacer']"
  );

  // Set its constant properties
  innerPassagePrependedContainerSpacer.css("float", "left").css("width", "0px");
  // This callback makes sure that #'ui-passage-action-interface-shadow will always be adjusted correctly even when the page is scrolled
  window.addEventListener("scroll", () => {
    uiSideBarActionInterfaceShadowSpacerHandler(
      innerPassagePrependedContainerSpacer
    );
  });
});

// // Re-run the sidebar handler function when the screen rotates to make sure all the icons are where they should be
// window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
//   uiSideBarToggleHandler();
// });

// Also rerun when the handler when the browser resolution changes (for PC users)
$(window).on("resize", () => {
  uiSideBarToggleHandler();
});
