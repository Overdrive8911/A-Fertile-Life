import { convertToClass } from "../../declarations/general_declarations";
import { stowed } from "../../story/passages/styles/ui/shared.module.css";
import {
  actionInterface,
  backupContainer1,
  backupContainer2,
  popoutMap,
  sideBar,
} from "../../story/passages/styles/ui/side_section.module.css";
import {
  otherStats,
  settingBtn,
} from "../../story/passages/styles/ui/top_section.module.css";

function copyActionInterfaceContentsToSideBar() {
  const verySlimMobileWidth = "screen and (max-width: 415px)";

  if (window.matchMedia(verySlimMobileWidth).matches) {
    const actionInterfaceElement = $(convertToClass(actionInterface));

    for (const actionInterfaceChild of actionInterfaceElement.children()) {
      const backupContainer3rdChild = $(
        `${convertToClass(backupContainer1)}>:nth-child(3)`
      );

      // Copy the each child in the action interface e.g the map popout
      if (!actionInterfaceElement.hasClass(stowed)) {
        backupContainer3rdChild.append($(actionInterfaceChild).clone(true));
      } else {
        // Empty the container
        backupContainer3rdChild.empty();
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
  const backupContainer1ChildSelector = convertToClass(backupContainer1);
  const backupContainer1FirstChild = $(
    `${backupContainer1ChildSelector}>:nth-child(1)`
  );
  const backupContainer1SecondChild = $(
    `${backupContainer1ChildSelector}>:nth-child(2)`
  );
  const backupContainer2ChildSelector = convertToClass(backupContainer2);
  const isNotStowed = !$(convertToClass(sideBar)).hasClass(stowed);

  const generalMobileUISettingsReset = () => {
    // TODO - PLEASE REVISE THIS
    $(`${backupContainer1ChildSelector} > div`).empty();

    $(backupContainer2ChildSelector).empty();

    $("[id|='ui-navigation-option-button']").removeClass(
      "ui-navigation-button-small"
    );
  };

  // if (settings.uiSideBarToggle) {
  //   $("#ui-side-bar").addClass(stowed);
  // } else if (!settings.uiSideBarToggle) {
  //   $("#ui-side-bar").removeClass(stowed);
  // }
  if (window.matchMedia(slimMobileWidth).matches) {
    //SECTION - For slim portrait modes on mobile
    // Reset general changes if coming from another mobile width range
    if (prevMobileMaxWidth !== slimMobileWidth) {
      generalMobileUISettingsReset();
    }
    //Deal with the leftmost icons
    for (const uiIcon of $(convertToClass(settingBtn)).children()) {
      // Copy the data for all the leftmost icons with their event handlers and show them in the side bar
      if (isNotStowed) {
        backupContainer1FirstChild.append($(uiIcon).clone(true));
      } else {
        // Empty the container
        backupContainer1FirstChild.empty();
      }
    }

    //Deal with the rightmost icons (money/rep)
    for (const uiIcon of $(convertToClass(otherStats)).children()) {
      // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
      if (isNotStowed) {
        backupContainer1SecondChild.append($(uiIcon).clone(true));
      } else {
        // Empty the container
        backupContainer1SecondChild.empty();
      }
    }

    //Deal with the stat bars
    // It will copy every stat bar individually and display it as a column in the side bar. To do that, I'll have to go through each stat bar column group and then get the stat bar. I think I could use `.find(".ui-stat-bar-and-icon") but eh
    for (const statBarColumnGroup of $("#ui-stat-bars").children()) {
      for (const statBar of $(statBarColumnGroup).children()) {
        // Copy the each stat bar and paste into the side bar
        if (isNotStowed) {
          $(backupContainer2ChildSelector).append($(statBar).clone(true));
        } else {
          // Empty the container
          $(backupContainer2ChildSelector).empty();
        }
      }
    }

    //Extra
    if (isNotStowed) {
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

    for (const uiIcon of $(convertToClass(settingBtn)).children()) {
      // Copy the data for all the leftmost icons with their event handlers and show them in the side bar
      if (isNotStowed) {
        backupContainer1FirstChild.append($(uiIcon).clone(true));
      } else {
        // Empty the container
        backupContainer1FirstChild.empty();
      }
    }

    for (const uiIcon of $(convertToClass(otherStats)).children()) {
      // Copy the data for all the rightmost icons with their event handlers and show them in the side bar
      if (isNotStowed) {
        backupContainer1SecondChild.append($(uiIcon).clone(true));
      } else {
        // Empty the container
        backupContainer1SecondChild.empty();
      }
    }
  }
  //SECTION - For much wider screens like laptops/desktops/i-pads, just reset it
  else {
    if (isNotStowed) {
      // The side bar is open and the user is probably in landscape mode/is on something like an ipad so empty the backup containers and restore the stat bars since there's enough space for them
      generalMobileUISettingsReset();
    }
  }
}

// SECTION - Define a handler for interacting with the action interface
// NOTE - Every new item for the action interface needs some code here
export let ui_isActionInterfaceOpen = false;
export let ui_isMapInActionInterfaceOpen = false;
export const actionInterfaceToggleHandler = (actionInterfaceChild: string) => {
  // $("#ui-side-bar-action-interface").toggleClass(stowed);
  // if ($("#ui-side-bar-action-interface").hasClass(stowed)) ui_isActionInterfaceOpen = false;
  // else ui_isActionInterfaceOpen = true;
  ui_isActionInterfaceOpen = !ui_isActionInterfaceOpen;

  const actionInterfaceElement = $(convertToClass(actionInterface));
  if (ui_isActionInterfaceOpen) {
    actionInterfaceElement.removeClass(stowed);
    // $(actionInterfaceChild).addClass("hidden");
  } else {
    actionInterfaceElement.addClass(stowed);
    // $(actionInterfaceChild).removeClass("hidden");
  }

  if (actionInterfaceChild == convertToClass(popoutMap)) {
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
