namespace NSPregnancy {
  // NOTE - This function assumes the player is pregnant
  function getPlayerPregDescription() {
    let pregText =
      "You ogle your body from the mirror positioned in front of you. ";

    const womb = variables().player.womb;
    const approxBellySize = womb.lowerBellySizeThreshold;

    // To reduce repetition
    const a = (textToAdd: string) => {
      pregText += textToAdd;
    };

    // TODO - Replace the placeholder text and account for overdue/multiple pregnancies
    switch (approxBellySize) {
      case BellyState.PREG_MIN:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(
              `You feel uneasy, nervous, and a tiny bit excited when you look over to your abdomen. “Nothing yet…” Many thoughts zip through your mind as you begin your journey into motherhood. You are unaware as to when you started rubbing it but a sense of maternal calm soon washes over you. `
            );
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(
              `“Here we go again…” you think. You're still new to this whole pregnancy thing and feel no less nervous than when you had your first. A hand moves over your flat middle and idly rubs it as you stare at your reflection. `
            );
            break;
          case BirthRecordThreshold.STARTER:
            a(
              `Although you can't see it yet, you know you're pregnant again. You never imagined you'd get used to this, talk less of an irrepressible excitement beginning to show as a grin. You're ready to take on whatever this pregnancy throws at you! `
            );
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(
              `A smile creeps unto your face as you slowly rub your flat midsection, you can't help but grin for what is to come. “Soon…” you say as a maternal warmth washes over you. `
            );
            break;
          case BirthRecordThreshold.VETERAN:
            a(
              `You grin ear to ear, eagerly rubbing your belly in anticipation. Sure, you've gone through this rodeo many times, but the feelings have never waned (PPD is a bitch though) and this pregnancy isn't gonna be different. `
            );
            break;

          default:
            a(
              `You grin ear to ear, eagerly rubbing your belly in anticipation. Your composure crumbles as you fantasize about the inevitable growth you'll experience. Your breasts, thighs, and most importantly, belly expanding with each passing day. Not even the silly threats of morning sickness or birth stops you from indulging in your fantasy. `
            );
            break;
        }
        break;
      case BellyState.EARLY_PREGNANCY:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      case BellyState.EARLY_PREGNANCY_2:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      case BellyState.VISIBLE_PREGNANCY:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      case BellyState.LATE_PREGNANCY:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      case BellyState.LATE_PREGNANCY_2:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      case BellyState.FULL_TERM:
        switch (womb.birthRecord) {
          case BirthRecordThreshold.NEWB:
            a(`TEST1`);
            break;
          case BirthRecordThreshold.INEXPERIENCED:
            a(`TEST2`);
            break;
          case BirthRecordThreshold.STARTER:
            a(`TEST3`);
            break;
          case BirthRecordThreshold.EXPERIENCED:
            a(`TEST4`);
            break;
          case BirthRecordThreshold.VETERAN:
            a(`TEST5`);
            break;

          default:
            a(`TEST6`);
            break;
        }
        break;
      default:
        a(`TEST DEFAULT`);
        break;
    }

    return pregText;
  }

  // @ts-expect-error
  window.t = getPlayerPregDescription;
}
