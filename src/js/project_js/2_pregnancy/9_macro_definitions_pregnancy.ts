// Add the `tryToImpregnate()` as a macro
Macro.add("impregnate", {
  handler: function () {
    const sourceVirility: number = this.args[0];
    const sourceVirilityBonus: number = this.args[1];
    const targetWomb: Womb = this.args[2];
    const numOfFetusesToForceToSpawn: number | undefined = this.args[3];

    tryCreatePregnancy(
      sourceVirility,
      sourceVirilityBonus,
      targetWomb,
      numOfFetusesToForceToSpawn
    );
  },
});

Macro.add("updatePregnancy", {
  handler: function () {
    const womb: Womb = this.args[0];

    updatePregnancyGrowth(womb);
  },
});
