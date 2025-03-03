import { gSubLocationIcons24x24 } from './general_location_data'
import { gLocationMapSvgTable } from './map_svg_data'
import {
  gPlayerMapSpriteSrc,
  lastWarpDestination,
  setMapPopoutZoomLvl,
} from './other_data'
// import { loadGameMap } from './location_map_image_handlers'
import { isNavigationButtonUsable, warpToConnectedArea } from './navigation'
import { globalMap } from './game_locations/global_map'
import { Direction, SubLocationId } from './enums'
import {
  isAnyStoryFlagSet,
  StoryFlags,
} from '../declarations/general_declarations'
import { GlobalMap, SubLocation, type Location } from './classes'

// Pass in an Event
function validateKeyEvent(e: unknown) {
  const { target } = e as Event
  // Don't trigger in textboxes and similar elements
  if (
    target instanceof HTMLElement &&
    (['INPUT', 'TEXTAREA'].includes(target.nodeName) ||
      target.isContentEditable)
  )
    return false

  return true
}

// SECTION - For everything belonging to the map
// $(document).on(':passageend', () => {
//   // Load the map whenever the side bar button for the map is clicked
//   $('#ui-side-bar-toggle-map-button').on('click', function () {
//     // Don't question this. It works
//     if ($('#ui-side-bar-action-interface').hasClass('stowed')) {
//       loadGameMap(
//         variables().player.areaId,
//         $('.ui-side-bar-popout-map')
//       )
//     }
//   })
//   $(document)
//     .off('keyup.map')
//     .on('keyup.map', function (e) {
//       if (!validateKeyEvent(e)) return false
//       if (e.key == 'z') {
//         if ($('#ui-side-bar-action-interface').hasClass('stowed')) {
//           loadGameMap(
//             variables().player.areaId,
//             $('.ui-side-bar-popout-map')
//           )
//         }
//       }
//     })

//   const getZoomRatio = (element: JQuery<HTMLElement>) => {
//     // Check the transform value on the svg (It should be a scaled value i.e "matrix(2, 0, 0, 2, 0, 0)" corresponds with scale(2) ). If the property doesn't exist or if it's less than 1, default to 1
//     // NOTE - Index 3 in "matrix(2, 0, 0, 2, 0, 0)" will be 2, which is the number that is currently being scaled by
//     return $(element).css('transform') != 'none'
//       ? parseFloat($(element).css('transform').split(',')[3]) >= 1
//         ? parseFloat($(element).css('transform').split(',')[3])
//         : 1
//       : 1
//   }

//   const zoomMap = (element: JQuery<HTMLElement>, amountToZoom: number) => {
//     // Make sure the scale value doesn't go below 1
//     element.css(
//       'transform',
//       `scale(${
//         getZoomRatio(element) + amountToZoom > 1
//           ? getZoomRatio(element) + amountToZoom
//           : 1
//       })`
//     )

//     if (element[0] == $('.ui-side-bar-popout-map > svg')[0]) {
//       // Note that `element` represents the svg/image getting zoomed
//       setMapPopoutZoomLvl(getZoomRatio(element))
//     }
//   }

//   // Handlers for the zooming functionality of the map popout
//   $('.ui-side-bar-popout-map-button-bar > .button-zoom-in').ariaClick(() => {
//     // Check if the dialog for "Large View" is open
//     if (!Dialog.isOpen('map-large-view')) {
//       // Increment the zoom ratio by 0.5
//       zoomMap($('.ui-side-bar-popout-map > svg'), 0.5)
//     } else {
//       // Do the same but for the large view of the map
//       zoomMap($('.map-large-view > svg'), 0.5)
//     }
//   })
//   $('.ui-side-bar-popout-map-button-bar > .button-zoom-out').ariaClick(() => {
//     // Check if the dialog for "Large View" is open
//     if (!Dialog.isOpen('map-large-view')) {
//       // Decrement the zoom ratio by 0.5
//       zoomMap($('.ui-side-bar-popout-map > svg'), -0.5)
//     } else {
//       // Do the same for the large view of the map
//       zoomMap($('.map-large-view > svg'), -0.5)
//     }
//   })

//   // For handling the "Large View" functionality (it just displays the map in a large dialog)
//   $('.ui-side-bar-popout-map-button-bar > .button-large-view').ariaClick(() => {
//     Dialog.setup('Large View', 'map-large-view')
//     // Add dummy data
//     Dialog.append('')
//     Dialog.open()

//     // Load the map into here
//     loadGameMap(variables().player.locationData.location, $('.map-large-view'))
//   })

//   // // Preload the player sprite. If not, the function that centers it in a path may end up positioning it wrong
//   // let preloadImage: HTMLImageElement = null;
//   // if (!preloadImage) {
//   //   preloadImage = new Image();
//   //   preloadImage.src = gPlayerMapSpriteSrc;
//   // }
// })
// !SECTION

// SECTION - For everything relating to the location/subLocation display that resides right below the top bar
$(document).on(':passageend', () => {
  // Update the name of the location/sub location shown in "#ui-top-bar-current-location-view". An attribute "is-location-name" will store whether what is displayed is "true" or "false"
  const element = $('#ui-top-bar-current-location-view')
  const attrName = 'is-location-name'

  const area = globalMap.activeArea

  const setAreaName = () => {
    let imgUrl =
      gSubLocationIcons24x24[
        area instanceof SubLocation ? area.id : SubLocationId.DUMMY
      ]

    element.text(area.name).append(
      // Use the icon as a mask over a color that will be set by css
      `<div class="icon24x24" style="mask: url('${imgUrl}') center/contain;"></div>`
    )
    element.attr(attrName, 'false')
  }
  const setParentName = () => {
    element.text(!(area instanceof GlobalMap) ? area.parent.name : ':3')
    element.attr(attrName, 'true')
  }
  setAreaName()

  // Add a handler to the element so that when clicked, it will alternate between the location's name and sub location's name
  element.ariaClick(() => {
    if (element.attr(attrName) == 'true') {
      // The location's name is currently displayed so try to display the sub location (if any)
      setAreaName()
    } else if (element.attr(attrName) == 'false') {
      // The sub location's name is currently displayed so display it's location
      setParentName()
    }
  })
})
// !SECTION

// SECTION - For everything relating to the navigational buttons and the text displayed at the bottom of any "default" tagged passage
$(document).on(':passageend', () => {
  const northButton = $('#ui-navigation-option-button-north')
  const eastButton = $('#ui-navigation-option-button-east')
  const southButton = $('#ui-navigation-option-button-south')
  const westButton = $('#ui-navigation-option-button-west')

  // The copies of `lastWarpDestination` will be used for the bottom text displayed at the bottom of every "default" tagged passage
  const isNorthNavigable = isNavigationButtonUsable(Direction.NORTH)
  const isEastNavigable = isNavigationButtonUsable(Direction.EAST)
  const isSouthNavigable = isNavigationButtonUsable(Direction.SOUTH)
  const isWestNavigable = isNavigationButtonUsable(Direction.WEST)
  console.warn('CHECKED ALL NAVIGATION BUTTONS FOR THEIR USABILITY.')

  const navigate = (direction: Direction) => {
    warpToConnectedArea(direction)
  }

  // Click Events
  northButton.ariaClick(() => {
    navigate(Direction.NORTH)
  })
  eastButton.ariaClick(() => {
    navigate(Direction.EAST)
  })
  southButton.ariaClick(() => {
    navigate(Direction.SOUTH)
  })
  westButton.ariaClick(() => {
    navigate(Direction.WEST)
  })

  // Key Events
  $(document)
    .off('keyup.navigation_buttons') // To prevent multiple handlers from getting attached
    .on('keyup.navigation_buttons', e => {
      if (!validateKeyEvent(e)) return false
      if (e.key == 'w' && isNorthNavigable) navigate(Direction.NORTH)
    })
    .on('keyup.navigation_buttons', e => {
      if (!validateKeyEvent(e)) return false
      if (e.key == 'd' && isEastNavigable) navigate(Direction.EAST)
    })
    .on('keyup.navigation_buttons', e => {
      if (!validateKeyEvent(e)) return false
      if (e.key == 's' && isSouthNavigable) navigate(Direction.SOUTH)
    })
    .on('keyup.navigation_buttons', e => {
      if (!validateKeyEvent(e)) return false
      if (e.key == 'a' && isWestNavigable) navigate(Direction.WEST)
    })

  const navButtonUsabilityActions = (
    canMoveInDirection: boolean,
    button: JQuery<HTMLElement>
  ) => {
    if (!canMoveInDirection) {
      button.prop('disabled', true)
      button.css('filter', 'brightness(45%)').css('pointer-events', 'none')
    } else {
      button.prop('disabled', false)
    }
  }

  // if `isNavigationButtonUsable()` is true for a direction, disable the respective button and dim the colors
  navButtonUsabilityActions(isNorthNavigable ?? false, northButton)
  navButtonUsabilityActions(isEastNavigable ?? false, eastButton)
  navButtonUsabilityActions(isSouthNavigable ?? false, southButton)
  navButtonUsabilityActions(isWestNavigable ?? false, westButton)

  // SECTION - Code to handle displaying helpful text at the bottom of an eligible passage
  // Display a text, with a horizontal line above to section it away, at the bottom of every passage with a default tag that will tell the player what places the directions accessible lead to. The places in question will be highlighted. Note that the text should be randomly chosen from an array. E.g From {CURR_LOCATION}, you can head {east} to {EAST_LOCATION} or perhaps {south} to {SOUTH_LOCATION}. You're pretty sure that {WEST_LOCATION} is in the {west} and {NORTH_LOCATION} is in the {north}
  if (!isAnyStoryFlagSet(StoryFlags.IS_EVENT_ACTIVE)) {
    const currArea = globalMap.activeArea
    const a = currArea.siblings?.get(currArea as any)
    const currAreaDirections = a //as Exclude<typeof a, undefined>

    const directionPool = [...(currAreaDirections?.keys() ?? [])]
    const getRandomDirectionData = () => {
      const dir = directionPool.pluck() ?? Direction.NORTH

      return { dir: dir, name: currAreaDirections?.get(dir)?.area.name ?? '' }
    }

    const dirData1 = getRandomDirectionData()
    const dirData2 = getRandomDirectionData()
    const dirData3 = getRandomDirectionData()
    const dirData4 = getRandomDirectionData()
    const dirData5 = getRandomDirectionData()
    const dirData6 = getRandomDirectionData()

    // Below is an array containing multiple sub arrays. Each sub array is split into 5 parts, to deal with a 4 possible location/sub location as well as the current location/sub location. One of sub arrays will be selected at random and appended to the end of the current passage ()
    let CURR_AREA = currArea.name
    const AREA_DATA = {
      1: {
        direction: dirData1.dir,
        name: dirData1.name,
      },
      2: {
        direction: dirData2.dir,
        name: dirData2.name,
      },
      3: {
        direction: dirData3.dir,
        name: dirData3.name,
      },
      4: {
        direction: dirData4.dir,
        name: dirData4.name,
      },

      // TODO: Implement these later.
      5: {
        direction: dirData5.dir,
        name: dirData5.name,
      },
      6: {
        direction: dirData6.dir,
        name: dirData6.name,
      },
    } as const

    const greenColorClass = 'otherSpeech'
    const orangeColorClass = 'playerStatNeutral'
    const returnGreenText = (text: string) => {
      return `<span class=${greenColorClass}>${text}</span>`
    }
    const returnOrangeText = (text: string) => {
      return `<span class=${orangeColorClass}>${text}</span>`
    }

    const getRandomHelpfulText = () => {
      const currAreaText = returnOrangeText(CURR_AREA)
      const areaDir = (index: keyof typeof AREA_DATA) => {
        return returnGreenText(AREA_DATA[index].direction)
      }
      const areaDirName = (index: keyof typeof AREA_DATA) => {
        return returnGreenText(AREA_DATA[index].name)
      }
      /* NOTE 
        - No need to add unnecessary/messy whitespace 
        - Make sure that there is a punctuation at the end of each string (since if it will be the last string to be concatenated, the last character (i.e the punctuation) would be replaced with a period)
        */
      //TODO - Add support for `up` and down`
      const possibleHelpfulTextArray: string[][] = [
        [
          `From ${currAreaText},`,

          `you can head ${areaDir(1)} to ${areaDirName(1)},`,

          `or perhaps ${areaDir(2)} to ${areaDirName(2)}.`,

          `You're pretty sure that ${areaDirName(3)} is in the ${areaDirName(
            3
          )},`,

          `and ${areaDir(4)} is in the ${areaDirName(4)}.`,
        ],
        [
          `Currently, you're in ${currAreaText},`,

          `${areaDir(1)} is ${areaDirName(1)} of here,`,

          `while ${areaDir(2)} is likely ${areaDirName(2)}.`,

          `${areaDir(3)} is definitely ${areaDirName(3)},`,

          `with ${areaDir(4)} in the ${areaDirName(4)}.`,
        ],
        [
          `If you were to leave ${currAreaText},`,

          `${areaDir(1)} is to the ${areaDirName(1)},`,

          `and ${areaDirName(2)}, ${areaDir(2)}.`,

          `${areaDir(3)} goes in the ${areaDirName(3)},`,

          `while ${areaDir(4)} is ${areaDirName(4)}.`,
        ],
      ]

      const numOfValidAreas = currAreaDirections?.size ?? 0

      const text = possibleHelpfulTextArray
        .pluck()!
        .filter((val, index) => {
          return index <= numOfValidAreas
        })
        .join(' ')

      return `<br><br><br><hr><p>${text.slice(0, text.length - 1) + '.'}`
    }

    const textToDisplay = getRandomHelpfulText()
    const currentPassageOnDOM = $('#passages > [id^=passage]')

    // Append the text to the current passage
    currentPassageOnDOM.append(textToDisplay)
  }
  // !SECTION
})
// !SECTION

// SECTION - For preloading related images
// TODO: Replace this with a dynamically generated map
$(document).one(':passageend', () => {
  // NOTE - Move this function out of this namespace in the main branch
  ;(function preloadImages() {
    // NOTE - INSERT ALL IMAGES NEEDED HERE
    const imageUrls = [
      gPlayerMapSpriteSrc,
      gLocationMapSvgTable[(globalMap.activeArea as Location).id],
    ]

    imageUrls.forEach(url => {
      if (!url) return

      if (url.includes('svg')) {
        // Extract the value of the first's image's url in the svg
        url = url.split(/(?<=href\=\")([a-zA-Z0-9/_.-]+)/)[1]
      }

      const image = new Image()
      image.src = url
    })
  })()
})
