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

  //REVIEW - Hide the backup containers. If they're needed, they'll be enabled below
  $("[id^=ui-side-bar-backup-container]").css("display", "none");

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

    $("#ui-settings-buttons").css("display", "");
    $("#ui-top-bar-middle").css("display", "");
    $("#ui-top-bar-right").css("display", "");

    $("#ui-top-bar-left").css("flex", "");
    $("#ui-top-bar-left").css("padding-left", "");

    // HIDE THEM. If its needed, manually set it
    $("[id^=ui-side-bar-backup-container]").css("display", "none");

    $("[id|='ui-navigation-option-button']").removeClass(
      "ui-navigation-button-small"
    );
  };

  //SECTION - For slim portrait modes on mobile
  if (window.matchMedia(slimMobileWidth).matches) {
    // Reset general changes if coming from another mobile width range
    if (prevMobileMaxWidth !== slimMobileWidth) {
      generalMobileUISettingsReset();
    }
    //Deal with the leftmost icons
    for (const uiIcon of $("#ui-settings-buttons").children()) {
      // Copy the data for all the leftmost icons with their event handlers and show them in the side bar
      if (settings.uiSideBarToggle) {
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
      if (settings.uiSideBarToggle) {
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
        if (settings.uiSideBarToggle) {
          $("#ui-side-bar-backup-container2").append($(statBar).clone(true));
        } else {
          // Empty the container
          $("#ui-side-bar-backup-container2").empty();
        }
      }
    }

    //Extra
    if (settings.uiSideBarToggle) {
      // Remove the padding added that was used to shift the clock slightly the right
      $("#ui-top-bar-left").css("padding-left", 0);

      // Change the clock text back to it's monospace version
      $("#ui-settings-button-time").css(
        "font-family",
        "DIGITAL-7-monospace, Courier, monospace"
      );

      // Hide the "middle" section of the top bar (alongside the original stat bars as well)
      $("#ui-top-bar-middle").css("display", "none");

      // Change a couple of the css to make the second container look better
      $("#ui-side-bar-backup-container2").css("padding-top", "0.25rem");
      $("#ui-side-bar-backup-container2").css("padding-bottom", "0.25rem");

      // SHOW THE CONTAINERS
      $("[id^=ui-side-bar-backup-container]").css("display", "");
      //

      // Change the size of the bottom bar navigation settings
      $("[id|='ui-navigation-option-button']").addClass(
        "ui-navigation-button-small"
      );
    } else {
      // Restore all the changes when the sidebar is closed

      $("#ui-top-bar-left").css("padding-left", "");

      $("#ui-settings-button-time").css("font-family", "");

      $("#ui-top-bar-middle").css("display", "");

      $("#ui-side-bar-backup-container2").css("padding-top", "");
      $("#ui-side-bar-backup-container2").css("padding-bottom", "");
      $("[id^=ui-side-bar-backup-container]").css("display", "none");

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
      if (settings.uiSideBarToggle) {
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
      if (settings.uiSideBarToggle) {
        $("#ui-side-bar-backup-container1 > :last-child").append(
          $(uiIcon).clone(true)
        );
      } else {
        // Empty the container
        $("#ui-side-bar-backup-container1 > :last-child").empty();
      }
    }

    if (settings.uiSideBarToggle) {
      // The side bar is open and the user's screen is quite wide, however, the leftmost icons are squished and it may be troublesome to swipe up/down for the remaining icons so simply push them to the side bar. And also the rightmost ones too.

      // Hide the original icons since the css ain't doing it
      $("#ui-settings-buttons").css("display", "none");
      $("#ui-top-bar-right").css("display", "none");

      // Shrink the resultant space to only fit the digital clock and push it slightly from the end
      $("#ui-top-bar-left").css("flex", "0 0 auto");
      $("#ui-top-bar-left").css("padding-left", "0.25%");

      // SHOW ONLY THE FIRST CONTAINER
      $("[id=ui-side-bar-backup-container1]").css("display", "");
    } else {
      // You know the drill. RESET THEM

      $("#ui-settings-buttons").css("display", "");
      $("#ui-top-bar-right").css("display", "");

      $("#ui-top-bar-left").css("flex", "");
      $("#ui-top-bar-left").css("padding-left", "");

      $("[id=ui-side-bar-backup-container1]").css("display", "none");
    }
  }
  //SECTION - For much wider screens like laptops/desktops/i-pads, just reset it
  else {
    if (settings.uiSideBarToggle) {
      // The side bar is open and the user is probably in landscape mode/is on something like an ipad so empty the backup containers and restore the stat bars since there's enough space for them
      generalMobileUISettingsReset();
    }
  }
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

// // Re-run the sidebar handler function when the screen rotates to make sure all the icons are where they should be
// window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
//   uiSideBarToggleHandler();
// });

// Also rerun when the handler when the browser resolution changes (for PC users)
$(window).on("resize", () => {
  uiSideBarToggleHandler();
});
