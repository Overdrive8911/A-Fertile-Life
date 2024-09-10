namespace NSInventoryAndItem {
  // Accepts 2 parameters; the itemId and the amount to give. The latter is optional and defaults to 1 if omitted
  Macro.add("giveItem", {
    handler: function () {
      const itemIdString: string = this.args[0]; // e.g FOOD_CHEESE
      const itemId: ItemId = Inventory.tryConvertStringItemId(itemIdString);
      let amount: number = this.args[1];

      if (!Inventory.validateItemId(itemId)) {
        this.error("Item Id does not exist.");
      }

      if (amount === undefined) amount = 1;

      while (amount > 0) {
        variables().player.inventory.storeItem(itemId);
        amount--;
      }
    },
  });

  Macro.add("deleteItem", {
    handler: function () {
      const itemIdString: string = this.args[0]; // e.g FOOD_CHEESE
      const itemId: ItemId = Inventory.tryConvertStringItemId(itemIdString);
      let amount: number = this.args[1];

      if (!Inventory.validateItemId(itemId)) {
        this.error("Item Id does not exist.");
      }

      if (amount === undefined) amount = 1;

      while (amount > 0) {
        variables().player.inventory.removeItem(itemId, amount);
        amount--;
      }
    },
  });

  setup.addAllItems = () => {
    for (const key in gInGameItems) {
      if (Object.prototype.hasOwnProperty.call(gInGameItems, key)) {
        const item = gInGameItems[key as unknown as ItemId];

        if (item !== undefined) {
          variables().player.inventory.storeItem(item.itemId);
        }
      }
    }
  };
}
