namespace NSPregnancy {
  // NOTE - This function assumes the player is pregnant
  function getPlayerPregDescription() {
    let pregText =
      "You ogle your body from the mirror positioned in front of you. ";

    const womb = variables().player.womb;
    const bellySize = womb.bellySize;

    const a = (textToAdd: string) => {
      pregText += textToAdd;
    };

    if (bellySize > BellyState.PREG_MIN && bellySize < 3) {
      switch (womb.birthRecord) {
        case BirthRecordThreshold.NEWB:
          a("You feel a ting");
          break;

        default:
          break;
      }
    }

    return pregText;
  }
}
