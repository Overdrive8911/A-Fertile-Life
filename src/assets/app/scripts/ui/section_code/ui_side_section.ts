import {
  convertToClass,
  isEditableElementSelected,
} from "../../declarations/general_declarations";
import {
  actionInterface,
  popoutMap,
  sideBar,
  stowed,
  toggleMapBtn,
  toggleStateBtn,
} from "../../story/passages/styles/ui/side_section.module.css";
import {
  actionInterfaceToggleHandler,
  ui_isActionInterfaceOpen,
  ui_isMapInActionInterfaceOpen,
  uiSideBarToggleHandler,
} from "../declarations/side_section_declarations";

let uiSideBarToggleState = true;

$(document).on(":passageend", () => {
  // To make sure the changes stick around when loading the game
  toggleSideBar();
  uiSideBarToggleHandler();

  // // Pass in an event
  // function validateKeyEvent(e: unknown) {
  //   const { target } = e as Event;
  //   // Don't trigger in textboxes and similar elements
  //   if (
  //     target instanceof HTMLElement &&
  //     (["INPUT", "TEXTAREA"].includes(target.nodeName) ||
  //       target.isContentEditable)
  //   )
  //     return false;

  //   return true;
  // }
  // TODO - Allow users add keyboard shortcuts they'd prefer
  // SECTION - Attach the handler  and allow it be activated by a click or keypress
  $(convertToClass(toggleStateBtn))
    .off("click")
    .ariaClick(() => {
      handleSidebarToggle();
    });
  const sideBarToggleKeyUpEvent = "keyup.sideBarToggleState";
  $(window)
    .off(sideBarToggleKeyUpEvent)
    .on(sideBarToggleKeyUpEvent, (keyEvent) => {
      if (isEditableElementSelected(keyEvent)) return false;
      if (keyEvent.key === "q") {
        handleSidebarToggle();
      }
    });

  // SECTION - Attach the handler to #ui-side-bar-toggle-map-button and allow it be activated by a click or keypress
  $(convertToClass(toggleMapBtn))
    .off("click")
    .ariaClick(() => {
      toggleMapInterface();
    });
  const sideBarToggleMapKeyUpEvent = "keyup.sideBarToggleMap";
  $(window)
    .off(sideBarToggleMapKeyUpEvent)
    .on(sideBarToggleMapKeyUpEvent, (keyEvent) => {
      if (isEditableElementSelected(keyEvent)) return false;
      if (keyEvent.key === "z") {
        toggleMapInterface();
      }
    });

  // Will allow the action interface to stay open after passage navigation
  // NOTE - Every new item for the action interface needs some code here
  if (ui_isActionInterfaceOpen) {
    $(convertToClass(actionInterface)).removeClass(stowed);

    // Check if the map is meant to be displayed
    if (ui_isMapInActionInterfaceOpen) {
      // Reload the map with the previous zoom lvl
      // loadGameMap(
      //   variables().player.locationData.location,
      //   $("#ui-side-bar-action-interface").children("[class*=map]"),
      //   true,
      //   true,
      //   NSLocation.gMapPopoutZoomLvl
      // );
    }
  } else {
    // Temporarily disable any transition
    // $("#ui-side-bar-action-interface").css("transition", "");

    $(convertToClass(actionInterface)).addClass(stowed);
  }
});

// Also rerun when the handler when the browser resolution changes (for PC users)
$(window).on("resize", () => {
  uiSideBarToggleHandler();
});

/** Open or stow the side bar*/
function handleSidebarToggle() {
  uiSideBarToggleState = !uiSideBarToggleState;
  toggleSideBar();
  uiSideBarToggleHandler();
}

function toggleMapInterface() {
  setTimeout(() => {
    // Open or stow the map interface with a small delay to prevent infinite spamming
    actionInterfaceToggleHandler(popoutMap);
  }, 150);
}

function toggleSideBar() {
  const sideBarClass = convertToClass(sideBar);
  if (uiSideBarToggleState) {
    $(sideBarClass).addClass(stowed);
  } else {
    $(sideBarClass).removeClass(stowed);
  }
}
