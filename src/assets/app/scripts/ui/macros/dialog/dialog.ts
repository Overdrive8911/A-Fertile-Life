import { Directory } from "../../../../../../../.build/enums";
import { div, img, span } from "../../../story/functions/html_elements";
import "./dialog.module.css";
import {
	body as dialogBodyClass,
	name as dialogNameClass,
	img as dialogImgClass,
	content as dialogImgContent,
	imgAndContent,
	maleDialog,
	femaleDialog,
	otherDialog,
	narratorDialog,
	neutral,
	happy,
	angry,
	bored,
	embarrassed,
	sad,
	shock,
	sus,
	surprise,
	aiDialog,
} from "./dialog.module.css";
import monoColorIcons from "./../../../../styles/spritesheet/mono_color_icons.module.css";
import gigiImg from "./../../../../../media/img/characters/icons/gigi.webp";
import { createMacro } from "../../../story/functions/macros";
import { pixelArt } from "../../../story/passages/styles/img.module.css";
import { CharacterEmotion, CharacterName } from "../../../declarations/enums";
import { icon64X64 } from "../../../story/passages/styles/ui/shared.module.css";
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

export function macroDialog(...args: DialogArgs) {
	return createMacro("dialog", args);
}

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

type DialogArgs = Parameters<typeof createDialog>;

/**
 *
 * @param name The name to be displayed over the dialog box
 * @param content The text of the dialog
 * @param dialogType Determines the style of the dialog.
 * @param emotion Must be a an imported url to a valid image file
 * @returns A Jquery wrapped HTMLElement for the created dialog.
 */
function createDialog(
	name = CharacterName.DUMMY,
	content = "",
	dialogType = DialogType.GENERIC,
	emotion = CharacterEmotion.NEUTRAL
): JQuery<HTMLElement> {
	let displayName: string = name;
	const dialogClasses = [dialogBodyClass];

	// Set some defaults with the character name
	switch (name) {
		case CharacterName.DUMMY:
			break;
		case CharacterName.PLAYER:
			break;
		case CharacterName.GIGI:
			dialogType = DialogType.AI;
			break;
	}

	switch (dialogType) {
		case DialogType.GENERIC:
			break;
		case DialogType.PLAYER:
			displayName = CharacterName.PLAYER;
			break;
		case DialogType.AI:
			dialogClasses.push(aiDialog);
			break;
		case DialogType.MALE:
			displayName += span("· he/him");
			dialogClasses.push(maleDialog);
			break;
		case DialogType.FEMALE:
			displayName += span("· she/her");
			dialogClasses.push(femaleDialog);
			break;
		case DialogType.OTHER:
			displayName += span("· they/them");
			dialogClasses.push(otherDialog);
			break;
		case DialogType.NARRATOR:
			dialogClasses.push(narratorDialog);
			break;
		case DialogType.ETHEREAL:
			break;
	}

	let spriteSheetPositionStyle = neutral;

	switch (emotion) {
		case CharacterEmotion.HAPPY:
			spriteSheetPositionStyle = happy;
			break;
		case CharacterEmotion.SAD:
			spriteSheetPositionStyle = sad;
			break;
		case CharacterEmotion.ANGRY:
			spriteSheetPositionStyle = angry;
			break;
		case CharacterEmotion.SHOCK:
			spriteSheetPositionStyle = shock;
			break;
		case CharacterEmotion.BORED:
			spriteSheetPositionStyle = bored;
			break;
		case CharacterEmotion.SURPRISE:
			spriteSheetPositionStyle = surprise;
			break;
		case CharacterEmotion.BRUH:
			spriteSheetPositionStyle = bored;
			break;
		case CharacterEmotion.EMBARRASSED:
			spriteSheetPositionStyle = embarrassed;
			break;
		case CharacterEmotion.SUS:
			spriteSheetPositionStyle = sus;
			break;

		case CharacterEmotion.NEUTRAL:
		default:
			spriteSheetPositionStyle = neutral;
	}

	const characterSheetImages: Partial<Record<CharacterName, string>> = {
		// [CharacterName.DUMMY]: monoColorSpriteSheet,
		[CharacterName.GIGI]: gigiImg,
	};

	// // REVIEW: Might move this out of here and make it more general
	// const spriteSheetPosition = (
	// 	emotion: CharacterEmotion,
	// 	container: JQuery<HTMLElement>
	// ) => {
	// 	const [_, val, dimensionUnit] = container
	// 		.css("--img-dimension")
	// 		.match(/^(\d*\.?\d+)([a-zA-Z%]+)$/) as [string, string, string];
	// 	const dimensionVal = parseFloat(val);

	// 	return `-${(emotion % 3) * dimensionVal}${dimensionUnit} -${
	// 		Math.trunc(emotion / 3) * dimensionVal
	// 	}${dimensionUnit}` as const;
	// };$.css'

	const characterSheetImageToUse = characterSheetImages[name];

	const dialogBody = $(div({ class: dialogClasses }, ""));
	const dialogImgAndContentContainer = $(div({ class: imgAndContent }, ""));
	const dialogName = $(div({ class: dialogNameClass }, displayName));
	const dialogImg = $(
		div(
			{
				class: characterSheetImageToUse
					? [dialogImgClass, pixelArt, icon64X64, spriteSheetPositionStyle]
					: [
							dialogImgClass,
							pixelArt,
							icon64X64,
							monoColorIcons.spriteSheet,
							monoColorIcons.personIcon,
					  ],
				style: characterSheetImageToUse
					? `background-image:url(${characterSheetImages[name]!})`
					: "opacity:0.5",
			},
			""
		)
	);
	const dialogContent = $(div({ class: dialogImgContent }, content));

	dialogBody.append(
		dialogName,
		dialogImgAndContentContainer.append(dialogImg, dialogContent)
	);

	return dialogBody;
}
