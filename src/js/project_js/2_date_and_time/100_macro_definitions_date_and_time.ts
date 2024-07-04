// Add a macro to deal with time changing
// E.g <<updateGameTime "nextDay" 7 30>> to skip to 7:30 on the next day, <<updateGameTime 21 15 21>> to skip to 3:21 pm 21 days forwards
Macro.add("updateGameTime", {
  skipArgs: false,
  handler: function () {
    const days: number | string = this.args[0];
    const hours: number = this.args[1];
    const minutes: number = this.args[2];

    if (days === "nextDay") {
      setup.skipToNextDayWithSpecificTime(hours, minutes);
    } else if (typeof days === "number") {
      skipSomeDaysToSpecificTime(days, hours, minutes);
    }
    // Deal with errors
    else if (typeof days === "string" && days !== "nextDay") {
      return this.error("Incorrect `days` value Do you mean 'nextDay'?");
    } else if (typeof hours !== "number") {
      return this.error("Incorrect data type for `hours`");
    } else if (typeof minutes !== "number") {
      return this.error("Incorrect data type for `minutes`");
    }
  },
});
