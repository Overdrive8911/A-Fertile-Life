import { macroSkipTime } from "../../../../date_and_time/macro_definitions";
import { convertToClass } from "../../../../declarations/general_declarations";
import { fertiloIncTopFloorCeoOffice } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/top_floor";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import {
	br,
	div,
	em,
	list,
	p,
	span,
	strong,
	underline,
} from "../../../functions/html_elements";
import {
	macroIf,
	macroLink,
	macroReplace,
	macroSetOrRun,
} from "../../../functions/macros";
import { PC, stateFulVar } from "../../../functions/others";
import {
	addPassage,
	generateRandomTempVar,
} from "../../../functions/passage_funcs";
import {
	changeMe,
	changeMe1,
	changeMe2,
	clearMe,
} from "../../styles/other.module.css";
import {
	femaleSpeech,
	femaleSpeech2,
	maleSpeech,
	otherSpeech,
} from "../../styles/speech.module.css";

// Define temporary variable names used in the logic
const tempPCenthusiasm = generateRandomTempVar();
const tempPCapathy = generateRandomTempVar();
const tempPCdisapproval = generateRandomTempVar();
const hasPlayerMadeAChoice = generateRandomTempVar();
const playerShowedTattoo = generateRandomTempVar();

// Placeholder for included content generation functions or strings
const enthusiasmPassageContent =
	p(
		"You laugh nervously, clutching and fiddling with your purse. " +
			span(
				{ class: femaleSpeech },
				em("Deep breaths. Take in some deep breaths and calm down.")
			) +
			" In a short while, you manage to calm down a bit and give Mr. Fert your reply. " +
			span(
				{ class: femaleSpeech },
				"“If I'm understanding you properly, I have to be a mother? Or at least work as a surrogate, right?”"
			)
	) +
	div(
		"He lets out a sigh of relief and relaxes his composure. " +
			span(
				{ class: maleSpeech },
				p(
					"“Affirmative, miss. You took the news much better than I expected. Although I'm used to it now, I can't imagine how much of a disruption this must be to your normal life. For that, I commend you for your calmness, and promise to help ease your worries and problems here to the best of my ability."
				) +
					p(
						`I can assure you that being a surrogate won't affect your life as greatly as you think it would, and I'm sure you would find its bonuses favourable. Besides, your "gift" will make pregnancies much more bearable. Miss ${PC}, You do not need to worry.”`
					)
			)
	) +
	p(
		"You nod absent-mindedly, preoccupied with your thoughts. " +
			span(
				{ class: femaleSpeech },
				em("Surrogacy… It can't be that bad, right?")
			)
	);

// --- Apathy Passage Content ---
const apathyPassageContent =
	p(
		/* REVIEW - Rewrite this */
		"You sigh quite audibly, " +
			span(
				{ class: femaleSpeech },
				"“I honestly don't know what else I expected you to say… You probably have a plan for this, so just tell me what I need to do.”"
			) +
			" There's a hint of defeat in your voice, and it seems like Mr. Fert has noticed it."
	) +
	span(
		{ class: maleSpeech },
		p(
			`“Miss ${PC}, do not worry. Your reaction is a bit weaker than I expected but still understandable. I can assure that you wouldn't need to worry, since you can work as a surrogate here. It will take a bit of getting used to, but you'll still be able to live your life and do what you want, besides, with your gift, pregnancies will be far easier and quicker for you. It'll be over before you know it!`
		) +
			p(
				"If you're still unsure, feel free to ask my staff or wife later, they'll definitely be willing to assist you.”"
			)
	) +
	p(
		{ class: femaleSpeech },
		"“When you put it like that, I guess I could give it a try…”"
	);

// --- Disapproval Passage Content ---
const disapprovalPassageContent =
	p(
		"You place your hand on your forehead and let out a sarcastic chuckle, " +
			span(
				{ class: femaleSpeech },
				"“Yeah, I'm not doing that. This is to be a joke, a sick joke… You even tried to flash me, you sicko!”"
			)
	) +
	div(
		"Mr. Fert looks at you blankly for a short while and then sighs, " +
			span(
				{ class: maleSpeech },
				p(
					"“Well, that hurts, although I can't say your reaction was unexpected."
				) +
					p(
						"I guess I'll just have to drill the reality into you another way.”"
					)
			) +
			" He stands up from his seat and moves over towards you."
	) +
	p(
		span(
			{ class: femaleSpeech },
			"“Stay back! What are you trying to do. I'll call the cops, you perv,”"
		) +
			" you reply, shifting your seat backwards until you almost tumble out of it."
	) +
	p(
		"The doctor reaches you and crouches to your level, placing his hands on your shoulder and staring into your eyes with a level of threatening intensity you never thought was possible. His emerald-green stare seems to pierce into your very souls, and it's almost as if he can see your heart's contents."
	) +
	div(
		span({ class: maleSpeech }, `“${PC},”`) +
			" he starts after what feels like an eternity. " +
			span(
				{ class: maleSpeech },
				p(
					"“I know you won't believe me now—you already think of me as a pervert—but I'm trying to do this for your own good. I can't imagine how awful the news must've been for you, but please know that it's the best option you have if you seriously want to keep living… At least until we find another solution."
				) +
					p(
						"You can be a surrogate here and wouldn't have to worry about the repercussions of getting pregnant. Instead, you'd be able to help many distraught parents trying for a child, as well as helping future generations with your body. I can promise you that you would never regret this; none of us here do."
					) +
					p(
						`But if you're still adamant, perhaps your mind will change once the ${strong(
							"hellish"
						)} discharge known as your period comes along in a few weeks, and you end up fainting from anaemia. The choice is yours.”`
					)
			) /*REVIEW - Rewrite this section and the next paragraph */
	) +
	p(
		"You try to snap back at him but find no voice to do so; it's almost like your will has been sapped out from his stern stare. But even if could, you don't have much of an argument to put up, besides the very thought of what could happen if you refuse nauseates you."
	) +
	p(
		"He gently lets go of your shoulders and returns to his seat. " +
			span(
				{ class: maleSpeech },
				"“Don't bother replying now. Even if you disagree, I won't chase you away; you're free to stay here till you can find another place.”"
			)
	);

// --- Showed Tattoo Passage Content ---
const showedTattooPassageContent =
	p(
		"You stand up and breathe in deeply before letting it out, sighing in progress. " +
			span(
				{ class: femaleSpeech },
				"“If you say so, I'll trust you this once,”"
			) +
			/*TODO - Use a different adjective instead of "pudgy" depending on the player\'s BMI (got from their weight and height). Other text in this passage will also be affected. */
			" you say, pulling up your shirt to your bust, leaving your pudgy midsection bare. " +
			span(
				{ class: femaleSpeech },
				/* The PC's personality will affect what is said here */
				"“Let's get this over with.”"
			)
	) +
	p(
		"He nods and leaves his seat to come closer. Crouching in front of you, he pulls out a pair of latex gloves from his coat and wears them. You feel a cold touch as he places his hands against your waist and slides them down, just stopping at your hips. He gently prods different areas on your lower abdomen right around the tattoo. While it doesn't hurt, you feel a welling discomfort that causes you to squirm occasionally in his grasp."
	) +
	p(
		"Mr. Fert eventually stops and looks up at you. " +
			span(
				{ class: maleSpeech },
				"“I'm going to do something now, and I need you to tell me what you feel, okay?”"
			) +
			" he says."
	) +
	p(
		span({ class: femaleSpeech }, "“Okay, but what exactly are you—”") +
			" you attempt to reply before your legs go weak. " +
			"The dull discomfort vanishes near instantaneously, and an immensely pleasurable sensation hits you out of the blue. You attempt to stifle the involuntary moans that try to escape your lips; it's unsuccessful, however, because soon enough, you lose the battle and let out a particularly long, low one. "
	) +
	p(
		"Your cheeks flush red once realization dawns on you; the sensual feeling that prompted it now dying quickly. Your face turns into a tomato when you feel a peculiar dampness around your crotch, and you inadvertently break your poise in an attempt to cover it up. In your confusion and embarrassment, you're unaware of when Mr. Fert lets go of you and returns to his seat."
	) +
	p(
		"You continue fumbling for a short while before you actually consider your surroundings. In a haste to end this embarrassing moment, you hastily pull your shirt down and sit back on your chair, trying to regain your decency. /*Still feeling exposed and vulnerable, */You manage a small, uncomfortable laugh, hoping to defuse some awkward tension in the air. " +
			span(
				{ class: femaleSpeech },
				`“Wow, um… That was unexpected, haha… Please, can we ${em(
					"never"
				)} speak of it, again?”`
			) +
			" /*you ask, voice laced with a mix of amusement and confusion, but mainly just wanting to understand the situation better.*/"
	) +
	p(
		"Mr. Fert chortles audibly—you could almost punch him—but thankfully, he quickly stops it. " +
			span({ class: maleSpeech }, "“Probably not,”") +
			" he begins, kicking back in his recliner. " +
			span(
				{ class: maleSpeech },
				"“You didn't notice it, but your womb tattoo is glowing faintly.”"
			)
	) +
	p(
		{ class: femaleSpeech },
		'“"Womb Tattoo"? Oh, you meant that pink-ish uterus marking on my abdomen, right?”'
	) +
	div(
		span(
			{ class: maleSpeech },
			p(
				"“Yes. It's one of the ways our caretakers from S.H.E.M.P kept an eye on our reproductive health and capabilities. What you need to know now is that:"
			) +
				/* TODO - Make the words below relating to colour show the colour in question and whether it's steady, flashing or flickering*/
				list(
					false,
					"Bright pink mean you're at your peak fertile periods.",
					"A steady, relatively-duller pink colour means you're pregnant. The brighter it is, the more children you're carrying and farther you are along.",
					"Flashing pink means you've just conceived.",
					"Pale pink usually means you're on your period or not in any of the former conditions I listed.",
					`Pale grey is bad; it means you're somehow barren, which would be ${strong(
						"really"
					)} bad for you.`
				) +
				p(
					"But you don't need to worry about the last as long as you stay here.”"
				)
		)
	) +
	p(
		span({ class: femaleSpeech }, "“So, I can't get rid of it?”") +
			" you ask, ignoring most of what he said."
	) +
	p(
		{ class: maleSpeech },
		"“Don't think of it like that… I'll also give you a prescription later to make it a bit less noticeable.”"
	) +
	p(
		"Your face droops in visible disappointment. " +
			span(
				{ class: maleSpeech }, // Note: Original had maleSpeech, but context implies femaleSpeech. Corrected to femaleSpeech.
				'“Well, I guess I shouldn\'t be surprised now… But before we kill this topic, how did you do "that" thing you did to me just now?”'
			)
	) +
	p(
		span(
			{ class: maleSpeech },
			"“Not much really, I was testing how sensitive you were to get a more accurate estimate on your health. It turns out that you're in peak condition,”"
		) + " he replies, with a small smile at the end."
		/* REVIEW - Bro, I need to rewrite this lmao */
	) +
	p({ class: femaleSpeech }, em('How "wonderful".'));

// --- Not Showed Tattoo Passage Content ---
const notShowedTattooPassageContent =
	p(
		"You think to yourself for a moment before nodding sideways. " +
			span(
				{ class: femaleSpeech },
				"“I… can't. Sorry, but I'm not comfortable with that idea.”"
			)
	) +
	div(
		"The doctor looks at you—a hint of disappointment in his eyes—and shrugs. " +
			span(
				{ class: maleSpeech },
				p(
					"“I understand completely. It makes sense if you don't trust me now."
				) +
					p(
						"If my guess is correct, you should have a \"womb tattoo\" or something similar, don't worry much about it though, because it's not harmful in the slightest. Although without seeing it, I don't have much else to say about it"
					) +
					p(
						"Just remember that you can always come back to me if it starts to get worrying. I'll be here to help you.”"
					)
			) +
			" /* TODO - Add repercussions to this later */"
	);

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
		br +
		macroLink(
			"About your wife…",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					"“You mentioned your wife a couple of times. If it's okay, can I ask for her name and if she also works here?”"
				) +
					div(
						{ class: maleSpeech },
						p(
							"“I understand, you'd prefer a fellow woman who's also experiencing something similar. My wife's name is " +
								span({ class: otherSpeech }, "Cira") +
								", Cira Guvala, and she's in charge of the nursery division. As you know by now, she also has hyper-fertility but unlike me, she " +
								em("indulges") +
								" in it. I can't disclose more of her details unless she's okay with it, but you could look for her later; I'm sure she'd be glad to meet you."
						) +
							p(
								"And lest I forget, she's much fairer-skinned than I am, wears glasses and tied her brown hair into a ponytail. That should help you recognize her."
							)
					) +
					p({ class: femaleSpeech }, "“Okay, I'll keep an eye out for her.”"),
				true // t8n transition
			)
		) +
		br +
		// Link: "You bugged my house?" (Assuming this was meant to be included)
		macroLink(
			"You bugged my house?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					"“How did you bug my house? I always lock my doors, and I'm certain nothing was altered anytime I got home.”"
				) +
					p(
						"With a shrug, Mr. Fertilo replies, " +
							span(
								{ class: maleSpeech },
								"“Well, there wouldn't be much use if you found us out, would there? Besides, the lady I sent to do it is one of my " +
									em("experts") +
									"; there'd been no way for you to notice it. And she is someone you'd probably doubt could do it. I'll let her explain better once she gets here.”"
							)
					),
				true // t8n transition
			)
		) +
		br +
		// Link: "How did you get <i>this</i> rich?"
		macroLink(
			`How did you get ${em("this")} rich?`,
			macroReplace(
				convertToClass(changeMe),
				p(
					span(
						{ class: femaleSpeech },
						`“How could you have got ${em("this")} rich?”`
					) +
						" you exclaim. " +
						span(
							{ class: femaleSpeech },
							"“You own a multi-million dollar hospital while I was doing retail, for god's sake.”"
						)
				) +
					p(
						"Mr. Fert strokes his chin and smiles. " +
							span(
								{ class: maleSpeech },
								"“Oh ho, no need to worry about that. Honestly, it's luck that got me here; I was just lucky enough to help the right person at the right time, that's all.”"
							)
					) +
					p(
						"You give him the side-eye. " +
							span(
								{ class: femaleSpeech },
								"“So you won't spill it, fine then.”"
							)
					),
				true // t8n transition
			)
		) +
		br +
		// Link: "What's Fertilo Inc about?"
		macroLink(
			"What's Fertilo Inc about?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					`“What's up with this place? I mean, the surrounding area isn't exactly ${em(
						"pretty"
					)} and a bunch of your staff are supposed to be on maternity leave.`
				) +
					p(
						{ class: maleSpeech },
						"“…I figured that you'd ask that. It's more of a personal reason from my early years; watching multitudes of your siblings die during birth complications or from reproductive deformations takes a toll on you…"
					) +
					p(
						{ class: femaleSpeech },
						"“Oh, I'm sorry to bring up those memories.”"
					) +
					div(
						span(
							{ class: maleSpeech },
							p(
								"“No harm done, you deserve to know anyway. Now, where was I?"
							) +
								p(
									"Ah yes, so once I could, I created Fertilo Inc, which specializes in delivering affordable sexual reproductive health care to people; although there's more focus on women since they're at a greater risk."
								) +
								p(
									`As for the location, this is just one of many branches I have, I simply chose this place because our target demographic resides here. Look at all the estranged people on the streets catching all sorts of diseases, they're prime candidates for our services, and no, we aren't trying to exploit them. In fact, we offer free check-ups and advice, as well as monthly recruitment programs for those interested in working here. It's a win-win situation for everyone, besides any gang around here knows ${em(
										"better"
									)} than to disturb us,”`
								)
						) +
							" Mr. Fert says with a chuckle at the end that gives off a slightly threatening aura."
					) +
					div(
						{ class: maleSpeech },
						p(
							"“As for my staff being pregnant, it's because most of them applied to be surrogates; the benefits that come with the job are quite appealing, if I do say so myself. Besides, they have reduced responsibilities when close to term, but frankly, here's the best place they could give birth and get the proper care required. A majority don't go to term anyway, since they'll transfer the babies back when needed."
						) +
							p(
								`And before you start asking how we do that, it's ${em(
									"complicated"
								)} but you'll find out eventually.”`
							)
					) +
					p(
						{ class: femaleSpeech },
						"“I see… What doesn't make sense though is how you're not making losses with all these business decisions.”"
					) +
					p(
						{ class: maleSpeech },
						"“Oh, I do make losses here occasionally, but I get a bunch of contracts from the government and other private organizations that more than make up for it. This is something I specifically want to do, so no need to fear anything.”"
					) +
					p({ class: femaleSpeech }, "“Ah…”"),
				true // t8n transition
			)
		) +
		br +
		// Link: "What happened to the receptionist, Katie?"
		macroLink(
			"What happened to the receptionist, Katie?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					`“Your receptionist, Katie, what exactly happened to her? It's almost as if she got, ${em(
						"more"
					)} pregnant.”`
				) +
					div(
						"Mr. Fert strokes his chin for a moment then replies, " +
							span(
								{ class: maleSpeech },
								p(
									"“It must've been a dare from my other staff. As silly as it may be, it's something that happens occasionally, especially when we have new recruits that are a tad too bold."
								) +
									p(
										"You don't have to worry, though, she'll be back to normal soon. It's mostly harmless as long as they don't go past their limit. If they do, nothing wrong would really happen; this hospital isn't for show, after all.”"
									)
							)
					) +
					p({ class: femaleSpeech }, "“I see…”"),
				true // t8n transition
			)
		) +
		br +
		// Link: "So they wiped our memory and scattered us?…"
		macroLink(
			"So they wiped our memory and scattered us?…",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					'“You said that instead of being killed off, all of "us" were scattered? What exactly do you mean by that? I can vividly recall having parents, and there was no doubt that I was biologically theirs; even our DNA tests came out matching.'
				) +
					p(
						span({ class: maleSpeech }, "“Hmm…”") +
							" Mr. Fert unintentionally vocalises. " +
							span(
								{ class: maleSpeech },
								"“You had two sets of parents, right?”"
							)
					) +
					p(
						"You nod. Some unsettling memories resurface, but you manage to suppress them."
					) +
					p(
						span(
							{ class: maleSpeech },
							"“I thought so… Unfortunately, I doubt the first set fathered you. As far as my knowledge goes, most of us were relocated to a family matching our heritages,”"
						) +
							" he tells you, moving back to his desk. " +
							"He opens a drawer and carefully pulls a file out. " +
							span(
								{ class: maleSpeech },
								"“Here, I believe you need to see this.”"
							) +
							" He brings out a single paper and gives it to you. " +
							span(
								{ class: maleSpeech },
								'“It\'s from the hospital logs from the day you were "born".”'
							)
					) +
					p(
						"Your eyes widen when you read the names; it's your birth parents—at least, you thought so. The logs state that Mr. and Mrs Noshihamite had a still born that day, which was disposed off before the parents could find out. However, another child, newly-born, was used to replace the dead baby since they had a striking resemblance to the parents. How this baby was obtained isn't mentioned, but it doesn't take long for you to put the pieces together."
					) +
					div(
						{ class: maleSpeech },
						p(
							"“What do you think? I managed to recover it when the hospital went under. Other than breaking a bunch of ethics, you can tell why I have my doubts. After all, your set was one of the youngest; you all were still newborns at the time."
						) +
							p(
								"As for your DNA matching, it's expected. We're all based off the congregates of specific races, and as such we'd match—not quite perfectly but high enough—with most people under that race. /*REVIEW - Read DNA matching so that this makes sense */"
							) +
							p(
								"I understand that this might be a lot to take in, so you don't need to say anything now. Just keep the document.”"
							)
					) +
					p({ class: femaleSpeech }, "…"),
				true // t8n transition
			)
		) +
		br +
		// Link: "Is there any more stuff I should know about S.H.E.M.P?"
		macroLink(
			"Is there any more stuff I should know about S.H.E.M.P?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					"“Is there any more stuff I should know about SHEMP?"
				) +
					p(
						{ class: maleSpeech },
						`“Quite a lot, but I'd end up rambling if I continue. What I can tell you is that there ${em(
							"might"
						)} be a rogue unit or something similar trying to benefit the work of the fallen project. I'm not sure about it, but the unexplained circumstances behind your accident are more of a reason for me to believe it.”`
					) +
					p(
						{ class: femaleSpeech },
						"“Wait, so you mean it wasn't just an unlucky accident? That someone may have sabotaged me?”"
					) +
					p(
						{ class: maleSpeech },
						"“While I prefer not to jump to conclusions, there's a reasonable possibility that may be the case. Someone or some group may have had a reason to suspect that you're an experiment-”"
					) +
					p(
						span(
							{ class: femaleSpeech },
							"“Could you please stop calling me that,”"
						) + " you interrupt with obvious annoyance on your face."
					) +
					p(
						{ class: maleSpeech },
						'“My apologies, miss. It seems that they may have expected you to be a "product" of the project and so tried to activate your gene via the incident.”'
					) +
					p(
						{ class: femaleSpeech },
						em("Calling me a product isn't much better.")
					) +
					p(
						{ class: femaleSpeech },
						"“So I'm being followed by someone else now?”"
					) +
					p(
						{ class: maleSpeech },
						"“Most likely, but they cannot do much while you're here.”"
					) +
					p(
						"You sigh, " +
							span(
								{ class: femaleSpeech },
								"“I don't know if I'm meant to be relieved or worried by that.”"
							)
					),
				true // t8n transition
			)
		) +
		br +
		// Link: "So where am I gonna be staying for now?"
		macroLink(
			"So where am I gonna be staying for now?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					"“Now that my house isn't safe any more, where am I going to live now?"
				) +
					p(
						{ class: maleSpeech },
						"“Here, of course. In fact, there's already a room I've personally prepared for you in-case you'd agree to stay. And you do agree, don't you?”"
					) +
					p(
						{ class: femaleSpeech },
						"“Normally, this would be creepy, but I don't have a choice, do I?”"
					) +
					p(
						"Mr. Fert chuckles at your answer. " +
							span(
								{ class: maleSpeech },
								"“Don't worry, it's very spacious, and you're free to customize it to your liking. I'm sure you would find it palatable.”"
							)
					) +
					p({ class: femaleSpeech }, "“Hmm…”"),
				true // t8n transition
			)
		) +
		br +
		// Link: "About my condition, what are you trying to say?"
		macroLink(
			"About my condition, what are you trying to say?",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					`/* Talk about her fertility and what she needs to do to avoid side effects,
            Gesture to his prominent bulge,
            The PC can choose whether to enthusiastically accept, apathetically accept or grudgingly accept */
            “So, about my medical condition—as you called it—I've been experiencing a bunch of really ${em(
							"weird"
						)} things lately.”`
				) +
					p(
						"Mr. Fert slowly nods to himself, " +
							span(
								{ class: maleSpeech },
								"“Expected. Headaches? Unusual lethargy? Strange skin markings? Pelvic Pain? Strange Cravings? Pseudo-morning sickness? Random bursts of uncontrollable arousal?”"
							) +
							" /* He's unaware of the dream */"
					) +
					p(
						{ class: femaleSpeech },
						"“Well yeah, most of that, actually. Since you know that much, can you get rid of it? It's been awful to deal with.”"
					) +
					p(
						{ class: maleSpeech },
						"“You remember what I said about our hyper-fertility? That's the cause of your issues… And I can't make them go away…/*; that is, without restructuring your DNA, but that's already out of the question.*/ Although, there is a way to greatly minimize the symptoms and stop them from worsening…”"
					) +
					p(
						{ class: femaleSpeech },
						"“That's a bummer, but it's better than nothing. What is it? I'll do anything to improve my situation.” /*REVIEW - Rewrite this */"
					) +
					p(
						"Mr. Fert contemplates briefly, while avoiding eye contact with you, and then responds, " +
							span(
								{ class: maleSpeech },
								"“You may not like my approach, but please bear with me.”"
							) +
							" He stands up from his desk and slowly gestures to his masculinity."
					) +
					p(
						span(
							{ class: femaleSpeech },
							`“Wait. What does ${em("that")} have to do with anything-”`
						) +
							" you hurriedly reply before you notice something odd. " +
							"You see a grapefruit-sized bulge, at his crotch, visibly straining his trousers. " +
							span({ class: femaleSpeech }, "“Eh?!”")
					) +
					p(
						{ class: maleSpeech },
						"It may be inappropriate to show you this, but that's an effect of hyper-fertility. For men like me, it drastically increases the rate of sperm and seminal fluid production. So much so that our testicles can and will visibly expand when not drained for a while. It gets uncomfortable eventually, but I've been able to find workarounds.”"
					) +
					p(
						"He returns to his seat and continues, " +
							span(
								{ class: maleSpeech },
								"“There are a bunch of other effects it has on me, but they're less significant and unimportant now. How this relates to you is that you need to \"give\" your reproductive system what it wants, else it'll only get worse.”"
							) +
							" His composure tightens up considerably, and he clenches his palms. " +
							span(
								{ class: maleSpeech },
								`“In order words… You need to get ${strong(
									underline("pregnant")
								)}.”` // Assuming 'u' function for underline
							)
					) +
					// Conditional logic for enthusiasm/apathy/disapproval
					macroIf(
						{
							condition: `${tempPCenthusiasm} == 1`,
							content: enthusiasmPassageContent,
						},
						{
							condition: `${tempPCapathy} == 1`,
							content: apathyPassageContent,
						},
						{
							condition: `${tempPCdisapproval} == 1`,
							content: disapprovalPassageContent,
						},
						{
							// Else block
							content: span(
								{ class: changeMe1 }, // Target for replacement
								/* What I'm going to do is to set some temporary variables and at the end of the passage (in the "No question" link), add it to the actual player personality values */
								macroLink(
									"So I have to be a surrogate?…", // enthusiastic
									macroSetOrRun(tempPCenthusiasm, 1, true) + // If the PC chooses the "enthusiastic" option, Mr. Fert promises to help them and make them more comfortable
										macroReplace(
											convertToClass(changeMe1),
											enthusiasmPassageContent,
											true
										)
								) +
									br +
									macroLink(
										"I should've expected that…", // apathy
										macroSetOrRun(tempPCapathy, 1, true) + // if the PC chooses the neutral option, Mr. Fert will explain to them that they only need to be a surrogate and their pregnancies would be a breeze
											macroReplace(
												convertToClass(changeMe1),
												apathyPassageContent,
												true
											)
									) +
									br +
									macroLink(
										"I'm not doing that, thank you", // disapproval
										macroSetOrRun(tempPCdisapproval, 1, true) + // If the PC chooses the disapproval option, Mr. Fert will try to reason with them and convince them that they'd only need to be a surrogate once in a while to stave off the symptoms, else they'd get much worse
											macroReplace(
												convertToClass(changeMe1),
												disapprovalPassageContent,
												true
											)
									)
							),
						}
					) +
					"/*I doubt you'd want to experience the types of periods it can create; my wife says they're horrible!</span>*/", // Comment from original
				true // t8n transition
			)
		) +
		br +
		// Link: "There's something I think you should know about…"
		macroLink(
			"There's something I think you should know about…",
			macroReplace(
				convertToClass(changeMe),
				p(
					{ class: femaleSpeech },
					`/* TODO - Add 2 options that say "Tell him about the dream" and "Tell him about the tattoo". The former however will do nothing other than show a rebuttal from the PC'mind when hovered */
            “Uh, Mr. Fert, you mentioned that some markings on my body are part of the "symptoms", right? Is it normal for that to pop up out of the blue, without any warning?”`
				) +
					p(
						span(
							{ class: maleSpeech },
							`“Not really, you would feel an odd sensation there; mine was a dull and uncomfortable one while my wife's was much more ${em(
								"intense"
							)} to put it lightly…”`
						) +
							" he replies, smiling a bit towards the end. " +
							"Perhaps because of a fond memory he just recalled. " +
							span(
								{ class: maleSpeech },
								"“But if you're asking this, I take it that you have one?”"
							)
					) +
					p(
						{ class: femaleSpeech },
						"“Yeah, you're right. How do I get rid of it?”"
					) +
					p({ class: maleSpeech }, "“You don't.”") +
					p(
						{ class: femaleSpeech },
						"“Aw, come on! Literally nothing is going right today."
					) +
					p(
						{ class: maleSpeech },
						"“Don't give up yet, miss. Perhaps if I can see what stage it's in, I can give a prescription to make it less obvious.”"
					) +
					/* TODO - Bro rewrite this cringe shit 😭 */
					p(
						"Your face flushes a bit when you remember the location of the tattoo. " +
							span(
								{ class: femaleSpeech },
								"“S-show you? I don't think I can…”"
							)
					) +
					p(
						"Mr. Fert chuckles and nods his head. " +
							span(
								{ class: maleSpeech },
								`“I'm an ethical—${em(
									"mostly"
								)}—licensed doctor so don't fear anything, besides, I've also experienced it so I can tell it's close to your privates; right on your lower abdomen if I'm correct. It's understandable if you still won't show me but I can only help further if you allow me to see it.”`
							)
					) +
					// Conditional logic for showing tattoo
					span(
						{ class: changeMe2 }, // Target for replacement
						macroIf(
							{
								condition: `${hasPlayerMadeAChoice} != true`,
								content:
									macroLink(
										"Show him",
										macroSetOrRun(hasPlayerMadeAChoice, "true", true) +
											macroSetOrRun(playerShowedTattoo, "true", true) +
											macroReplace(
												convertToClass(changeMe2),
												showedTattooPassageContent,
												true
											)
									) +
									br +
									macroLink(
										"Don't show him",
										macroSetOrRun(hasPlayerMadeAChoice, "true", true) +
											macroSetOrRun(playerShowedTattoo, "false", true) +
											macroReplace(
												convertToClass(changeMe2),
												notShowedTattooPassageContent,
												true
											)
									),
							},
							{
								condition: `${playerShowedTattoo}`,
								content: showedTattooPassageContent,
							},
							{
								// Else (player didn't show tattoo)
								content: notShowedTattooPassageContent,
							}
						)
					),
				true // t8n transition
			)
		) +
		br +
		// Link: "No question" -> FertiloInc_Prologue_MeetMaria
		macroLink(
			"No question",
			// Actions to perform before going to the next passage
			macroIf(
				{
					condition: `${tempPCenthusiasm} == 1`,
					content: `<<changePCPersonality "enthusiasm" 5>>`, // Assuming changePCPersonality is a custom macro string
				},
				{
					condition: `${tempPCapathy} == 1`,
					content: `<<changePCPersonality "apathy" 3>>`,
				},
				{
					condition: `${tempPCdisapproval} == 1`,
					content: `<<changePCPersonality "disapproval" 5>>`,
				}
			) + "/* TODO - Fix changePCPersonality macro */",
			StoryPassageName.PROLOGUE_MEET_MARIA // Target passage
		) +
		/* An empty div to add words from the links above */
		div({ class: changeMe }, "")
	/* After this, in the next passage, Mr. Fert gives the PC living accommodations after explaining their new job and they meet Maria */
);
