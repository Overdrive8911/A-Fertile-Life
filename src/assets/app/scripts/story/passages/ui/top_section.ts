import { UiPassageName } from "./enums";
import { forceAddUI } from "./functions";
import inventoryIcon from "./../../../../../media/img/ui/icons/24x24/purse_inventory.webp";
import saveIcon from "./../../../../../media/img/ui/icons/24x24/save.webp";
import settingsIcon from "./../../../../../media/img/ui/icons/24x24/settings.webp";
import restartIcon from "./../../../../../media/img/ui/icons/24x24/restart.webp";
import bugReportIcon from "./../../../../../media/img/ui/icons/24x24/bug_report.webp";
import heartIcon from "./../../../../../media/img/ui/icons/24x24/heart.webp";
import energyIcon from "./../../../../../media/img/ui/icons/24x24/energy.webp";
import moodIcon from "./../../../../../media/img/ui/icons/24x24/mood.webp";
import fullnessIcon from "./../../../../../media/img/ui/icons/24x24/stomach.webp";
import wombHpIcon from "./../../../../../media/img/ui/icons/24x24/uterus_hp.webp";
import wombExpIcon from "./../../../../../media/img/ui/icons/24x24/uterus_exp.webp";
import moneyIcon from "./../../../../../media/img/ui/icons/24x24/money.webp";
import reputationIcon from "./../../../../../media/img/ui/icons/24x24/reputation.webp";

import { iconFilter, pixelArt } from "./../styles/img.module.css";
import {
  topBarLeft,
  settings as topBarSettingsArea,
  timeDisplayContainer,
  timeDisplay,
  otherStats,
  otherStatsChild,
} from "./../styles/ui/top_section.module.css";
import { div, img } from "../../functions";

const nonBreakingSpace = "&#x00A0;";

const passageText = [
  // Container for inventory, settings, saves, restart, etc icons and time
  div(
    { class: [topBarLeft] },
    div(
      { class: [topBarSettingsArea] },
      div(
        { class: ["ui-icon-glow"] },

        img({
          class: ["icon24x24", iconFilter, pixelArt],
          src: inventoryIcon,
          alt: "Greyscale Purse-shaped Inventory Button",
        })
      ) +
        div(
          { class: ["ui-icon-glow"] },

          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: saveIcon,
            alt: "Greyscale Floppy Disk-shaped Save Button",
          })
        ) +
        div(
          { class: ["ui-icon-glow"] },

          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: settingsIcon,
            alt: "Greyscale Gear-shaped Settings Button",
          })
        ) +
        div(
          { class: ["ui-icon-glow"] },

          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: restartIcon,
            alt: "Greyscale Restart Button",
          })
        ) +
        div(
          { class: ["ui-icon-glow"] },

          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: bugReportIcon,
            alt: "Greyscale Bug Report Button",
          })
        )
    ) +
      div(
        {
          id: "ui-settings-button-time-border-and-bg",
          class: [timeDisplayContainer],
        },
        div(
          { id: "ui-settings-button-time", class: [timeDisplay] },
          div({}, "{{ $gameDateAndTime.dateText }}") +
            div({}, "{{ $gameDateAndTime.timeText }}")
        )
      )
  ),
  // Container for the middle section that contains the stat bars and their icons
  div(
    { id: "ui-top-bar-middle" },
    div(
      { id: "ui-stat-bars" },
      div(
        { class: ["ui-stat-bars-group"] },
        div(
          { class: ["ui-stat-bar-and-icon"] },
          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: heartIcon,
            alt: "Red Heart-shaped Health Icon",
          }) +
            `<span class="ui-stat-bar-hp">
                <<meter "$player.hp / $player.maxHp">>
            </span>`
        ) +
          div(
            { class: ["ui-stat-bar-and-icon"] },
            img({
              class: ["icon24x24", iconFilter, pixelArt],
              src: energyIcon,
              alt: "Yellow Lightning-shaped Energy Icon",
            }) +
              `<span class="ui-stat-bar-energy">
                  <<meter "$player.energy / 100" null "1rem" null "blue" "blue" "blue">>
              </span>`
          )
      ) +
        div(
          { class: ["ui-stat-bars-group"] },
          div(
            { class: ["ui-stat-bar-and-icon"] },
            img({
              class: ["icon24x24", iconFilter, pixelArt],
              src: moodIcon,
              alt: "Yellow Smiley Face Mood Icon",
            }) +
              `<span class="ui-stat-bar-mood">
                  <<meter "$player.mental.mood / 100">>
              </span>`
          ) +
            div(
              { class: ["ui-stat-bar-and-icon"] },
              img({
                class: ["icon24x24", iconFilter, pixelArt],
                src: fullnessIcon,
                alt: "Pink Stomach Icon",
              }) +
                `<span class="ui-stat-bar-hunger">
                    <<meter "$player.fullness / 100">>
                </span>`
            )
        ) +
        div(
          { class: ["ui-stat-bars-group"] },
          div(
            { class: ["ui-stat-bar-and-icon"] },
            img({
              class: ["icon24x24", iconFilter, pixelArt],
              src: wombHpIcon,
              alt: "Pink Womb Icon with a small red heart in the lower right corner",
            }) +
              `<span class="ui-stat-bar-womb-hp">
                  <<meter "$player.womb.hp / $player.womb.maxHp">>
              </span>`
          ) +
            div(
              { class: ["ui-stat-bar-and-icon"] },
              img({
                class: ["icon24x24", iconFilter, pixelArt],
                src: wombExpIcon,
                alt: "Pink Womb Icon with a small experience bar in the lower right corner",
              }) +
                `<span class="ui-stat-bar-womb-lvl">
                    <<meter "$player.womb.exp / $player.womb.maxExp">>
                </span>`
            )
        )
    )
  ),
  div(
    { id: "ui-top-bar-right" },
    div(
      { id: "ui-stat-others" },
      div(
        { class: ["ui-stat-others-money"] },
        img({
          class: ["icon24x24", iconFilter, pixelArt],
          src: moneyIcon,
          alt: "Three stacks of green cash layered above each other",
        }) + `${nonBreakingSpace + nonBreakingSpace}: 2300`
      ) +
        div(
          { class: ["ui-stat-others-reputation"] },
          img({
            class: ["icon24x24", iconFilter, pixelArt],
            src: reputationIcon,
            alt: "Reputation Icon",
          }) + `${nonBreakingSpace + nonBreakingSpace}: 20%`
        )
    )
  ),
  // It will be positioned below the top bar (using flex power) and will show the name of the current location/sub location the player is in
  div({ id: "ui-top-bar-current-location-view" }, "Fertilo Inc Reception"),
];

forceAddUI(UiPassageName.TOP_SECTION, passageText);
