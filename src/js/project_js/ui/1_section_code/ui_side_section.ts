// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

let uiSideBarToggleState = true;

$(document).on(":passageend", () => {
  // To make sure the changes stick around when loading the game
  if (uiSideBarToggleState) {
    $("[id='ui-side-bar']").addClass("stowed");
  } else {
    $("[id='ui-side-bar']").removeClass("stowed");
  }
  uiSideBarToggleHandler();

  // Pass in an event
  function validateKeyEvent(e: unknown) {
    const { target } = e as Event;
    // Don't trigger in textboxes and similar elements
    if (
      target instanceof HTMLElement &&
      (["INPUT", "TEXTAREA"].includes(target.nodeName) ||
        target.isContentEditable)
    )
      return false;

    return true;
  }
  // TODO - Allow users add keyboard shortcuts they'd prefer
  // SECTION - Attach the handler to #ui-side-bar-toggle-state-button and allow it be activated by a click or keypress
  $("#ui-side-bar-toggle-state-button").ariaClick(() => {
    // Open or stow the side bar
    uiSideBarToggleState = !uiSideBarToggleState;
    if (uiSideBarToggleState) {
      $("[id='ui-side-bar']").addClass("stowed");
    } else {
      $("[id='ui-side-bar']").removeClass("stowed");
    }
    uiSideBarToggleHandler();
  });
  $(window).on("keyup", (keyEvent) => {
    if (!validateKeyEvent(e)) return false;
    if (keyEvent.key === "q") {
      // Open or stow the side bar
      uiSideBarToggleState = !uiSideBarToggleState;
      if (uiSideBarToggleState) {
        $("[id='ui-side-bar']").addClass("stowed");
      } else {
        $("[id='ui-side-bar']").removeClass("stowed");
      }
      uiSideBarToggleHandler();
    }
  });

  // SECTION - Attach the handler to #ui-side-bar-toggle-map-button and allow it be activated by a click or keypress
  $("#ui-side-bar-toggle-map-button").ariaClick(() => {
    // Wait for 1 second so the button can't be infinitely spammed
    setTimeout(() => {
      // Open or stow the map interface
      actionInterfaceToggleHandler("#ui-side-bar-popout-map");
      uiSideBarActionInterfaceShadowHandler();
    }, 150);
  });
  $(window).on("keyup", (keyEvent) => {
    if (!validateKeyEvent(e)) return false;
    if (keyEvent.key === "z") {
      // Wait for 1 second so the button can't be infinitely spammed
      setTimeout(() => {
        // Open or stow the map interface
        actionInterfaceToggleHandler("#ui-side-bar-popout-map");
        uiSideBarActionInterfaceShadowHandler();
      }, 150);
    }
  });

  // Create a div container in the actual passage and use it to push the passage's content to the right depending on the dimensions of #ui-side-bar-action-interface and the extra space between it and the side bar
  $("[id|='passage']").prepend(
    "<div id='ui-passage-action-interface-shadow'></div>"
  );
  // // Create another div container above #ui-passage-action-interface-shadow and use it to adjust its position as the user scrolls along the passage
  // $("[id|='passage']").prepend(
  //   "<div id='ui-passage-action-interface-shadow-spacer'></div>"
  // );

  //
  //
  // // Deal with the spacer container #ui-passage-action-interface-shadow-spacer
  // let innerPassagePrependedContainerSpacer = $(
  //   "[id|='passage'] > [id='ui-passage-action-interface-shadow-spacer']"
  // );

  // // Set its constant properties
  // innerPassagePrependedContainerSpacer.css("float", "left").css("width", "0px");
  // // This callback makes sure that #'ui-passage-action-interface-shadow will always be adjusted correctly even when the page is scrolled
  // window.addEventListener("scroll", () => {
  //   uiSideBarActionInterfaceShadowSpacerHandler(
  //     innerPassagePrependedContainerSpacer
  //   );
  // });
});

// // Re-run the sidebar handler function when the screen rotates to make sure all the icons are where they should be
// window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
//   uiSideBarToggleHandler();
// });

// Also rerun when the handler when the browser resolution changes (for PC users)
$(window).on("resize", () => {
  uiSideBarToggleHandler();
});
