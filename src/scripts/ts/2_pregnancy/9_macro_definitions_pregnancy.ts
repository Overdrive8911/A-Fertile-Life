namespace NSPregnancy {
  Macro.add("impregnate", {
    handler: function () {
      const sourceVirility: number = this.args[0];
      const sourceVirilityBonus: number = this.args[1];
      const targetWomb: Womb = this.args[2];
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
      const womb: Womb = this.args[0];

      womb.updatePregnancyGrowth();
    },
  });

  Macro.add("isPregBellySizeInRange", {
    handler: function () {
      const womb: Womb = this.args[0];
      const varNameToStoreResult: string = this.args[0];
      const lowerRange: BellyState | keyof typeof BellyState = this.args[1];
      const upperRange: BellyState | keyof typeof BellyState | undefined =
        this.args[2];

      if (varNameToStoreResult.charAt(0) == "$") {
        variables()[varNameToStoreResult] = womb.isBellySizeInRange(
          lowerRange,
          upperRange
        );
      } else {
        temporary()[varNameToStoreResult] = womb.isBellySizeInRange(
          lowerRange,
          upperRange
        );
      }
    },
  });
}
