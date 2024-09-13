namespace NSPregnancy {
  // Add the `tryToImpregnate()` as a macro
  Macro.add("impregnate", {
    handler: function () {
      const sourceVirility: number = this.args[0];
      const sourceVirilityBonus: number = this.args[1];
      const targetWomb: Womb1 = this.args[2];
      const numOfFetusesToForceToSpawn: number | undefined = this.args[3];

      targetWomb.tryCreatePregnancy(
        sourceVirility,
        sourceVirilityBonus,
        numOfFetusesToForceToSpawn
      );
    },
  });

  Macro.add("updatePregnancy", {
    handler: function () {
      const womb: Womb1 = this.args[0];

      womb.updatePregnancyGrowth();
    },
  });
}
