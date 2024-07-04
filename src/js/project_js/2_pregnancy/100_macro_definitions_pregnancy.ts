// Add the `tryToImpregnate()` as a macro
Macro.add("impregnate", {
  handler: function () {
    const sourceVirility = this.args[0];
    const sourceVirilityBonus = this.args[1];
    const targetWomb = this.args[2];

    tryToImpregnate(sourceVirility, sourceVirilityBonus, targetWomb);
  },
});
