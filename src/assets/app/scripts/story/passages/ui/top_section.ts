import { UiPassageName } from "./enums";
import { forceAddUI } from "./functions";
import inventoryIcon from "./../../../../../media/img/ui/icons/24x24/purse_inventory.webp";

const nonBreakingSpace = "&#x00A0;";

const passageText = [
  // Container for inventory, settings, saves, restart, etc icons and time
  `<div id="ui-top-bar-left">
    <div id="ui-settings-buttons">
        <div class="ui-settings-button-inventory ui-icon-glow">
            <img class="icon24x24 icon-filter pixel-art" src=${inventoryIcon} alt="Greyscale Purse-shaped Inventory Button">
        </div>
        <div class="ui-settings-button-save ui-icon-glow">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/save.webp" alt="Greyscale Floppy Disk-shaped Save Button">
        </div>
        <div class="ui-settings-button-settings ui-icon-glow">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/settings.webp" alt="Greyscale Gear-shaped Settings Button">
        </div>
        <div class="ui-settings-button-restart ui-icon-glow">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/restart.webp" alt="Greyscale Restart Button">
        </div>
        <div class="ui-settings-button-report-bugs ui-icon-glow">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/bug_report.webp" alt="Greyscale Bug Report Button">
        </div>
    </div>
    <div id="ui-settings-button-time-border-and-bg">
        <div id="ui-settings-button-time">
            <div>{{ $gameDateAndTime.dateText }}</div>
            <div>{{ $gameDateAndTime.timeText }}</div>
        </div>
    </div>
</div>`,
  // Container for the middle section that contains the stat bars and their icons

  // Each `ui-stat-bars-group` is a container for a pair of 2 stat bars, and their icons, to be grouped as a column i.e HP & ENG, HUNGER & MOOD, and WOMB HP & WOMB LVL
  `<div id="ui-top-bar-middle">
    <div id="ui-stat-bars">
        <div class="ui-stat-bars-group">
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/heart.webp" alt="Red Heart-shaped Health Icon">
                <span class="ui-stat-bar-hp">
                    <<meter "$player.hp / $player.maxHp">>
                </span>
            </div>
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/energy.webp" alt="Yellow Lightning-shaped Energy Icon">
                <span class="ui-stat-bar-energy">
                    <<meter "$player.energy / 100" null "1rem" null "blue" "blue" "blue">>
                </span>
            </div>
        </div>
        <div class="ui-stat-bars-group">
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/mood.webp" alt="Yellow Smiley Face Mood Icon">
                <span class="ui-stat-bar-mood">
                    <<meter "$player.mental.mood / 100">>
                </span>
            </div>
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/stomach.webp" alt="Pink Stomach Icon">
                <span class="ui-stat-bar-hunger">
                    <<meter "$player.fullness / 100">>
                </span>
            </div>
        </div>
        <div class="ui-stat-bars-group">
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/uterus_hp.webp" alt="Pink Womb Icon with a small red heart in the lower right corner">
                <span class="ui-stat-bar-womb-hp">
                    <<meter "$player.womb.hp / $player.womb.maxHp">>
                </span>
            </div>
            <div class="ui-stat-bar-and-icon">
                <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/uterus_exp.webp" alt="Pink Womb Icon with a small experience bar in the lower right corner">
                <span class="ui-stat-bar-womb-lvl">
                    <<meter "$player.womb.exp / $player.womb.maxExp">>
                </span>
            </div>
        </div>
    </div>
</div>`,

  `<div id="ui-top-bar-right">
    <div id="ui-stat-others">
        <div class="ui-stat-others-money">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/money.webp" alt="Three stacks of green cash layered above each other"> ${
              nonBreakingSpace + nonBreakingSpace
            }: 2300
        </div>
        <div class="ui-stat-others-reputation">
            <img class="icon24x24 icon-filter pixel-art" src="media/img/ui/icons/24x24/reputation.webp" alt="Reputation Icon"> ${
              nonBreakingSpace + nonBreakingSpace
            }: 20%
        </div>
    </div>
</div>`,
  // It will be positioned below the top bar (using flex power) and will show the name of the current location/sub location the player is in
  `<div id="ui-top-bar-current-location-view">Fertilo Inc Reception</div>`,
];

forceAddUI(UiPassageName.TOP_SECTION, passageText);
