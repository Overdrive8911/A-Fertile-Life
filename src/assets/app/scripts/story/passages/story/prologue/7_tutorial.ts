import { fertiloIncPlayerRoom } from "../../../../location/game_locations/north_hirtheford/fertilo_inc/locations/underground";
import { StoryPassageName } from "../../../enums";
import { br, hr, p, span } from "../../../functions/html_elements";
import { macroLink, macroLinkReplace } from "../../../functions/macros";
import { PC } from "../../../functions/others";
import { addPassage } from "../../../functions/passage_funcs";
import { femaleSpeech, roboSpeech } from "../../styles/speech.module.css";

addPassage(
	StoryPassageName.PROLOGUE_TUTORIAL_FOR_YOUR_ROOM,
	[fertiloIncPlayerRoom.uuid],
	p(
		"You feel a warmth gradually gather on your face and pull you out of your dreams. Slowly opening your eyes, you see that blinds have been opened."
	) +
		p(
			{ class: femaleSpeech },
			"“Wasn't it closed yesterday? It's probably automated.”"
		) +
		p(
			span({ class: roboSpeech }, "“To an extent, yes,” ") +
				"an unfamiliar voice answers."
		) +
		p({ class: femaleSpeech }, "“Huh?”") +
		p({ class: roboSpeech }, "“Look at the table.” ") +
		p(
			"You slowly raise your head towards the large white table in the center of your room. There, your eyes widen as you see a small floating thing with a holographic screen; most likely what issued the command."
		) +
		/* TODO - Insert a picture of the player looking at G.I.G.I */
		p(
			// `<<character "G.I.G.I" "roboSpeech" "default">>“Morning sleepy head. It's almost time for work!”<</character>>`
			`<<dialog "G.I.G.I" "“Morning sleepy head. It's almost time for work!”">>`
		) +
		p(
			`<<character "G.I.G.I" "roboSpeech" "happy_2">>“I am your General Artificial Intelligence for Gynaecological Insights; G.A.I.G.I, but I'd prefer you exclude the "A". You're looking at the prototype of one of the greatest achievements in all of medical history! I'll be tracking your vitals and be monitoring your condition for the duration of your stay here. And before you ask about my origins, they're confidential. All that's important for you to know is that the doctor assigned me to you…”<</character>>`
		) +
		p(
			"The introduction, of what you now believe to be a robot, ends with it looking around your room with curiosity. It levitates towards different corners, shelves and wardrobes, opening a few to inspect the contents, before descending to simply floating above the table."
		) +
		p(
			`<<character "G.I.G.I" "roboSpeech" "happy">>“Nice room you got here. Much nicer than the bleak white ones I'm used to.”<</character>>`
		) +
		p(
			"After the robot stops talking, it stares silently at you for almost a minute, seemingly waiting for something."
		) +
		p(
			`<<character "G.I.G.I" "roboSpeech" "hmm">>“…Uh, this is the part where you ask some questions. We're kinda pressed for time.”<</character>>`
		) +
		p({ class: femaleSpeech }, `“Oh! I'm ${PC}. So, G.I.G.I, um…”`) +
		/* This is where the info links start */
		/*
    How did you get here?
    Your voice is a bit odd.
    What job am I meant to do?
    Can I touch you?
    Let's go.
*/
		macroLinkReplace(
			"How did you get in here?" + br,
			hr +
				p({ class: femaleSpeech }, "“How did you even get in my room?”") +
				p(
					`<<character "G.I.G.I" "roboSpeech" "default">>“I have authorized access to a <i>lot</i> of locations in this hospital.”<</character>>`
				)
		) +
		macroLinkReplace(
			"Your voice is a bit odd." + br,
			hr +
				p({ class: femaleSpeech }, "“Your voice sounds… strange.”") +
				p({ class: roboSpeech }, "“…”") +
				p(
					{ class: roboSpeech },
					'“I greatly dislike its filter effect but my creators prefer that I\'m not too "human-like".”'
				)
		) +
		macroLinkReplace(
			"What job am I meant to do?" + br,
			hr +
				p({ class: femaleSpeech }, "“What job did you guys want me to do?”") +
				p(
					{ class: roboSpeech },
					"“Nothing much really, I'll say more when we're on our way.”"
				)
		) +
		macroLinkReplace(
			"Can I feel you?" + br,
			hr +
				p({ class: femaleSpeech }, "“Is it okay if I feel you?”") +
				p(
					{ class: roboSpeech },
					"“As long as you're very gentle, however that can wait till later.”"
				)
		) +
		p(macroLink("Lets Go.", "", StoryPassageName.PROLOGUE_TUTORIAL_TO_WORK))
);
