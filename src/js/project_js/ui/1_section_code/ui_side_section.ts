namespace NSUi {
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
      if (!validateKeyEvent(keyEvent)) return false;
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
      }, 150);
    });
    $(window).on("keyup", (keyEvent) => {
      if (!validateKeyEvent(keyEvent)) return false;
      if (keyEvent.key === "z") {
        // Wait for 1 second so the button can't be infinitely spammed
        setTimeout(() => {
          // Open or stow the map interface
          actionInterfaceToggleHandler("#ui-side-bar-popout-map");
        }, 150);
      }
    });
  });

  // Also rerun when the handler when the browser resolution changes (for PC users)
  $(window).on("resize", () => {
    uiSideBarToggleHandler();
  });
}
