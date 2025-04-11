import { convertToClass } from "../../../../declarations/general_declarations";
import { fertiloIncTopFloorCeoOffice } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/top_floor";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import { em, p, span } from "../../../functions/html_elements";
import { macroLink, macroReplace } from "../../../functions/macros";
import { PC } from "../../../functions/others";
import { addPassage } from "../../../functions/passage_funcs";
import { changeMe, clearMe } from "../../styles/other.module.css";
import {
	femaleSpeech,
	femaleSpeech2,
	maleSpeech,
	otherSpeech,
} from "../../styles/speech.module.css";

addPassage(
	StoryPassageName.PROLOGUE_MEET_THE_DOCTOR,
	[fertiloIncTopFloorCeoOffice.uuid],
	p(
		/* Maybe I can use "condition" instead of "gravidity" */
		"You leave the room and gently close the door behind you. Following the directions on the paper, you exit the visitor's area, cross the hallway, pass a bunch of nurseries, loop through some rooms, ride an elevator, as well as a couple of escalators until you finally reach the doctor's office. You don't encounter much of the staff, but the majority of the few you do see were all pregnant; some even more than Katie but strangely unfazed by their gravidity. It's a bit unsettling, but they're nice and even help you out after getting lost a couple of times."
	) +
		p(
			`The door to the doctor's office is at the end of the hallway, and you knock on it. A calm, smooth voice from inside tells you to come ${span(
				{ class: changeMe },
				"in"
			)}`
		) +
		ctpNoId(
			{
				progress(progressText) {
					return span(
						{ class: clearMe },
						macroLink(
							"Enter",
							macroReplace(convertToClass(clearMe)) +
								macroReplace(convertToClass(changeMe), " in, and you do so") +
								progressText
						)
					);
				},
			},
			{
				progress(progressText) {
					return (
						p(
							"Inside the office is quite spacious, with a large brown desk with a computer on it, a couple of chairs, a couch, and a few bookshelves. The doctor is sitting behind the desk, and he looks up from his papers to greet you."
						) +
						p(
							"He's a young-looking man, probably entering his thirties, with dark ebony skin that contrasts against his emerald-green gaze; it almost feels like he's scanning every part of you with them. His black shoulder-length hair gently sways in the wind; although that's likely due to the standing fan facing his desk . A name card pinned to his white doctor coat shows you his name, Dr. Fertilo. "
						) +
						p(
							"The man beckons you to a seat in front of his table. " +
								span(
									{ class: maleSpeech },
									`Miss ${PC}, I presume. Please have a seat before we discuss,”`
								) +
								" he says. For just a moment, you feel at ease, it almost feels as if his voice has a calming effect. You sit down on the chair offered while the doctor clears his table."
						) +
						p(
							span(
								{ class: femaleSpeech },
								"“I shouldn't be surprised you know my name already, with everything else you sent in that letter,”"
							) +
								" you tell him just as he finishes, but quickly end it once you notice that it's not the ideal way to start. " +
								span(
									{ class: femaleSpeech },
									`“${em(
										"Ahem."
									)} What I wanted to say was, how? How did you find out about me and my situation? Why are you looking for me? I'm definitely sure I wasn't on the news after the accident.”`
								)
						) +
						p(
							"Mr Fertilo lets out a small laugh and smiles at you. " +
								span(
									{ class: maleSpeech },
									"“You may be unsure of it now, but there's no reason to be so stiff here. We're in the same boat, after all.”"
								) +
								/*, telling somebody to bring someone he refers as <i>"her"</i> to his office.*/
								"He presses a button and speaks to his intercom in a hushed tone."
						) +
						p(
							`An energetic feminine voice replies, but you're only able to make out, ${span(
								{ class: femaleSpeech2 },
								"“On it boss!”"
							)} before he turns off the intercom.`
						) +
						p(
							span(
								{ class: maleSpeech },
								"“The next person to come here should be able to answer your first question, but till then, let me explain everything else, starting with myself…”"
							) +
								"The smile on his face partially fades into a more serious look. " +
								span(
									{ class: maleSpeech },
									`“It seems that my receptionist forgot to give you my name, since I noticed you staring at my name tag earlier. ${em(
										"Sigh."
									)} My secretary told me about her current condition. Don't worry about it, she'll be fine. Maybe I need to revisit the rules about the types of "pranks" not allowed here…`
								)
						) +
						p(
							span(
								{ class: maleSpeech },
								"Alright. My name is Mr. " +
									span({ class: otherSpeech }, "Fertilo") +
									" Guvala, the head doctor and owner of Fertilo Inc, but most people call me Dr. Fert. As for why I reached out to you...”"
							) +
								"He clears his throat and continues, " +
								span(
									{ class: maleSpeech },
									"“You and I share a common background. We are both subjects of <strong>illicit genetic experimentation</strong>.”"
								)
						) +
						p(
							span({ class: femaleSpeech }, "“I see…”") +
								"You stand up from your seat and look at Mr. Fert in disbelief. " +
								span(
									{ class: femaleSpeech },
									"“Y'know, I thought I could get answers here, but it turns out that you're delusional. I'm delusional. This is bullshit. Nothing here makes sense. Genetic experimentation? Nah, that only happens in movies. This can't be real. I probably hit my head way too hard.”"
								)
						) +
						p({ class: maleSpeech }, `“Miss ${PC}, please try to listen-”`) +
						p(
							{ class: femaleSpeech },
							"“No! I can't accept this. I won't accept this. It isn't real. I didn't lose my only job. I didn't have that dream earlier. I don't have any dumb tattoo on my belly.”"
						) +
						macroLink("I just can't", "", StoryPassageName.PROLOGUE_INFO_DUMP)
					);
				},
			}
		)
);

addPassage(
	StoryPassageName.PROLOGUE_INFO_DUMP,
	[fertiloIncTopFloorCeoOffice.uuid],
	""
);
