import { button, div, img } from "../../functions";
import {
  actionInterface,
  actionMenu,
  assistantDevice,
  backupContainer1,
  backupContainer2,
  btnLargeView,
  btnZoomIn,
  btnZoomOut,
  gameInfoAuthor,
  gameInfoBox,
  gameInfoName,
  gameInfoOthers,
  hidden,
  playerImage,
  popoutMap,
  popoutMapBtnBar,
  sideBar,
  stowed,
  toggleMapBtn,
  toggleStateBtn,
} from "../styles/ui/side_section.module.css";
import { UiPassageName } from "./enums";
import { forceAddUI } from "./functions";
import leftArrowHead from "./../../../../../media/img/ui/icons/16x16/left_facing_arrow_head_pointer.webp";
import gpsIcon from "./../../../../../media/img/ui/icons/16x16/gps_icon.webp";
import zoomIn from "./../../../../../media/img/ui/icons/20x20/zoom_in.webp";
import zoomOut from "./../../../../../media/img/ui/icons/20x20/zoom_out.webp";
import largeView from "./../../../../../media/img/ui/icons/20x20/large_view.webp";
import { icon16X16, icon20X20 } from "../styles/ui/shared.module.css";
import { pixelArt } from "../styles/img.module.css";

const passageText = [
  /* TODO - Add a ".stowed" class later and make the javascript simply toggle the class (for the most part) */
  div(
    { class: sideBar },
    div(
      { class: gameInfoBox },
      div({ class: gameInfoName }, "A Fertile Life") +
        div({ class: gameInfoAuthor }, "by Overdrive8911.") +
        // Stuff like sharing the game and other relevant info abt it like wikis, etc
        div({ class: gameInfoOthers }, "Lorem Ipsum Du Ala Mon.")
    ) +
      // NOTE - This will store some elements from the top bar, as well as the action interface, when the screen width is too small (i.e smartphones)
      div(
        { class: backupContainer1 },
        // Honestly, I don't feel like giving them classes/ids.
        // Just remember that:

        // Stores the leftmost icons (settings/saves/restart/etc)
        div("") +
          // Stores the rightmost icons (money/reputation/etc)
          div("") +
          // Stored the contents of the action interface
          div("")
      ) +
      // The last 2 div elements here will consume most of the space
      div({ class: playerImage }, "") +
      /*NOTE - This will store some elements from the top bar when the screen width is too small (i.e smartphones) */
      /* Will only contain the stat bars */
      div({ class: backupContainer2 }, "") +
      /* The player's AI companion. Not completely sure yet tho */
      div({ class: assistantDevice }, "")
  ),

  /* Contains buttons the user can interact with. Currently it contains the side toggle button and the map toggle */
  div(
    { class: actionMenu },
    button(
      { class: toggleStateBtn },
      img({
        class: [icon16X16, pixelArt],
        src: leftArrowHead,
        alt: "A left facing arrow head",
      }) + div("(Q)")
    ) +
      button(
        { class: toggleMapBtn },
        img({
          class: [icon16X16, pixelArt],
          src: gpsIcon,
          alt: "A greyscale icon of a simple gps over a circle",
        }) + div("(Z)")
      )
  ),

  /* Stuff like the map will appear here. It's meant to extend off when needed */
  div(
    { class: [actionInterface, stowed] },
    div(
      { class: [popoutMap, hidden] },
      /* This is be an invisible bar at the bottom of the map area that holds the "Zoom In", "Zoom Out", and "Large view" buttons. NOTE - It's positioned respective to "ui-side-bar-action-interface" not the map area itself */
      div(
        { class: popoutMapBtnBar },
        button(
          { class: btnZoomIn },
          img({ class: [icon20X20, pixelArt], src: zoomIn })
        ) +
          button(
            { class: btnZoomOut },
            img({ class: [icon20X20, pixelArt], src: zoomOut })
          ) +
          button(
            { class: btnLargeView },
            img({ class: [icon20X20, pixelArt], src: largeView })
          )
      )
    )
  ),
];

forceAddUI(UiPassageName.SIDE_SECTION, passageText);
