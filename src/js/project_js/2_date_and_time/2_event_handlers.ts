const gameTimeUpdateAfterPassageNavigationEvent = new Event(
  "gameTimeUpdatedAfterPassageNavigation"
);

// Update the game time after changing location but not when the browser window is restarted/refreshed
$(document).one(":passageinit", () => {
  $(document).on(":passageinit", (incomingPassage) => {
    const currentPassageTitle = State.active.title;
    updateGameTimeAfterChangingPassage(
      currentPassageTitle,
      incomingPassage.passage.title,
      averageWalkingSpeed[0]
    );

    // Dispatch the event
    document.dispatchEvent(gameTimeUpdateAfterPassageNavigationEvent);

    return 0;
  });
  // ev.preventDefault();
});
