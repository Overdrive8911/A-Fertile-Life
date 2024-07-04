// Add the `tryToImpregnate()` as a macro
Macro.add("impregnate", {
  handler: function () {
    const sourceVirility: number = this.args[0];
    const sourceVirilityBonus: number = this.args[1];
    const targetWomb: Womb = this.args[2];

    tryToImpregnate(sourceVirility, sourceVirilityBonus, targetWomb);
  },
});
