export function updateGameTimeVariable(timeInSeconds: number) {
  // copy out the date
  const oldDate = new Date(variables().gameDateAndTime);

  // Convert to milliseconds and add to the old date
  variables().gameDateAndTime = new Date(
    oldDate.getTime() + 1000 * timeInSeconds
  );

  // Do stuff that should update when time changes
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
}
