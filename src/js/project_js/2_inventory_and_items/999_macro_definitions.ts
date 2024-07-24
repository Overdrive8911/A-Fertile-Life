// Accepts 2 parameters; the itemId and the amount to give. The latter is optional and defaults to 1 if omitted
Macro.add("giveItem", {
  handler: function () {
    const itemIdString: string = this.args[0]; // e.g FOOD_CHEESE
    const itemId: ItemIds = getItemIdFromStringId(itemIdString);
    let amount: number = this.args[1];

    if (!validateItemId(itemId)) {
      this.error("Item Id does not exist.");
    }

    if (amount === undefined) amount = 1;

    while (amount > 0) {
      storeItem(itemId);
      amount--;
    }
  },
});

Macro.add("deleteItem", {
  handler: function () {
    const itemIdString: string = this.args[0]; // e.g FOOD_CHEESE
    const itemId: ItemIds = getItemIdFromStringId(itemIdString);
    let amount: number = this.args[1];

    if (!validateItemId(itemId)) {
      this.error("Item Id does not exist.");
    }

    if (amount === undefined) amount = 1;

    while (amount > 0) {
      removeItem(itemId, amount);
      amount--;
    }
  },
});
