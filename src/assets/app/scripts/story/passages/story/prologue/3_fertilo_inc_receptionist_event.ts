import { macroSkipTime } from "../../../../date_and_time/macro_definitions";
import { convertToClass } from "../../../../declarations/general_declarations";
import {
	fertiloIncGroundFloorMeasurementCloset,
	fertiloIncGroundFloorPorch,
	fertiloIncGroundFloorReception,
} from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/ground_floor";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import {
	macroNumberInput,
	macroNumberSlider,
} from "../../../functions/external_libs/number_input";
import { br, em, p, span, strong } from "../../../functions/html_elements";
import {
	macroButton,
	macroIf,
	macroLink,
	macroPrint,
	macroReplace,
	macroSetOrRun,
	macroSilently,
	macroTextBox,
	macroTimed,
} from "../../../functions/macros";
import { PC, stateFulVar } from "../../../functions/others";
import { addPassage, macroEither } from "../../../functions/passage_funcs";
import {
	changeMe,
	changeMe1,
	clearMe,
	clearMe1,
	clearMe2,
	clearMe3,
} from "../../styles/other.module.css";
import {
	defaultText,
	femaleSpeech,
	femaleSpeech1,
	maleSpeech,
	statNeutral,
} from "../../styles/speech.module.css";

addPassage(
	StoryPassageName.PROLOGUE_ARRIVED_AT_FERTILO_INC,
	[fertiloIncGroundFloorPorch.uuid],
	ctpNoId(
		{
			content: p({ class: maleSpeech }, "“Miss?…"),
			progress(progressText) {
				/* Load the next ctp passage after a while */
				return macroTimed([{ delay: "2.5s", content: progressText }]);
			},
		},
		{
			options: { t8n: true },
			content: p({ class: maleSpeech }, "Ma'am"),
			progress(progressText) {
				/* Load the next ctp passage after a while */
				return macroTimed([{ delay: "3s", content: progressText }]);
			},
		},
		{
			options: { t8n: true },
			content:
				p({ class: maleSpeech }, "Madam!”") +
				/* Load the remaining ctp passage after a while */
				macroTimed(
					[
						{
							delay: "2s",
							content:
								p(
									"A light but persistent tapping on the shoulder wakes you up from your slumber. You audibly gasp and break your poise; the event from your dream still vivid. It's only until you notice the bus driver, you calm down and re-compose yourself."
								) +
								p(
									span(
										{ class: maleSpeech },
										"“Is everything alright, miss?” "
									) + "asks the man, with obvious concern in his voice."
								) +
								p(
									span(
										{ class: femaleSpeech },
										"“Aha, sorry about that, sir. I'm fine, I just didn't get enough sleep yesterday,” "
									) +
										"you lie. " +
										em({ class: femaleSpeech }, "God, this is so embarrassing.")
								) +
								p(
									"The driver gives you a funny look; you find it difficult to think he believes you. " +
										span(
											{ class: maleSpeech },
											"“If you say so, lassie. We're at your stop now, Three Burns Street, you're the last one. Make sure to get some sleep today once you get back home.”"
										)
								) +
								p(
									"You thank the man and apologize again before promptly leaving the bus. The moment you step out, the driver calls for your attention again. " +
										span(
											{ class: maleSpeech },
											"“Lassie, be careful of what you do. You never know who's watching.” "
										) +
										"He waves at you with a grin before getting back to his seat and driving off."
								) +
								p(
									"You're left aghast by what the driver said as the bus goes off into the distance. " +
										em(
											{ class: femaleSpeech },
											"What in the living hell was that! Was it a warning? Or a threat? No, no, no, no. I'm probably overthinking this. He's just a sweet old man; senile at times but still sweet. He probably meant no harm."
										)
								) +
								p(
									"As if on cue to make things worse, your mind goes back to the strange dream you had in the vehicle. You subconsciously rest your hand against your lower abdomen, pondering over the experience. You're a hundred percent sure it's what the letter meant when it said your symptoms will advance with time, but you can't help but blush furiously at the thought of ever living out that 'fantasy'."
								) +
								p(
									{ class: femaleSpeech },
									"Sigh… I can't worry about that now. I'm already here, so I need to be alert. C'mon, I can do this."
								) +
								p(
									"You turn to the building behind, it's exactly how the letter described it; a massive hospital painted white and green, its most obvious feature is the large green logo of an expecting mother cradling her belly, underneath which, is the name of the hospital; Fertilo Inc. The odd thing about it though is the neighbourhood it's situated in; poorly lit streets, rundown houses covered in graffiti and an atmosphere that reeks of neglect and disrepair; causing it to stick out like a sore thumb."
								) +
								macroLink(
									"Go in.",
									"",
									StoryPassageName.PROLOGUE_ARRIVED_AT_FERTILO_INC_1
								),
						},
					],
					true
				),
		}
	)
);

addPassage(
	StoryPassageName.PROLOGUE_ARRIVED_AT_FERTILO_INC_1,
	[fertiloIncGroundFloorReception.uuid],
	p(
		"You gulp down hard, clutching your purse closer, and walk to the entrance. The automated door notices your presence and slides open to allow you in. Upon entering the building, you're hit by a cool breeze from its interior. You shiver a bit and look around, " +
			em(
				{ class: femaleSpeech },
				`This place is HUGE! I thought it would be big, but not ${strong(
					"this"
				)} big. `
			) +
			"You're still in awe at the sheer size of the hospital when a young-looking ginger-haired receptionist in calls out to you from her desk, a few feet in front."
	) +
		p(
			span(
				{ class: femaleSpeech1 },
				"“Good morning, miss. Do you have an appointment with one of our doctors?” "
			) +
				`she asks in a calm voice. 
				You notice her and quickly walk towards the front desk. Once you get close enough, you hear her speak again, ${span(
					{ class: femaleSpeech1 },
					"“I almost forgot, please write your name and signature here,” "
				)} she adds, pushing a pen and a thick-covered leather book to you.`
		) +
		ctpNoId(
			{
				content: "",
				progress(progressText) {
					return macroLink("Take the pen.", progressText);
				},
			},
			{
				options: { clear: true },
				content:
					br +
					/* Input the player's name */
					strong("Name:") +
					macroTextBox(
						stateFulVar("player", "name"),
						"Peizhu",
						StoryPassageName.PROLOGUE_CHARACTER_CREATION_TALK_TO_RECEPTIONIST
					),
			}
		)
);

addPassage(
	StoryPassageName.PROLOGUE_CHARACTER_CREATION_TALK_TO_RECEPTIONIST,
	[fertiloIncGroundFloorReception.uuid],
	macroSkipTime(0, 0, 3) +
		p(
			`You return the book after dropping your name and signature. The receptionist takes it while saying, ${span(
				{ class: femaleSpeech1 },
				"“Now what appointment do you ha—”"
			)} She stops before finishing, her eyes widening, as she reads your name. ${span(
				{ class: femaleSpeech1 },
				`“${PC}, right? Well then, the doctor has been expecting you for a while now. I'll take you to his office, but first I need to get your measurements and some other information for him. Just give me a moment to stan—”`
			)}`
		) +
		p(
			span(
				{ class: femaleSpeech },
				`“What do you mean by ${em("more information")}?”`
			) +
				` you retort, interrupting the young woman. 
			There's a hint of anger in your voice. ` +
				span(
					{ class: femaleSpeech },
					`“You've all been spying on me for only God knows how long?”`
				) +
				` you follow up with and continue complaining to the lady for over a minute; who paused what she was doing to listen to you.`
		) +
		p(
			`Once you're satisfied with ranting, the receptionist gives you a knowing smile and says, 
    ${span(
			{ class: femaleSpeech1 },
			`“I'm sorry you had to go through all that, I really am. But if you want answers, I'm afraid the doctor is the only one that can do it. He simply told me that he was expecting someone named '${PC}' and needed me to get their vitals and some other data for their treatment.”`
		)}`
		) +
		/*REVIEW - Change the last 'You' here so it'll flow nicely */
		p(
			"The woman shifts her chair back a bit to stand up properly. It's then you notice that she's pregnant, full term in-fact. Her bump visibly strains the white shirt she's wearing and peeks out a bit underneath, pushing her unbuttoned black jacket to the sides; it looked absolutely huge on her small frame, especially when she looked no older than twenty-five. You kinda feel bad about lashing out at her, especially now that it seems she's innocent, besides stressing out a mother isn't cool."
		) +
		p(
			"You apologize to her repeatedly, but she brushes off the matter." +
				span(
					{ class: femaleSpeech1 },
					"“Everyone makes mistakes, don't worry.”"
				) +
				" She reaches into her skirt pocket, pulls out a measuring tape." +
				span({ class: femaleSpeech1 }, "“Are you ready now?”") +
				" she asks, gesturing towards a scale and stadiometer."
		) +
		p(
			span(
				{ class: femaleSpeech },
				"“Yeah, but could you tell me why you're still working? Shouldn't you be on maternity leave or something? I mean, you're close to term.”"
			) +
				`, you reply, subconsciously moving your hand to your midsection until you notice it. 
    There's been a dull itch around your abdomen, but you're trying your best to ignore it for now.`
		) +
		p(
			"The receptionist laughs lightly at your question as she leads you to the area she pointed out. Other than the more pronounced arc of her back, she looks unbothered by her gravidity, even her gait is mostly unhindered by the large bulge sticking out of her middle. " +
				span(
					{ class: femaleSpeech1 },
					"“Don't worry about it, I've got used to being a surrogate on short notice. Besides, I'm sure you'd find other staff like me here who aren't bothered by their pregnancies.”"
				)
		) +
		p(
			span(
				{ class: femaleSpeech },
				"“Surrogacy? You're a <i>surrogate</i>? You carry <i>another</i> person's baby? How does it feel like? Is that what you guys do here?” "
			) +
				"You've heard of surrogacy before, but never thought you'd see it in real life."
		) +
		p(
			span({ class: femaleSpeech1 }, "“Yes, surrogacy,” ") +
				"she giggles, while rubbing her belly absent-mindedly." +
				span(
					{ class: femaleSpeech1 },
					"“I'm a part-time surrogate. Many of our staff here are, but we also offer multiple services under pre-natal and post-natal care. It's our job to help mothers in need.”"
				) +
				"She says the last bit with noticeably more pride. " +
				span(
					{ class: femaleSpeech1 },
					"“Ah, I almost forgot you asked how it feels. Well, it mostly depends on the baby. I'm just lucky that this little fella isn't a kicker like the last one.”"
				)
		) +
		p(
			{ class: femaleSpeech },
			"“I see… Wait, shouldn't a nurse be the one taking my measurements? Who's going to replace you while we're gone?”"
		) +
		// /*REVIEW - Maybe I should just give all these people colours in their names */
		p(
			"The receptionist pulls out a name tag from her pocket and pins it to her jacket. Her name, Katie Smith, and a designation that says she's a nurse are printed on it. " +
				span(
					{ class: femaleSpeech1 },
					"“Technically, I'm both a nurse and a receptionist, more so the former. I was just helping a friend out since she's on break, besides, the doctor made it clear that he wanted me to help you and do the necessary. I'm not sure why, but he's my boss; he makes the rules here. As for my post, don't worry, I've already called someone else to fill in for me.”"
				)
		) +
		p(
			"You nod at Katie in understanding. " +
				em("That makes more sense.") +
				/*REVIEW - This might need rewriting*/
				" Before you can voice another thought, the both of you reach the room with the measuring equipment."
		) +
		p(
			{ class: femaleSpeech1 },
			`“Okay, we're here. Now, miss ${PC}, would you please ${macroLink(
				"get on the scale?",
				"",
				StoryPassageName.PROLOGUE_CHARACTER_CREATION
			)}”`
		)
);

const playerWeight = stateFulVar("player", "body", "weight");
const playerWeightReactionVar = "_playerWeightDescription";
const playerHeight = stateFulVar("player", "body", "height");
const playerHeightReactionVar = "_playerHeightDescription";

const defaultPlayerWaistSize = "_defaultPlayerWaistSize";
const minPlayerWaistSize = "_minPlayerWaistSize";
const maxPlayerWaistSize = "_maxPlayerWaistSize";
const playerFormerWaistSize = "_playerFormerWaistSize";
const playerWaistSize = stateFulVar("player", "body", "waistSize");

const defaultPlayerHipSize = "_defaultPlayerHipSize";
const minPlayerHipSize = "_minPlayerHipSize";
const maxPlayerHipSize = "_maxPlayerHipSize";
const playerFormerHipSize = "_playerFormerHipSize";
const playerHipSize = stateFulVar("player", "body", "hipSize");
addPassage(
	StoryPassageName.PROLOGUE_CHARACTER_CREATION,
	[fertiloIncGroundFloorMeasurementCloset.uuid],
	/* Handle getting the PC's weight */
	ctpNoId(
		{
			progress(progressText) {
				return (
					p(
						"After you take off your shoes and get on the scale, Katie your readings. " +
							span({ class: femaleSpeech1 }, "“Let's see how much you weigh.”")
					) +
					span(
						{ class: clearMe },
						macroNumberInput(playerWeight, playerWeight, 50, 80)
					) +
					" kg" +
					macroButton(
						"Done",
						progressText +
							/* This will remove the numberinput and button that the player inputted their height in */
							macroReplace(convertToClass(clearMe))
					)
				);
			},
		},
		{
			progress(progressText) {
				return (
					macroSilently(
						macroIf(
							{
								condition: playerWeight + "<= 60",
								content: macroSetOrRun(
									playerWeightReactionVar,
									`You're a bit ${span(
										{ class: statNeutral },
										"leaner"
									)} than I expected. Try to eat more when you can,`
								),
							},
							{
								content: macroSetOrRun(
									playerWeightReactionVar,
									`You're a bit ${span(
										{ class: statNeutral },
										"chubbier"
									)} than I expected. No issues though,`
								),
							}
						)
					) +
					p(
						span(
							{ class: femaleSpeech1 },
							"“Hmm, " +
								span(
									{ class: statNeutral },
									macroPrint(`${playerWeight} + 'kg'`)
								) +
								playerWeightReactionVar
						) +
							" she says while adjusting the stadiometer. " +
							span(
								{ class: femaleSpeech1 },
								"“Could you please come over here?”"
							)
					) +
					p(
						"You nod to her and step onto the stadiometer. Katie moves closer and tries to slide the headpiece to your scalp but it's hard to find a position that doesn't press her bump into your side. She winces for a moment but eventually does it and takes your measurement. " +
							span({ class: changeMe }, "Your height is…")
					) +
					/* Handle getting the PC's height */
					span(
						{ class: clearMe1 },
						macroNumberInput(playerHeight, playerHeight, 150, 186) +
							" cm" +
							macroButton(
								"Done",
								progressText + macroReplace(convertToClass(clearMe1))
							) +
							/* This will remove the numberinput and button that the player inputted their height in */
							/* Replace "Your height is…" in and show the player's actual height */
							macroReplace(
								convertToClass(changeMe),
								"Your height is " +
									span({ class: statNeutral }, playerHeight + "cm"),
								true
							)
					)
				);
				/* Initialize a temporary variable that'll store a string depending on the PC's weight and another that stores the PC's reaction */
			},
		},
		{
			progress(progressText) {
				return (
					macroSilently(
						/* Initialize a temporary variable that'll store a string depending on the PC's height */
						macroIf(
							{
								condition: playerHeight + "<=169",
								content: macroSetOrRun(
									playerHeightReactionVar,
									em("A little bit… shorter… still acceptable…") +
										span(
											{ class: defaultText },
											"You overhear the woman mumbling something to herself but she stops before you can make out what it is."
										) +
										span(
											{ class: femaleSpeech1 },
											"“Aha, pardon me. You're slightly " +
												span({ class: statNeutral }, "shorter") +
												" than average but its okay. Back pain sucks anyway,”"
										)
								),
							},
							{
								condition: `(${playerHeight} > 170) && (${playerHeight} < 185)`,
								content: macroSetOrRun(
									playerHeightReactionVar,
									"“You're in the " +
										span({ class: statNeutral }, "average") +
										" height range. Not much else to say,”"
								),
							},
							{
								content: macroSetOrRun(
									playerHeightReactionVar,
									"“You're quite " +
										span({ class: statNeutral }, "tall") +
										". I even had to go on my toes to set the headpiece properly,”"
								),
							}
						)
					) +
					p(
						span({ class: femaleSpeech1 }, playerHeightReactionVar) +
							" Katie says when you step off the stadiometer. She tosses the measuring tape from before at you. " +
							span(
								{ class: femaleSpeech1 },
								"“For the last few measurements, I need you to get me your waist and hip measurements, and your cup size too. There's a smaller room to the left here with some useful stuff that'll give you more privacy.”"
							)
					) +
					p(
						"You comply with what she says and head into the smaller room she pointed out. Right before entering it, you hear a voice audibly sigh in relief and something slumping down on a chair. " +
							em(
								{ class: femaleSpeech },
								"I'd probably be tired too if I was sporting that belly all day."
							)
					) +
					p(
						`Inside the room, you see a full body mirror, a table with a bunch of unpadded bras of varying sizes, some more measuring tapes atop a small cabinet and a comfortable-looking chair with a small stool to go with it. There's also a bra sizing chart beside the mirror to help, and a clipboard form for body measurements on the stool.` +
							span(
								{ class: femaleSpeech },
								"“The last time I checked this stuff was like 2 weeks ago, right? There shouldn't be too much of a difference, right?.”"
							)
					) +
					/*TODO - Edit the former sentence and make it flow more smoothly */
					p(
						"You face a wall and pull off your shirt, then your trousers, stripping yourself down to only underwear. There's a bit of difficulty since your clothes feel even more snug than in the morning, even your panties are beginning to get uncomfortable. When you look back to the mirror, you notice something very odd; there's a very faint marking of what looks like a rose-coloured uterus on your lower abdomen, just like the one in your dream on the bus."
					) +
					p(
						span(
							{ class: femaleSpeech },
							"“Holy Shit! ow did this happen? When did it happen? Please, please don't let this mean that dream actually meant something.”"
						) +
							"Poking or trying to rub it off doesn't have any effect, you also try other ways like scratching it and even using your saliva, but none are fruitful."
					) +
					p(
						"As you earnestly try to remove the tattoo from your skin, a knock on the door snaps you out of your futile efforts. It's Katie, and she asks whether everything's alright; there's a slight but noticeable strain in her voice. Since you don't want to disturb her, and you're close to your goal anyway, you assure her that everything's fine. " +
							span(
								{ class: femaleSpeech1 },
								"“If you say so Miss, just let me know if you need anything,”"
							) +
							" Katie says and leaves the door, letting out another audible, albeit quieter, grunt a short while later. "
					) +
					p(
						"A sigh escapes your lips, " +
							em(
								{ class: femaleSpeech },
								`C'mon ${PC}, I'm ${strong(
									"this"
								)} close to getting answers for all this. Just suck it up for now.`
							) +
							"You take the tape and wrap it around your waist and hips to get their measurements. " +
							span({ class: changeMe1 }, "Your waist size is…")
					) +
					macroSilently(
						/* Get the hipSize range depending on the default hipSize. Also the PC is supposed to have relatively wide hips by default */
						macroSetOrRun(
							defaultPlayerWaistSize,
							`${playerWaistSize} + ${macroEither(-1, -0.5, 0, 0.5, 1)}`,
							true
						) +
							macroSetOrRun(
								minPlayerWaistSize,
								`${playerWaistSize} - 2`,
								true
							) +
							macroSetOrRun(maxPlayerWaistSize, `${playerWaistSize} + 1`, true)
					) +
					/* Handle getting the PC's waist size */
					/*TODO - Make the default waist size change with the player's weight */
					span(
						{ class: clearMe2 },
						macroNumberSlider(
							playerWaistSize,
							defaultPlayerWaistSize,
							minPlayerWaistSize,
							maxPlayerWaistSize,
							0.1
						) +
							macroButton(
								"Done",
								progressText +
									/* This will remove the numberslider and button that the player inputted their waist size in */
									macroReplace(
										convertToClass(clearMe2) +
											macroReplace(
												convertToClass(clearMe1),
												"Your waist size is " +
													span(
														{ class: statNeutral },
														playerWaistSize + " inches"
													) +
													" while your hips are…",
												true
											)
									)
							)
					)
				);
			},
		},
		{
			progress(progressText) {
				return (
					macroSilently(
						/* Get the hipSize range depending on the default hipSize. Also the PC is supposed to have relatively wide hips by default */
						macroSetOrRun(
							defaultPlayerHipSize,
							`${playerHipSize} + ${macroEither(-1, -0.5, 0, 0.5, 1)}`,
							true
						) +
							macroSetOrRun(minPlayerHipSize, `${playerHipSize} - 2`, true) +
							macroSetOrRun(maxPlayerHipSize, `${playerHipSize} + 1`, true)
					) +
					/* Handle getting the PC's hip size */
					span(
						{ class: clearMe3 },
						macroNumberSlider(
							playerHipSize,
							defaultPlayerHipSize,
							minPlayerHipSize,
							maxPlayerHipSize,
							0.1
						) +
							"in" +
							macroButton(
								"Done",
								progressText +
									/* This will remove the numberslider and button that the player inputted their hip size in */
									macroReplace(convertToClass(clearMe3)) +
									macroReplace(
										convertToClass(changeMe1),
										"Your waist is " +
											span(
												{ class: statNeutral },
												playerWaistSize + " inches"
											) +
											" while your hips measure " +
											span({ class: statNeutral }, playerHipSize + " inches")
									)
							)
					) +
					macroSilently(
						/* This is just for getting a partially random value for the PC to compare too when they noticed they're 'wider' than before */
						/*TODO - Use a function for this either() stuff */
						macroSetOrRun(
							playerFormerWaistSize,
							`${playerWaistSize} - ${macroEither(
								2,
								2.1,
								2.2,
								2.3,
								2.4,
								2.5,
								2.7,
								2.8,
								2.9,
								3
							)}`,
							true
						) +
							macroSetOrRun(
								playerFormerHipSize,
								`${playerHipSize} - ${macroEither(2, 2.3, 2.5, 2.8, 3, 3.5)}`,
								true
							)
					)
				);
			},
		},
		{
			progress(progressText) {
				return (
					p(
						span(
							{ class: femaleSpeech },
							`“Eh? I could've sworn I wasn't this big before. Wasn't my waist around ${playerFormerWaistSize} inches? And I'm sure my hips were closer to ${playerFormerHipSize} inches. Aww man, this is even more confusing, that doctor better know what's wrong with me.”`
						) +
							"You pinch your hips and poke your middle a bit, unsure about how you never noticed these changes over the past days."
						/*TODO - The user's weight affects the starting value for waistSize */
					) +
					p(
						"Another sigh leaves your mouth, then you wrap the measuring tape around your chest, right beneath your bust; there's no use bothering about that for the moment. The same also goes for the largest area of your breasts. It turns out that your bra size is still a " +
							span({ class: statNeutral }, "34DD") +
							". You audibly exhale in relief, " +
							span(
								{ class: femaleSpeech },
								`“${em(
									"Phew."
								)} Thankfully, it seems like nothing's changed there yet.”`
							)
					) +
					macroLink(
						"Put On Your Clothes",
						"",
						StoryPassageName.PROLOGUE_CHARACTER_CREATION_DONE_WITH_MEASUREMENTS
					)
				);
			},
		}
	)
);

addPassage(
	StoryPassageName.PROLOGUE_CHARACTER_CREATION_DONE_WITH_MEASUREMENTS,
	[fertiloIncGroundFloorMeasurementCloset.uuid],
	p(
		"You put your clothes back one carefully; it'll definitely be awful if it rips. Once you're done, you fill the clipboard form, with your measurements, and return to the room with Katie in it. You close the door to the smaller room behind you and turn to her, the scene is truly a sight."
	) +
		p(
			"She's a sweaty mess. Her skirt is pulled down halfway and her legs spread apart, giving quite a show, but the thing that's even more absurd is her belly. It's a much larger dome stretched to capacity—you swear she looks overdue with triplets—and has soundly defeated her clothing, opting to lewdly stick out of it. Her bump is bulging out menacingly, with the area surrounding her popped navel reddening with strain; when you look closer, you notice that it's still growing, albeit slowly. It also seems that Katie hasn't noticed you yet."
		) +
		p(
			`You're completely baffled, but it's been a weird day, so you don't visibly react to it. Instead, you move to her other side to get her attention, but you discover her shirt is soaked around her bust; two visible darker spots right where her nipples are. Looking more closely at her face, you see that she's in ecstasy—well, she ${em(
				"is"
			)} making ${em(
				"that"
			)} face so you think so—and mumbling gibberish to herself. She's still unresponsive to your presence, even when you call out to her.`
		) +
		p(
			"Unsure of what to do now, you decide to leave her and find another staff to help. But just before you exit the room, Katie lets out a loud moan, and the activity in her belly suddenly surges, but otherwise remains oblivious to you. You turn back and see her midsection covered with a flurry of bulges from its occupants; it's almost like the dream you had, but it feels so different seeing it in real life, almost tempting in fact. She groans again and a folded piece of paper falls out of her hand, which you pick up."
		) +
		p(
			`The directions to the doctor's office are scribbled on it, as well as an apology from Katie. It seems that she expected her current predicament but didn't realize it would be this soon, and she doesn't require any assistance; that this is apparently ${em(
				"normal"
			)} for her. ${em(
				{ class: femaleSpeech },
				"Everything here is so weird."
			)}`
		) +
		macroLink(
			"Follow the directions.",
			"",
			StoryPassageName.PROLOGUE_MEET_THE_DOCTOR
		)
);
