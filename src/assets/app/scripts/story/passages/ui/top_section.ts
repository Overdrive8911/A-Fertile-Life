import { UiPassageName } from "./enums";
import { forceAddUI } from "./functions";
// import inventoryIcon from "./../../../../../media/img/ui/icons/24x24/purse_inventory.webp";
// import saveIcon from "./../../../../../media/img/ui/icons/24x24/save.webp";
// import settingsIcon from "./../../../../../media/img/ui/icons/24x24/settings.webp";
// import restartIcon from "./../../../../../media/img/ui/icons/24x24/restart.webp";
// import bugReportIcon from "./../../../../../media/img/ui/icons/24x24/bug_report.webp";
import monoColorIcons from "./../../../../styles/spritesheet/mono_color_icons.module.css";
// import heartIcon from "./../../../../../media/img/ui/icons/24x24/heart.webp";
// import energyIcon from "./../../../../../media/img/ui/icons/24x24/energy.webp";
// import moodIcon from "./../../../../../media/img/ui/icons/24x24/mood.webp";
// import fullnessIcon from "./../../../../../media/img/ui/icons/24x24/stomach.webp";
// import wombHpIcon from "./../../../../../media/img/ui/icons/24x24/uterus_hp.webp";
// import wombExpIcon from "./../../../../../media/img/ui/icons/24x24/uterus_exp.webp";
// import moneyIcon from "./../../../../../media/img/ui/icons/24x24/money.webp";
// import reputationIcon from "./../../../../../media/img/ui/icons/24x24/reputation.webp";
import colorIcons from "./../../../../styles/spritesheet/color_icons.module.css";

import { pixelArt } from "./../styles/img.module.css";
import {
	topBarLeft,
	settings as topBarSettingsArea,
	timeDisplayContainer,
	timeDisplay,
	otherStats,
	otherStatsChild,
	topBarMiddle,
	statBarContainer,
	statBarGroup,
	statBarAndIcon,
	topBarRight,
	currArea,
	inventoryBtn,
	saveBtn,
	settingBtn,
	restartBtn,
} from "./../styles/ui/top_section.module.css";
import { icon24X24 } from "./../styles/ui/shared.module.css";
import {
	gameDateAndTimeVar,
	liveVar,
	playerVar,
	playerWombVar,
	stateFulVar,
} from "../../functions/others";
import { macroMeter } from "../../functions/macros";
import { div, img, span } from "../../functions/html_elements";
import { Default } from "../../../declarations/enums";

const nonBreakingSpaces = "&#x00A0;&#x00A0;";

const passageText = [
	// Container for inventory, settings, saves, restart, etc icons and time
	div(
		{ class: topBarLeft },
		div(
			{ class: topBarSettingsArea },
			div(
				div(
					{
						class: [
							icon24X24,

							pixelArt,
							inventoryBtn,
							monoColorIcons.inventoryIcon,
						],
					},
					""
				)
			) +
				div(
					div(
						{
							class: [icon24X24, pixelArt, saveBtn, monoColorIcons.saveIcon],
						},
						""
					)
				) +
				div(
					{
						class: [
							icon24X24,

							pixelArt,
							settingBtn,
							monoColorIcons.settingsIcon,
						],
					},
					""
				) +
				div(
					{
						class: [
							icon24X24,

							pixelArt,
							restartBtn,
							monoColorIcons.restartIcon,
						],
					},
					""
				) +
				div(
					{
						class: [
							icon24X24,

							pixelArt,
							// inventoryBtn,
							monoColorIcons.bugReportIcon,
						],
					},
					""
				)
		) +
			div(
				{
					class: timeDisplayContainer,
				},
				div(
					{ class: timeDisplay },
					div(liveVar(gameDateAndTimeVar("dateText"))) +
						div(liveVar(gameDateAndTimeVar("timeText")))
				)
			)
	),
	// Container for the middle section that contains the stat bars and their icons
	div(
		{ class: topBarMiddle },
		div(
			{ class: statBarContainer },
			div(
				{ class: statBarGroup },
				div(
					{ class: statBarAndIcon },
					div(
						{
							class: [
								icon24X24,

								pixelArt,
								// inventoryBtn,
								colorIcons.heartIcon,
							],
						},
						""
					) + span(macroMeter(`${playerVar("hp")} / ${playerVar("maxHp")}`))
				) +
					div(
						{ class: statBarAndIcon },
						div(
							{
								class: [
									icon24X24,

									pixelArt,
									// inventoryBtn,
									colorIcons.energyIcon,
								],
							},
							""
						) +
							span(
								macroMeter(
									`${playerVar("energy")} / ${Default.MAX_STAT}`,
									undefined,
									"1rem",
									undefined,
									"blue",
									"blue",
									"blue"
								)
							)
					)
			) +
				div(
					{ class: statBarGroup },
					div(
						{ class: statBarAndIcon },
						div(
							{
								class: [
									icon24X24,

									pixelArt,
									// inventoryBtn,
									colorIcons.moodIcon,
								],
							},
							""
						) +
							span(
								macroMeter(
									`${playerVar("mental", "mood")} / ${Default.MAX_STAT}`
								)
							)
					) +
						div(
							{ class: statBarAndIcon },
							div(
								{
									class: [
										icon24X24,

										pixelArt,
										// inventoryBtn,
										colorIcons.hungerIcon,
									],
								},
								""
							) +
								span(
									macroMeter(`${playerVar("fullness")} / ${Default.MAX_STAT}`)
								)
						)
				) +
				div(
					{ class: statBarGroup },
					div(
						{ class: statBarAndIcon },
						div(
							{
								class: [
									icon24X24,

									pixelArt,
									// inventoryBtn,
									colorIcons.uterusHpIcon,
								],
							},
							""
						) +
							span(
								macroMeter(`${playerWombVar("hp")} / ${playerWombVar("maxHp")}`)
							)
					) +
						div(
							{ class: statBarAndIcon },
							div(
								{
									class: [
										icon24X24,

										pixelArt,
										// inventoryBtn,
										colorIcons.uterusExpIcon,
									],
								},
								""
							) + span(macroMeter(`${playerWombVar("exp")} / 1000}`))
						)
				)
		)
	),
	div(
		{ class: topBarRight },
		div(
			{ class: otherStats },
			div(
				{ class: otherStatsChild },
				div(
					{
						class: [
							icon24X24,

							pixelArt,
							// inventoryBtn,
							colorIcons.moneyIcon,
						],
					},
					""
				) + `${nonBreakingSpaces}: 2300`
			) +
				div(
					{ class: otherStatsChild },
					div(
						{
							class: [
								icon24X24,

								pixelArt,
								// inventoryBtn,
								colorIcons.reputationIcon,
							],
						},
						""
					) + `${nonBreakingSpaces}: 20%`
				)
		)
	),
	// It will be positioned below the top bar (using flex power) and will show the name of the current location/sub location the player is in
	div({ class: currArea }, "Fertilo Inc Reception"),
];

forceAddUI(UiPassageName.TOP_SECTION, passageText);
