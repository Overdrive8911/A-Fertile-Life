import { listenToTimeUpdateEvent } from "../date_and_time/date_and_time_declarations";

listenToTimeUpdateEvent((d) => {
  const playerWomb = variables().player.womb;
  playerWomb.updatePregnancy();
  playerWomb.addHp(playerWomb.gradualWombHealthIncreaser());

  if (playerWomb.isLiableForBirth) playerWomb.triggerBirth();

  if (!playerWomb.isPregnant && playerWomb.isPostPartum) {
    playerWomb.postpartumCounter -=
      (variables().gameDateAndTime.getTime() -
        playerWomb.lastBirth!.getTime()) /
      1000;
  }
});
