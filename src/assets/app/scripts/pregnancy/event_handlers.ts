import { listenToCustomEvent } from "../declarations/custom_events";
import { CustomEventName } from "../declarations/enums";

listenToCustomEvent(CustomEventName.TIME_UPDATE, (d) => {
  const playerWomb = variables().player.womb;
  playerWomb.updatePregnancy(d.timeDiff);
  playerWomb.addHp(playerWomb.gradualWombHealthIncreaser());

  if (playerWomb.isLiableForBirth) playerWomb.triggerBirth();

  if (!playerWomb.isPregnant && playerWomb.isPostPartum) {
    playerWomb.postpartumCounter -=
      (variables().gameDateAndTime.getTime() -
        playerWomb.lastBirth!.getTime()) /
      1000;
  }
});
