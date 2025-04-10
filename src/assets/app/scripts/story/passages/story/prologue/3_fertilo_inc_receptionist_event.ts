import { fertiloIncGroundFloorPorch } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/ground_floor";
import { StoryPassageName } from "../../../enums";
import { ctpNoId } from "../../../functions/external_libs/ctp";
import { em, p, span } from "../../../functions/html_elements";
import { macroLink, macroTimed } from "../../../functions/macros";
import { addPassage } from "../../../functions/passage_funcs";
import { femaleSpeech, maleSpeech } from "../../styles/speech.module.css";

addPassage({
	name: StoryPassageName.PROLOGUE_ARRIVED_AT_FERTILO_INC,
	tags: [fertiloIncGroundFloorPorch.uuid],
	text: ctpNoId(
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
			// progress(progressText) {
			// 	/* Load the remaining ctp passage after a while */
			// 	return macroTimed([{ delay: "3s", content: progressText }]);
			// },
		}
	),
});
