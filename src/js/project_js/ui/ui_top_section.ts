const switchToAlternateUiStatBarIconWhenNeeded = (
  minWidth: string,
  newIconDimension: string
) => {
  // Example of "minWidth" = 901px. Example of "newIconDimension" = 24x24
  // SECTION - Change the sprites depending on the screen. Note that the smallest possible sprites are shown by default in the html structure
  const largestMobileWidthAndBeyond: string = `screen and (min-width: ${minWidth})`;

  let uiStatBarIconArray: JQuery<HTMLElement> = $(
    ".ui-stat-bar-and-icon > img"
  );

  // Change the src and class of each icon to the "newIconDimension" version
  for (const icon of uiStatBarIconArray) {
    if (window.matchMedia(largestMobileWidthAndBeyond).matches) {
      const originalSrc: string | undefined = $(icon).attr("src");

      if (originalSrc) {
        // Create a regex to match stuff like "20x20", "32x32", etc
        const iconDimensionRegex: RegExp = /\d{2}x\d{2}/;

        const modifiedSrc: string = originalSrc?.replace(
          iconDimensionRegex,
          newIconDimension
        ) as string;

        console.log(modifiedSrc);

        // Use the modified source as its content attribute
        $(icon).css("content", `url(${modifiedSrc})`);
      }

      //

      // Deal with the class
      $(icon).addClass(`icon${newIconDimension}`);
    } else {
      // Revert the class and content changes, if any
      $(icon).css("content", "");
      $(icon).removeClass(`icon${newIconDimension}`);
    }
  }
};

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
