import { averageWalkingSpeed } from '../0_declarations/1_location_declarations/variables/0_other_data'
import { updateGameTimeAfterChangingPassage } from './1_game_date_and_time_updater'

const gameTimeUpdateAfterPassageNavigationEvent = new Event(
  'gameTimeUpdatedAfterPassageNavigation'
)

// Update the game time after changing location but not when the browser window is restarted/refreshed
$(document).one(':passageinit', () => {
  $(document).on(':passageinit', incomingPassage => {
    const currentPassageTitle = State.active.title
    updateGameTimeAfterChangingPassage(
      currentPassageTitle,
      incomingPassage.passage.title,
      averageWalkingSpeed[0]
    )

    // Dispatch the event
    document.dispatchEvent(gameTimeUpdateAfterPassageNavigationEvent)

    return 0
  })
  // ev.preventDefault();
})
