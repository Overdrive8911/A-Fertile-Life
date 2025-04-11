import { macroSkipTime } from "../../../../date_and_time/macro_definitions";
import { convertToClass } from "../../../../declarations/general_declarations";
import { fertiloIncTopFloorCeoOffice } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/top_floor";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import { br, div, em, p, span, strong } from "../../../functions/html_elements";
import { macroLink, macroReplace } from "../../../functions/macros";
import { PC, stateFulVar } from "../../../functions/others";
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
	macroSkipTime(0, 0, 3.5) +
		p(
			"A quick prick to your neck silences you and quickly drains your energy, forcing you back to your seat. You try to speak, but your mouth refuses to move. All you can do is to struggle quietly watch Mr. Fert who you see is beside you, holding a syringe. Now is probably not the best time to notice it, but you see that he's pretty tall; probably above 6 feet by a good margin. " +
				em({ class: femaleSpeech }, "When… Did… He… Get… There?")
		) +
		p(
			{ class: maleSpeech },
			"“Forgive me for that, but you were getting hysterical.”"
		) +
		p(
			"You give him an intense glare, then roll your yes when it becomes exhausting."
		) +
		p(
			span(
				{ class: maleSpeech },
				"“Don't worry much, see this other thing here?” "
			) +
				"He pulls out a small casing from his pocket. " +
				span(
					{ class: maleSpeech },
					"“This will give you back your strength, and you'll get it once I'm done.”"
				)
		) +
		p(
			"Other than the slowing movement of your eyes, you remain completely unresponsive. You want to be angry with him but can't find any more strength for that."
		) +
		p({ class: maleSpeech }, "“Good, so let's continue.”") +
		p(
			span(
				{ class: maleSpeech },
				`“We're the few ${em(
					"successful"
				)} results of genetic experimentation. Ever heard of the ${strong(
					"Super Human Extensive Modification Project"
				)}, ${strong("The SHEM Project")} or ${strong("S.H.E.M.P")}?”`
			)
		) +
		em(
			{ class: femaleSpeech },
			"SHEMP? That sounds stupid, but why does the name feel familiar…"
		) /* Fert's basically monologuing */ +
		div(
			{ class: maleSpeech },
			p(
				"“It sounds familiar, right? Well, that's because the project created us. It was a couple of decades ago in the 80s when the operation began, with technology far beyond its time, a private corporation sponsored by the government was tasked with the objective of achieving maximum human perfection. It might sound illogical or far-fetched, but somehow they had the equipment and man power that would even rival some of the greatest technological and health giants of our time."
			) +
				p(
					"The SHEM Project sourced DNA from basically every race as well as, a few animals, as long as they were genetically 'pure'. What was decided as pure and how they obtained it was quite unethical to say the least…"
				) +
				p(
					"After getting enough viable samples, they decided the best course of action was to create a bunch of us who in general would be better and more efficient than normal people. But also have an extreme affinity for a particular trait. For you, me and my wife, that trait is hyper-fertility. Why would they need that? It makes sense when you realize that it would be the best way to create a constant and “natural” supply of our kind, as well as passing on favourable traits to newer generations. It was expected that the “ideal human” would be birthed after long enough."
				) +
				p(
					"You see, we were created to be steeping stones in their journey to perfection. But people aren't perfect, so it was not surprising when out of the thousands of experiments created, most were either unviable or expired within a week. Even those deemed as successful as us did not come without flaw…"
				) +
				p(
					`As fertility-focused creations, our ability to bear offspring has been amplified a hundred-fold. Many of the problems associated with reproduction are a non-issue to us. The issue here is that our body is so adapted to childbearing that it ${strong(
						"needs"
					)} to continuously do that. If not, we would get worsening symptoms till eventually our organs fail. This is our major imperfection but was overlooked by our creators since we weren't needed for much else other than breeding. The only reason you've lasted this long is that the gene that enhances your reproductive capabilities has been dormant; at least until the accident at your former workplace, unlike mine and my partner's, which were activated promptly after creation.`
				) +
				p(
					"Fortunately—or unfortunately, depending on how you see it, it was found out that they committed multiple crimes against humanity in the name of science. The government, in order to save their face, cut off all their funding and demanded us, the results. The heads of the project decided to bail and destroy all the evidence, which should've included us. But the thing is, I can't remember any more details afterwards; the same goes for my wife. It's almost as if they wiped our memories of that incident."
				) +
				p(
					"I guess killing the rest of us wasn't worth the effort it took to make us, so they decided to scatter us instead; my spouse was the only one I found. In that case, it could mean they've been lying low all this while waiting for the right time, but it's been decades and nothing of note has happened relating to the project. Our only concern is the government, as long as you don't give them a reason to, they won't disturb us."
				) +
				p(
					"Now, back to you. I've been looking for the rest of our 'kind' ever since I attained my wealth; it started about a decade ago. In summary, it's been mostly unfruitful, that is, until I discovered you last month. You need to know that when your trait is 'activated', there are specific pheromones you'd unconsciously release which can be tested for. When the news came in, I sent some people to help me confirm it and when it came back positive, I was elated but worried too; it also seemed that the government was onto you."
				) +
				p(
					"Using my connections, I was also able to find out who you were and where you live, then I ordered one of my staff to bug your house and monitor you. I needed to accurately know your situation before I could make my proposition. I'm not proud of it—personal privacy is very important—but the end justifies the means, after all…”"
				)
		) +
		p(
			`With that, he finishes and pulls out the syringe from before, ${span(
				{ class: maleSpeech },
				"“Now that has been cleared up, I won't go back on my word,”"
			)} and jabs your neck. ${span(
				{ class: maleSpeech },
				"“Once again, I apologize for my rudeness.”"
			)}`
		) +
		macroLink("Next", "", StoryPassageName.PROLOGUE_INFO_DUMP_1)
);

addPassage(
	StoryPassageName.PROLOGUE_INFO_DUMP_1,
	[fertiloIncTopFloorCeoOffice.uuid],
	macroSkipTime(0, 0, 5) +
		p(
			"Almost immediately, you feel a surge of energy coursing within yourself and, in seconds, you're back on your feet. You look back at Mr. Fert who's now standing beside his desk and waiting for your reply. " +
				span(
					{ class: femaleSpeech },
					`“${em(
						"Sigh."
					)}  I really want to argue with you, but from every that's been happening recently, what you said does make ${em(
						"some"
					)} sense. However, I still have some questions for you,”`
				) +
				" you tell him."
		) +
		p(
			"After taking his seat, he replies, " +
				span(
					{ class: maleSpeech },
					"“I'm glad you understand, feel free to ask anything, and I'll answer it as best as I can.”"
				)
		) +
		/* Just a comment showing the links for ease
    <<link "It's been decades, right. How old are you?">><</link>>
    <<link "About your wife…">><</link>>
    <<link "How did you get <i>this</i> rich?">><</link>>
    <<link "What's Fertilo Inc about?">><</link>>
    <<link "What happened to the receptionist, Katie?">><</link>>
    <<link "So they wiped our memory and scattered us?…">><</link>>
    <<link "Is there any more stuff I should know about S.H.E.M.P?">><</link>>
    <<link "So where am I gonna be staying for now?">><</link>>
    <<link "About my condition, what are you trying to say?">><</link>>
    <<link "There's a tattoo I think you should know about">><</link>>
    <<link "No question">><</link>>
    */

		/*TODO - Make the texts in the link more coherent when put together */
		macroLink(
			"It's been decades, right. How old are you?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					`“You said your search began a decade ago, right? How old ${em(
						"are"
					)} you? You look barely thirty, and even that's an overstatement.”`
				) +
					p(
						"Mr. Fert looks at you and places his hand beneath his chin. " +
							span(
								{ class: femaleSpeech },
								"“Hmm, if I'm remembering correctly, I'm much closer to forty; thirty-eight to be exact.”"
							)
					) +
					p(
						"You gasp in surprise, " +
							span(
								{ class: femaleSpeech },
								"“Huh? You're bluffing, that can't be true, why do you look so young?”"
							)
					) +
					p(
						{ class: maleSpeech },
						"“It's a side effect of our hyper-fertility; younger bodies in their prime are much more suitable for reproduction, and so we'll tend to look young for pretty much our entire lives.”"
					) +
					p(
						{ class: maleSpeech },
						`“Wait, let me get you straight. You're saying I'll look ${em(
							"perpetually"
						)} young? No wrinkles, back pain, arthritis, or droopy boobs?”`
					) +
					p(
						{ class: maleSpeech },
						"“Most likely, in fact, you're probably older than you think.”"
					) +
					p(
						"You sigh in relief, " +
							span(
								{ class: femaleSpeech },
								"“At least that's a really nice positive in all this.”"
							)
					) +
					p(
						{ class: femaleSpeech },
						em(
							`But what did he mean by "older". I'm definitely sure I'm ${stateFulVar(
								"player",
								"body",
								"age",
								"physical"
							)}…`
						)
					),
				true
			)
		) +
		br
);
