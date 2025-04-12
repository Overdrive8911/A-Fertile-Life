import {
	macroSkipTime,
	macroUpdateGameTime,
} from "../../../../date_and_time/macro_definitions";
import { convertToClass } from "../../../../declarations/general_declarations";
import { fertiloIncGroundFloorCorridor1 } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/ground_floor";
import { fertiloIncPlayerRoom } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/underground";
// Assuming these locations exist or will be created
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import { br, em, p, span, strong } from "../../../functions/html_elements";
import {
	macroButton,
	macroIf,
	macroLink,
	macroLinkReplace,
	macroSetOrRun,
	macroSilently,
	macroTimed,
} from "../../../functions/macros";
import { PC, stateFulVar } from "../../../functions/others";
import {
	addPassage,
	generateRandomTempVar,
} from "../../../functions/passage_funcs";
// Assuming these styles exist
import {
	defaultText,
	femaleSpeech,
	hintText,
	maleSpeech,
	otherSpeech,
} from "../../styles/speech.module.css";

// --- Passage: FertiloInc_Prologue_GettingToYourNewRoom ---

// Temporary variables for player choices
const playerSmiledAwkwardlyVar = generateRandomTempVar();
const playerTurnedFaceVar = generateRandomTempVar();

addPassage(
	StoryPassageName.PROLOGUE_GETTING_TO_YOUR_NEW_ROOM, // Assumed Enum value
	[fertiloIncGroundFloorCorridor1.uuid], // Assumed location
	p(
		"Mr. Fert quickly makes his way down the unassuming corridor you followed earlier, almost dragging you along with him. You think he's excited to show you the room he prepared but, other than his unexpected restlessness, it's hard to read into his exact intentions."
	) +
		p(
			span(
				{ class: maleSpeech },
				"“Try not to lag behind, it's quite the distance from here.”"
			) +
				" he says, with no form of discernable enthusiasm; you can definitely discard that thought."
		) +
		p(
			"The both of you take an elevator close to the end of the corridor. You only notice it now, but the walls here are dreadfully bland… There's also a barely-audible dull scraping sound coming from one of them; " +
				span(
					{ class: hintText },
					"perhaps you should look into it later." // REVIEW - Kept original suggestion as it fits the hint style
				)
		) +
		p(
			'Inside the elevator, you see a neon green screen in place of the normal buttons used to navigate to different floors. It\'s currently showing a "10" on it. ' +
				span({ class: femaleSpeech }, em("Hmph, that's different.")) // REVIEW - Used "different"
		) +
		p(
			"The doctor quickly types something you can't understand onto the interface and the lift descends to the lower floors."
		) +
		p(
			'The number on the screen slowly drops to as the lift passes through the floors, going from "10" to "9", then "8", and so on. Simultaneously, the speakers spring to life and play the awfully monotonous sound known as elevator "music". Mr. Fert sighs into his palm and says, ' + // REVIEW - Used "play" instead of "blare"
				span(
					{ class: maleSpeech },
					"“I thought I told her to change the playlist last Monday… I really need to address these type of things personally.”"
				)
		) +
		p(
			"His comment — alongside the occasional whistle — is most of the interaction you get, and the atmosphere quickly dulls into silence afterwards; as much as it can, with that annoying jingle playing in the background. Your bored eyes dart around for anything interesting amongst the beige walls that confine you. The green interface from earlier was intriguing at first, but your fascination in it has since dwindled." // REVIEW - Grammar adjusted slightly for flow
		) +
		p(
			"What, eventually, does manage to grab your attention is the doctor himself. A few stealthy, side glances confirm that he's pretty tall; around a foot more than you. The combination of his impressively neat white coat and sleek black trousers give him the " +
				em("perfect") +
				" \"doctor look\". He's even got the stethoscope and all; just add a clipboard, and it'll be complete." // REVIEW - Used "doctor"
		) +
		p(
			"You're about to take note of his relatively-average looking hairstyle, when he finally turns to face you, his incisive emerald eyes catching you in the act. Mr. Fert chuckles " + // REVIEW - Used just "chuckles"
				"at the silly face you inadvertently made when trying to sneak a look at him. " +
				span(
					{ class: maleSpeech },
					"“Cira says I'm pretty handsome but I never thought I was " +
						em("that") +
						" eye-catching.”"
				) // REVIEW - Corrected tense to "thought"
		) +
		ctpNoId(
			{
				progress(progressText) {
					return (
						macroLink(
							"Smile awkwardly",
							macroSetOrRun(playerSmiledAwkwardlyVar, "true") + progressText
						) +
						br +
						macroLink(
							"Turn your face",
							macroSetOrRun(playerTurnedFaceVar, "true") + progressText
						)
					);
				},
			},
			{
				options: { clear: true },
				content: macroIf(
					{
						condition: playerSmiledAwkwardlyVar,
						content: p(
							"Your face reddens and you have no idea what to say; only mumbles of what might be an explanation manage to leave your lips. You quickly attempt to give a makeshift reason but end up stammering before you even speak. In embarrassment, you shut up and force an awkward smile, preferring not to worsen your situation."
						),
					},
					{
						condition: playerTurnedFaceVar,
						content: p(
							"Your face goes flush and, instinctively, you quickly face the other way. Occasionally, mumbles of what might be an explanation can be heard from you, however, you refuse to face the doctor for what feels like hours until the elevator eventually stops."
						),
					}
				),
				progress(progressText) {
					return macroLinkReplace(
						"Wait this out.",
						macroIf({
							condition: playerSmiledAwkwardlyVar,
							content: p(
								"With nothing left to lose, you decide to use the timeless technique of simply ignoring your problems and remaining in silence for what feels like hours."
							),
						}) + progressText
					);
				},
			},
			{
				progress(progressText) {
					/* TODO - Find a way to make the page auto scroll to the bottom once the first dot appears */
					// Add a delay before advancing to the next step
					return macroTimed(
						[
							{ delay: "3s", content: "." },
							{ delay: "2s", content: "." },
							{ delay: "2.5s", content: "." },
							{ delay: "1.75s", content: progressText },
						],
						true
					);
				},
			},
			{
				options: { t8n: true },
				content:
					p(
						/* TODO - Play an elevator "ding" sound here */
						span({ class: otherSpeech }, em("Ding!")) +
							' The elevator rings out as an automated voice says that it\'s safe to exit the lift; the green interface now displaying a "G". You sigh in relief as the ecru door slides open. The ride down felt much longer than you wanted it to be, when in reality, it was just shy of a minute.'
					) +
					p(
						"Mr. Fert walks out first and tells you, " +
							span(
								{ class: maleSpeech },
								"“We're pretty close now, it's right around the corner,”"
							) +
							" as if nothing happened earlier… After a short while of walking, the both of you make it to a short hallway lined with sleek, sliding doors on either side. Each one having a neon green interface beside it, just like the elevator's, except most are switched off." // REVIEW - Used "switched off", removed "cul-de-sac" and adjusted phrasing
					) +
					p(
						"The doctor takes you to a particular door close to the entrance of the hallway. Upon closer observation, you see that its green panel is powered up and has your first name, " +
							PC +
							", glowing in a steady virid colour, as well as a fingerprint icon just below it. " +
							span(
								{ class: maleSpeech },
								"“Yup, it's yours, but you probably guessed that already,”"
							) +
							" he says, when he notices you looking at the screen. " +
							span({ class: maleSpeech }, "“Let me show you around the pla—”")
					) +
					macroLink(
						"Next",
						"",
						StoryPassageName.PROLOGUE_GETTING_TO_YOUR_NEW_ROOM_MR_FERT_HAS_TO_LEAVE // Assumed Enum value
					),
			}
		)
);

// --- Passage: FertiloInc_Prologue_GettingToYourNewRoom_MrFertHasToLeave ---

addPassage(
	StoryPassageName.PROLOGUE_GETTING_TO_YOUR_NEW_ROOM_MR_FERT_HAS_TO_LEAVE, // Assumed Enum value
	[fertiloIncGroundFloorCorridor1.uuid], // Still in the corridor outside the room
	macroSkipTime(0, 0, 3) +
		p(
			/* TODO - Add the sound of a ringing phone here */
			span({ class: otherSpeech }, em("Ring-ring.")) +
				" Mr. Fert quickly pulls out a phone from his coat pocket and answers the call. " +
				/* NOTE - This is the patient that the player will see Mr. Fert dealing with the next day */
				/* TODO - Add a screen shake and give a different style to the text "What?" */
				span(
					{ class: maleSpeech },
					"“Ms Annalisa, I'm quite busy with a special guest now but I'll be back in 15 minutes… Huh… What?… A grade III high risk mother? I'll be there in a moment!”"
				)
		) +
		p(
			"The calls ends and the doctor pockets his phone. He sighs, looking obviously disappointed, and says, " +
				span(
					{ class: maleSpeech },
					"“And here I was, hopeful to introduce you to the new features I personally added… Looks like I'll leave you to experiment with your room, it shouldn't be too difficult to get a general feel of it. For starters, you simply need to let the device scan your fingerprint and the door will open.”"
				)
		) +
		p(
			"He prepares to leave the hallway but stops right before he goes. " +
				span(
					{ class: maleSpeech },
					"“It's getting late, so make sure to get something from the " +
						span({ class: hintText }, "fridge") + // REVIEW - Used "fridge"
						" I stocked up in advance, before heading to bed. Tomorrow will be quite the busy day for you,”"
				) +
				" he tells you before finally leaving. You hear the sounds of an elevator getting boarded shortly after."
		) +
		p(
			span(
				{ class: femaleSpeech },
				em("Well then, this shouldn't be too hard.")
			) +
				" You take out your hand and place a finger on the interface. It vibrates in response, causing you to remove the appendage, before a smiling face appears on the panel and welcomes you in by sliding the door open."
		) +
		macroLink("Enter", "", StoryPassageName.PROLOGUE_ENTERED_YOUR_ROOM) // Assumed Enum value
);

// --- Passage: FertiloInc_Prologue_EnteredYourRoom ---

addPassage(
	StoryPassageName.PROLOGUE_ENTERED_YOUR_ROOM, // Assumed Enum value
	[fertiloIncPlayerRoom.uuid], // Assumed location
	macroSkipTime(0, 0, 2) +
		p(
			'You shudder as you walk into the dark cold interior of the room. It has a faint scent of that "hospital room smell" which is quite unusual since you haven\'t noticed it elsewhere.' +
				span(
					{ class: femaleSpeech },
					em("Of course… There should be a light switch somewhere around here")
				)
		) +
		p(
			"Choosing to brave the darkness, you slowly shuffle along the length of the wall. The wall feels very smooth and is quite cold to touch. You run your fingers along it, feeling for any bump that might indicate a light switch."
		) +
		p(
			"After a while, you bump into what you assume as the corner of the room and sigh. You shuffling backwards and searching on the other side but the cold is starting to be uncomfortable. In an attempt to warm yourself, you clasp your hands together."
		) +
		p(
			"No sooner do you do this when your room makes a buzzing sound. The lights glow to life and the air conditioning seems to calm down. Your room still makes the buzzing sound although at much lower volume. Eventually, it stops and you hear a—."
		) +
		p(
			span(
				{ class: otherSpeech },
				p(strong("DING!")) +
					"“Good evening, ma'am. I am the main pseudo-AI in charge of your room's surveillance and household duties. The doctor told me a lot about you and I assume you are weary now. A meal and resting area has been prepared in advance for you. Feel free to utilize them and any of my other services once you are well-rested. If you require any aid, simply call out to me.”" +
					p(strong("DING!"))
			)
		) +
		p(
			"The room promptly returns to silence, aside from the low hum of the air conditioning and refrigerator you recently noticed. An AI was quite the startle; they are very uncommon but " +
				em("not") +
				" unheard of. It makes sense that an establishment as big as Fertilo Inc would have at least one."
		) +
		p(span({ class: otherSpeech }, "[Your stomach rumbles]")) + // Represented placeholder
		p(
			"It dawns on you that you haven't had anything to eat for a while now. Fortunately, a ding from the microwave behind reminds you of what the AI said. You move over to it and pull the microwave open with its handle."
		) +
		p(
			"Inside, you find a relatively-hot air-tight food pack. Upon opening it, you see what can only be described as meat-coloured splooge. " +
				span(
					{ class: femaleSpeech },
					"“Mystery meat, my " + em("favourite") + ".”"
				)
		) +
		p(
			"After vainly checking the refrigerator and cabinets for anything that actually looked edible, you return to the ultra-processed \"food\" and decide it's better than nothing. The first spoonful of the thick sludge doesn't help with your appetite. A short whiff of it tells you it has no discernable odour in particular."
		) +
		p(
			"You raise the spoon to your mouth and clamp shut on it. The texture's about as weird as you thought — a fairly slimy yet thick ooze that easily slides down the throat. What you weren't expecting though, was the fact that it was tasteless. Not in the sense that it has no taste at all, rather, a multitude of toned-down flavours indiscernible to your tongue resulting in the final combination being somewhat bland. Still, you shovel it all down surprisingly quickly and feel quite satiated afterwards."
		) +
		p(
			"Drowsiness comes over as you let out an especially long yawn. To your convenience, a door on the side of the room opens up — almost as if triggered by your yawn — and reveals what looks to be a bedroom. You drag your tired body over to the room and promptly fall onto the bed."
		) +
		p(
			"It's really soft but with enough firmness that it doesn't sink in too much or become annoying. Soon enough, your eyelids shut and breathing slow as you drift off from this world…"
		) +
		/* TODO - Ensure macroUpdateGameTime function exists and works as expected */
		macroLink(
			"Next",
			macroUpdateGameTime("nextDay", 7, 30),
			StoryPassageName.PROLOGUE_TUTORIAL_FOR_YOUR_ROOM // Assumed Enum value
		)
);
