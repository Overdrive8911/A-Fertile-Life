namespace NSInventoryAndItem {
  $(window).on("resize", () => {
    // Run this on resizing too
    console.log("run");
    inventoryTabsHandler();
  });

  export const openInventoryDialog = () => {
    // For stuff like All, Food, Key Items, Drugs, etc
    let inventoryTabs = $('<div class="inventory-tabs"></div>');
    let inventoryRow = $('<div class="inventory-row"></div>');

    // SECTION - Populate inventoryTabs
    let arrayOfTabStrings = Object.values(ItemTag).filter((value) => {
      return typeof value == "string" && value != "DUMMY";
    }) as string[];

    // Leave the old array untouched
    let editedArr = [...arrayOfTabStrings];

    // To turn stuff like "DUMMY" to "Dummy"
    // TODO - Make "KEY_ITEMS" turn to "Key Items" not "Key_items"
    editedArr.forEach((tabString, index) => {
      editedArr[index] = tabString.toLocaleLowerCase();
      editedArr[index] =
        editedArr[index].charAt(0).toLocaleUpperCase() +
        editedArr[index].slice(1);
    });
    // I'll just hardcode it for now
    console.log(editedArr);

    for (let i = 0; i < editedArr.length; i++) {
      const tabString = editedArr[i];
      // The real ItemTag is stored as the `sorting-tag`
      let tab = $(
        `<button sorting-tag=${arrayOfTabStrings[i]}>${tabString}</button>`
      );
      tab.ariaClick(() => {
        inventoryTabButtonHandler(tab, inventoryRow);
      });

      inventoryTabs.append(tab);
    }

    // SECTION - Populate inventoryRow
    populateInventoryRowItems(inventoryRow);

    Dialog.setup("Inventory", "inventory-dialog");
    Dialog.append(inventoryTabs).append(inventoryRow);
    Dialog.open();

    // Make the tabs as long as the rows
    inventoryTabsHandler();

    // Add the mouseover event to the items. This ensures it happens on the first time the dialog is opened
    inventoryTooltipHandler();
  };

  function populateInventoryRowItems(
    inventoryRow: JQuery<HTMLElement>,
    sortingTag?: ItemTag
  ) {
    if (sortingTag == undefined) sortingTag = ItemTag.ALL;

    let noDupeItemArr = returnNoDuplicateArrayOfInventoryIds();

    // Sort using the sortingTag (except if its `ItemTag.ALL`)
    if (sortingTag != ItemTag.ALL) {
      noDupeItemArr = noDupeItemArr.filter((id) => {
        return doesItemHaveTag(id, sortingTag);
      });
    }

    for (let i = 0; i < noDupeItemArr.length; i++) {
      const itemId = noDupeItemArr[i];
      const numOfDuplicates = getNumberOfItemDuplicates(itemId);
      const nameOfItem = getItem(itemId).name;
      const itemImageUrl = getItem(itemId).imageUrl;

      const itemSellingPrice =
        getItem(itemId).price == ItemProperties.PRICE_CANNOT_BE_BOUGHT
          ? `$0`
          : `$${getItem(itemId).price * 0.45}`;
      const itemWeight =
        getItem(itemId).weight < 1000
          ? `${getItem(itemId).weight}g`
          : `${(getItem(itemId).weight / 1000).toFixed(2)}kg`;
      const itemDescription = getItem(itemId).description;

      // TODO - Add at most 3 different locations the item was found and finally a Use button

      // Append the name, amount and image of the item
      inventoryRow.append(
        `<div class="inventory-item">
        <div class="inventory-item-name">&nbsp${nameOfItem}&nbsp</div>

        <div class="inventory-item-image pixel-art">
          <img src=${itemImageUrl}>

          <div class="inventory-tooltip">
            <p>
              <i>${itemDescription}</i>
            </p>

            <p>
                Selling Price = <span class="playerStatNeutral">${itemSellingPrice}</span>
                <br>
                Weight = <span class="playerStatNeutral">${itemWeight}</span>
            </p>
          </div>
        </div>

        <div class="inventory-item-footer">x${numOfDuplicates}&nbsp</div>
      </div>`
      );
    }

    // Add the mouseover event to the items
    inventoryTooltipHandler();
  }

  function inventoryTabButtonHandler(
    currentButton: JQuery<HTMLElement>,
    inventoryRow: JQuery<HTMLElement>
  ) {
    // Check the current selected button (the selected button will have a "selected" class)
    const currentSelectedBtn = getCurrentSelectedButton();

    // Set the selected button to the one from the argument
    if (currentSelectedBtn != currentButton) currentButton.addClass("selected");

    // If not undefined and not the same button, remove the selected class from currentSelectedBtn
    if (currentSelectedBtn && currentSelectedBtn[0] != currentButton[0])
      currentSelectedBtn.removeClass("selected");

    // Resort the items shown in the inventory
    // but first, get the value we'll be sorting with
    const sortingTag = getSortingValueFromSelectedBtn(currentButton);

    // Empty the element containing our displayed items and rebuild it with the new sorting order
    inventoryRow.empty();
    populateInventoryRowItems(inventoryRow, sortingTag);
  }

  function getCurrentSelectedButton(): JQuery<HTMLElement> | undefined {
    const invTabs = $(".inventory-tabs");

    // Loop through its children (the buttons) and check for any with the "selected" class
    for (let i = 0; i < invTabs.children().length; i++) {
      const tab = invTabs.children()[i];

      if ($(tab).hasClass("selected")) {
        return $(tab);
      }
    }

    // Didn't find any so return undefined
    return undefined;
  }

  function getSortingValueFromSelectedBtn(
    button: JQuery<HTMLElement>
  ): ItemTag {
    // Get the `sorting-tag` of the button that was created with the latter
    const sortingTag = button.attr("sorting-tag");

    // Get all the string tags from `ItemTag`
    const tagArray = Object.values(ItemTag).filter((value) => {
      return typeof value == "string";
    }) as string[];

    for (let i = 0; i < tagArray.length; i++) {
      const tag = tagArray[i];

      if (sortingTag == tag) return i;
    }

    // Shouldn't happen if this function is called correctly
    return undefined;
  }

  // Deal with the inventory tabs (basically making them as long as inventory-row is)
  function inventoryTabsHandler() {
    const inventoryTabsContainer = $(`.inventory-tabs`);

    const inventoryRowContainer = $(`.inventory-row`);

    // Set the width of the tabs to that of the inventory row (including the latter's padding)
    inventoryTabsContainer.width(
      inventoryRowContainer.width() +
        parseInt(inventoryRowContainer.css("padding-left")) +
        parseInt(inventoryRowContainer.css("padding-right")) +
        4
    );
  }
}
