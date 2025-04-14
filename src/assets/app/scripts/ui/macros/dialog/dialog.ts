import { Directory } from "../../../../../../../.build/enums";
import { div, img } from "../../../story/functions/html_elements";
import "./dialog.module.css";
import {
	body as dialogBodyClass,
	name as dialogNameClass,
	img as dialogImgClass,
	content as dialogImgContent,
	imgAndContent,
} from "./dialog.module.css";
import defaultImg from "./../../../../../media/img/characters/icons/default.webp";
/** Puts the text in a stylised speech box with the character's icon and text / container color (if any)
 * It's inputs include the name of the character and an optional color and / or emotion. Content passed into this container macro is rendered as text in the created speech box.
 * 
    It can have 3 values; a mandatory character name, a mandatory gender (Male/Female/Other) and an optional emotion. Note that the name must be a valid folder in media/img/characters/icons/ while the emotion is a valid image file in the folder. 
    i.e <<character <NAME> <GENDER COLOR CLASS> <EMOTION=optional> >> Content <<character>>
    e.g <<character "Dummy" "maleSpeech1" "Happy">> "I'm a happy, male dummy ;p." <</character>> 
        <<character "Dummy" "otherSpeech">> "I'm a default dummy. My gender falls beyond a binary classifications ;p." <</character>>
        <<character "Dummy" "femaleSpeech" "Sad" >> "I'm a sad, female gender dummy ;p." <</character>> */
Macro.add("dialog", {
	// async handler() {
	// 	const self = this;
	// 	const name = self.args[0] as string;
	// 	let emotion = (self.args[1] as string) ?? defaultEmotion;
	// 	console.log(self.payload);
	// 	const content = self.payload[0].contents;

	// 	const baseUrl = `${Directory.STORY_MEDIA}/img/characters/icons`;
	// 	const defaultImgUrl = `${baseUrl}/default.webp`;
	// 	const imgUrl = () => `${baseUrl}/${name}/${emotion}.webp`;

	// 	// Helper function to check if an image exists.
	// 	async function checkImage(url: string) {
	// 		try {
	// 			const res = await fetch(url);
	// 			return res.ok ? url : null;
	// 		} catch (error) {
	// 			// console.error("Error fetching image:", error);
	// 			return null;
	// 		}
	// 	}

	// 	// Try the primary image URL.
	// 	let sanitizedImgUrl = await checkImage(imgUrl());

	// 	// If the primary URL is invalid, try with defaultEmotion.
	// 	if (!sanitizedImgUrl) {
	// 		emotion = defaultEmotion;
	// 		sanitizedImgUrl = await checkImage(imgUrl());
	// 	}

	// 	// If still not valid, fall back to the default image.
	// 	if (!sanitizedImgUrl) {
	// 		sanitizedImgUrl = defaultImgUrl;
	// 	}

	// 	const speechBox = $("<div/>");
	// },
	handler() {
		$(this.output).append(createDialog(...this.args));
	},
});

/**
 * These determine the colors and general style of the dialog.
 */
export const enum DialogType {
	/**
	 * Default, no specific styling.
	 */
	GENERIC,
	/**
	 * Name defaults to "You". Colors are a bit muted.
	 */
	PLAYER,
	/**
	 * For G.I.G.I, your AI assistant. Holographic colors and a special holographic-like font.
	 */
	AI,
	/**
	 * For generic males. Blue / Cyan.
	 */
	MALE,
	/**
	 * For generic females. Pink / Pink-purple.
	 */
	FEMALE,
	/**
	 * For generic others. Grey / Greyish-blue.
	 */
	OTHER,
	/**
	 * For descriptive text and game / ui messages. Green / Greyish-green.
	 */
	NARRATOR,
	/**
	 * For the extra-terrestrial.
	 */
	ETHEREAL,
}

// TODO: Hovering / clicking the name shows a bit of extra info about the afore mentioned character (if any)

/**
 *
 * @param name The name to be displayed over the dialog box
 * @param content The text of the dialog
 * @param dialogType Determines the style of the dialog.
 * @param image Must be a an imported url to a valid image file
 * @returns A Jquery wrapped HTMLElement for the created dialog.
 */
function createDialog(
	name = "Dummy",
	content = "",
	dialogType = DialogType.GENERIC,
	image = defaultImg
): JQuery<HTMLElement> {
	const dialogBody = $(div({ class: dialogBodyClass }, ""));
	const dialogImgAndContentContainer = $(div({ class: imgAndContent }, ""));
	const dialogName = $(
		div(
			{ class: dialogNameClass },
			dialogType == DialogType.PLAYER ? "You" : name
		)
	);
	const dialogImg = $(img({ class: dialogImgClass, src: image }));
	const dialogContent = $(div({ class: dialogImgContent }, content));

	dialogBody.append(
		dialogName,
		dialogImgAndContentContainer.append(dialogImg, dialogContent)
	);

	return dialogBody;
}
