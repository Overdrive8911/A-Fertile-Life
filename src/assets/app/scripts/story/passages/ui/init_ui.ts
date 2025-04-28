// <!-- The top UI bar is divided into 3 sections; left, middle and right -->
//     <div id="ui-top-bar" data-init-passage="uiPassage_top_bar"></div>

import { convertToClass } from "../../../declarations/general_declarations";
import monoColorIcons from "./../../../../styles/spritesheet/mono_color_icons.module.css";
import { div, span } from "../../functions/html_elements";
import { macroMeter } from "../../functions/macros";
import {
	liveVar,
	gameDateAndTimeVar,
	playerVar,
	playerWombVar,
} from "../../functions/others";
import { icon24X24 } from "../styles/ui/shared.module.css";
import colorIcons from "../../../../styles/spritesheet/color_icons.module.css";
import {
	nav,
	left,
	middle,
	passageArea,
	right,
	sideViews,
	ui,
	time,
	statBars,
	playerSprite,
	statEffects,
	utilityBtns,
	save,
	inventory,
	restart,
	settings,
	map,
	otherStats,
	reminders,
	zoomInBtn,
	zoomOutBtn,
	mobile,
} from "./ui.module.css";
import { Default } from "../../../declarations/enums";
import { MeterDefault } from "../../../ui/macros/meter/meter";

//     <!-- Stays on the left. It's called a "section" because it contains the actual side bar AND a toggle button for it -->
//     <div id="ui-side-section" data-init-passage="uiPassage_side_section"></div>

//     <!-- Contains general choices like the movement options i.e North, West, East, South -->
//     <div id="ui-bottom-bar" data-init-passage="uiPassage_bottom_section"></div>

//     <!-- Stays on the right side. Contains the toggle for the map -->
//     <!--NOTE - FORGET THIS. I'LL JUST STUFF THE MAP to #ui-side-section -->
//     <div id="ui-opposite-side-section" data-init-passage="uiPassage_opposite_side_section"></div>

//     <!-- you must have one element with #id of 'passages' -->
//     <div id="passages"></div>

const statBarWidth = "90%";
const timeContainer = div(
	{ class: time },
	div(liveVar(gameDateAndTimeVar("dateText"))) +
		div(liveVar(gameDateAndTimeVar("timeText")))
);
const utilityBtnElements =
	div(
		{ class: save },
		div(
			{
				class: [icon24X24, monoColorIcons.saveIcon],
			},
			""
		) + "Save"
	) +
	div(
		{ class: inventory },
		div(
			{
				class: [icon24X24, monoColorIcons.inventoryIcon],
			},
			""
		) + "Inventory"
	) +
	div(
		{ class: settings },
		div(
			{
				class: [icon24X24, monoColorIcons.settingsIcon],
			},
			""
		) + "Settings"
	) +
	div(
		{ class: restart },
		div(
			{
				class: [icon24X24, monoColorIcons.restartIcon],
			},
			""
		) + "Restart"
	);
const reminderContainer = div(
	{ class: reminders },
	div("REMINDERS" + div({ class: [icon24X24, monoColorIcons.reminderIcon] })) +
		div(
			// Wrapper div to make the scrollbar look less clunky.
			div("**Display a list of recent reminders here**")
		)
);
const mapContainer = div(
	{ class: map },
	div("MAP CANVAS HERE. TAP TO OPEN A MAGNIFIED VIEW.") +
		div(
			{ class: zoomInBtn },
			div({ class: [icon24X24, monoColorIcons.zoomInIcon] })
		) +
		div(
			{ class: zoomOutBtn },
			div({ class: [icon24X24, monoColorIcons.zoomOutIcon] })
		)
);

// We'll have a grid with 3 columns
const storyUI = div(
	{ class: ui },
	div(
		{ class: mobile },
		div(timeContainer + utilityBtnElements + reminderContainer + mapContainer)
	) +
		div(
			{ class: left },
			div(
				{ class: sideViews },
				timeContainer +
					reminderContainer +
					mapContainer +
					div(
						{ class: otherStats },
						div(
							// { class: otherStatsChild },
							div(
								"Money" +
									div(
										{
											class: [
												icon24X24,

												// inventoryBtn,
												colorIcons.moneyIcon,
											],
										},
										""
									)
							) + ": 2300"
						) +
							div(
								""
								// { class: otherStatsChild },
								// div(
								// 	{
								// 		class: [
								// 			icon24X24,

								//
								// 			// inventoryBtn,
								// 			colorIcons.reputationIcon,
								// 		],
								// 	},
								// 	""
								// ) + ": 20%"
							)
					)
			) + div({ class: utilityBtns }, utilityBtnElements)
		) +
		div(
			{ class: middle },
			div(
				// This div here is just a wrapper solely because having a scrollbar looks blegh otherwise
				div({ class: passageArea })
			) + div(div({ class: nav }))
		) +
		div(
			{ class: right },
			div(
				{ class: statBars },
				div("STATS") +
					div(
						div(
							{
								class: [icon24X24, colorIcons.heartIcon],
							},
							""
						) +
							macroMeter(
								`${playerVar("hp")} / ${playerVar("maxHp")}`,
								statBarWidth
							)
					) +
					div(
						div(
							{
								class: [
									icon24X24,

									// inventoryBtn,
									colorIcons.energyIcon,
								],
							},
							""
						) +
							macroMeter(
								`${playerVar("energy")} / ${Default.MAX_STAT}`,
								statBarWidth,
								MeterDefault.HEIGHT,
								"blue",
								"blue",
								"blue"
							)
					) +
					div(
						div(
							{
								class: [
									icon24X24,

									// inventoryBtn,
									colorIcons.moodIcon,
								],
							},
							""
						) +
							macroMeter(
								`${playerVar("mental", "mood")} / ${Default.MAX_STAT}`,
								statBarWidth
							)
					) +
					div(
						div(
							{
								class: [
									icon24X24,

									// inventoryBtn,
									colorIcons.hungerIcon,
								],
							},
							""
						) +
							macroMeter(
								`${playerVar("fullness")} / ${Default.MAX_STAT}`,
								statBarWidth
							)
					) +
					div(
						div(
							{
								class: [
									icon24X24,

									// inventoryBtn,
									colorIcons.uterusHpIcon,
								],
							},
							""
						) +
							macroMeter(
								`${playerWombVar("hp")} / ${playerWombVar("maxHp")}`,
								statBarWidth
							)
					) +
					div(
						div(
							{
								class: [
									icon24X24,

									// inventoryBtn,
									colorIcons.uterusExpIcon,
								],
							},
							""
						) + macroMeter(`${playerWombVar("exp")} / 1000}`, statBarWidth)
					)
			) +
				div(
					{ class: statEffects },
					div("STATUS EFFECTS") +
						// This div will the container of the icons representing whatever ailments / buffs / status effects the player is suffering / benefiting from.
						// It will be able to show, at most, 16 ~ 36 icons at a time
						div()
				) +
				div(
					{ class: playerSprite },
					div("YOU") +
						// This div will host the player's sprite
						div()
				)
		)
);

// This will attach a new container to the empty story interface that we can easily add stuff to
$(document).one(":passageend", () => {
	const interfaceContainer = $("#interface");
	const originalPassageContainer = $("#passages");
	// interfaceContainer.empty(); //.find("br").remove()

	interfaceContainer.wiki(storyUI);
	// Move the passages
	originalPassageContainer.detach().appendTo($(convertToClass(passageArea)));

	// For some reason, attached event handlers don't work until I refresh the passage :(
	Engine.play(passage());
});
