import { Directory } from "../../../../../../.build/enums";
import { div, img } from "../../story/functions/html_elements";
import "./dialog.module.css";
import {
	body as dialogBodyClass,
	name as dialogNameClass,
	img as dialogImgClass,
} from "./dialog.module.css";

const defaultEmotion = "default";
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
 * These determine the colors and general style of the dialog
 */
export const enum DialogType {
	GENERIC,
	PLAYER,
	AI,
	MALE,
	FEMALE,
	IMPORTANT,
}

function createDialog(
	name = "Dummy",
	content = "",
	dialogType = DialogType.GENERIC,
	emotion = "default"
): JQuery<HTMLElement> {
	const dialogBody = $(div({ class: dialogBodyClass }, ""));
	const dialogName = $(div({ class: dialogNameClass }, name));
	const dialogImg = $(img({ class: dialogImgClass, src: "" }));
	const dialogContent = $(div(content));

	dialogBody.append(dialogName, dialogImg, dialogContent);

	return dialogBody;
}
