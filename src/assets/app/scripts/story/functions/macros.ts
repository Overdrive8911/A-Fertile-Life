import { CustomMacro } from "../../declarations/enums";
import type { SugarcubeVariable } from "../../declarations/types";
import type { MeterArgType } from "../../ui/macros/meter/meter";
import type { StoryPassageName } from "../enums";
import type { LinkMarkup, ImageMarkup } from "../types";

// SECTION - Macros and widgets
type Macro = `<<${string} ${string}>>`;
type ContainerMacro = `<<${string} ${string}>>${string}<</${string}>>`;
function createMacro(
	macroName: string,
	args: (string | number | undefined | null)[]
): Macro;
function createMacro(
	macroName: string,
	args: (string | number | undefined | null)[],
	content: string
): ContainerMacro;
function createMacro(
	macroName: string,
	args: (string | number | undefined | null)[],
	content?: string
): Macro | ContainerMacro {
	const argsString = args
		.map((val) =>
			typeof val == "string"
				? `"${val}"`
				: typeof val == "number"
				? val
				: "undefined"
		)
		.join(" ");

	return content
		? `<<${macroName} ${argsString}>>${content}<</${macroName}>>`
		: `<<${macroName} ${argsString}>>`;
}

export function macroMeter(...args: MeterArgType) {
	return createMacro(CustomMacro.METER, args);
}
/** Alternative to `<<set>>` and `<<run>>`.
 * @param val - Use any object that can be `JSON.stringify`'d or converted to a string easily. Otherwise, just write the object or whatever in string format.
 * @param [noQuotes=false] - If true, the value will not be quoted even though it's a string. This is useful for expressions like "+= 1", etc
 */
export function macroSetOrRun(
	storyVariable: SugarcubeVariable,
	val: string | number | object,
	noQuotes = false
) {
	return `<<set ${storyVariable}=${
		typeof val == "string" ? (noQuotes ? val : `"${val}"`) : JSON.stringify(val)
	}>>` as const;
}
type SimpleMacroBtn =
	| `<<button ${string}>> ${string} <</button>>`
	| `<<button ${string} ${StoryPassageName}>> ${string} <</button>>`;
export function macroButton(
	linkMarkup: LinkMarkup,
	textToRunOnClick?: string
): `<<button ${LinkMarkup}>> ${string} <</button>>`;
export function macroButton(
	imageMarkup: ImageMarkup,
	textToRunOnClick?: string
): `<<button ${ImageMarkup}>> ${string} <</button>>`;
export function macroButton(
	linkText: string,
	textToRunOnClick: string,
	passageToLinkTo?: StoryPassageName
): SimpleMacroBtn;
export function macroButton(
	linkTextOrLinkMarkupOrImageMarkup: string | LinkMarkup | ImageMarkup,
	textToRunOnClick?: string,
	passageToLinkTo?: StoryPassageName
) {
	return `<<button ${
		linkTextOrLinkMarkupOrImageMarkup.endsWith("]")
			? linkTextOrLinkMarkupOrImageMarkup
			: `"${linkTextOrLinkMarkupOrImageMarkup}"`
	} ${passageToLinkTo ?? ""}>> ${textToRunOnClick ?? ""} <</button>>`;
}
/**
 * @param variableName: The name of the variable to modify, which must be quoted—e.g., "$foo". Object and array property references are also supported—e.g., "$foo.bar", "$foo['bar']", & "$foo[0]".
 *
 * @param defaultValue: The default value of the text box.
 *
 * @param passageName: (optional) The name of the passage to go to if the return/enter key is pressed. May be called either with the passage name or with a link markup.
 *
 * @param autofocus: (optional) Keyword, used to signify that the text box should automatically receive focus. Only use the keyword once per page; attempting to focus more than one element is undefined behavior.
 */

export function macroTextBox(
	variableName: SugarcubeVariable,
	defaultValue: string | number,
	passageName?: StoryPassageName,
	autoFocus = false
) {
	return `<<textbox "${variableName}" ${defaultValue} ${passageName ?? ""} ${
		autoFocus ? "autofocus" : ""
	}>>` as const;
}
type SimpleMacroLink =
	| `<<link ${string}>> ${string} <</link>>`
	| `<<link ${string} ${StoryPassageName}>> ${string} <</link>>`;
export function macroLink(
	linkMarkup: LinkMarkup,
	textToRunOnClick?: string
): `<<link ${LinkMarkup}>> ${string} <</link>>`;
export function macroLink(
	imageMarkup: ImageMarkup,
	textToRunOnClick?: string
): `<<link ${ImageMarkup}>> ${string} <</link>>`;
export function macroLink(
	linkText: string,
	textToRunOnClick?: string,
	passageToLinkTo?: StoryPassageName
): SimpleMacroLink;
export function macroLink(
	linkTextOrLinkMarkupOrImageMarkup: string | LinkMarkup | ImageMarkup,
	textToRunOnClick?: string,
	passageToLinkTo?: StoryPassageName
) {
	return `<<link ${
		linkTextOrLinkMarkupOrImageMarkup.endsWith("]")
			? linkTextOrLinkMarkupOrImageMarkup
			: `"${linkTextOrLinkMarkupOrImageMarkup}"`
	} ${passageToLinkTo ?? ""}>> ${textToRunOnClick ?? ""} <</link>>`;
}

export function macroImage(
	imgUrl: string,
	passageToLinkTo?: StoryPassageName,
	title?: string
): ImageMarkup {
	if (!passageToLinkTo && !title) return `[img[${imgUrl}]]`;
	else if (!passageToLinkTo && title) return `[img[${title}|${imgUrl}]]`;
	else if (passageToLinkTo && !title)
		return `[img[${imgUrl}][${passageToLinkTo}]]`;
	else return `[img[${title}|${imgUrl}][${passageToLinkTo}]]`;
}

/**
 * @param selector: The CSS/jQuery-style selector used to target element(s).
 * @param classNames: The names of the class(es)
 */
export function macroAddClass(selector: string, classNames: string | string[]) {
	return `<<addclass "${selector}" "${
		typeof classNames == "string" ? classNames : classNames.join(" ")
	}">>`;
}

/**
 * @param selector: The CSS/jQuery-style selector used to target element(s).
 * @param classNames: The names of the class(es). If there are none, all classes attached to the element(s) will be removed.
 */
export function macroRemoveClass(
	selector: string,
	classNames?: string | string[]
) {
	return `<<removeclass "${selector}" "${
		typeof classNames == "string"
			? classNames
			: classNames
			? classNames.join(" ")
			: ""
	}">>`;
}

type CssTimeValue = `${number}s` | `${number}ms`;
/**
 * Executes its contents after the given delay, inserting any output into the passage in its place. Additional timed executions may be chained via <<next>>
 */
export function macroTimed(
	delayAndContent: { delay?: CssTimeValue; content: string }[],
	shouldTransition = false
) {
	let returnString = "";

	delayAndContent.forEach(({ delay, content }, index) => {
		if (index == 0) {
			returnString += `<<timed ${delay ?? "2.5s"} ${
				shouldTransition ? "t8n" : ""
			}>> ${content}`;
		} else {
			returnString += ` <<next ${delay ?? ""}>> ${content}`;
		}

		if (index == delayAndContent.length - 1) {
			returnString += ` <</timed>>`;
		}
	});

	return returnString;
}

/**
 * For running arbitrary javascript like:
 * 
 * ```
 *  <<script>>
            $("html").scrollTop($("html").scrollTop() + 50);
    <</script>>
  ```
 */
export function macroScript(javascriptStringToRun: string) {
	return createMacro("script", [], javascriptStringToRun);
}

/**
 * Executes its contents and replaces the contents of the selected element(s) with the output.
 *
 * @param selector: The CSS/jQuery-style selector used to target element(s).
 * @param shouldTransition: (optional) Keyword, used to signify that a CSS transition should be applied to the incoming insertions.
 * @param content: Content to be inserted.
 */
export function macroReplace(
	selector: string,
	content?: string,
	shouldTransition = false
) {
	return `<<replace '${selector}' ${shouldTransition ? "t8n" : ""}>> ${
		content ?? ""
	} <</replace>>` as const;
}

export function macroSilently(content: string) {
	return `<<silently>> ${content} <</silently>>` as const;
}

/**
 * This should be a Twinescript string that evaluates to a boolean.
 *
 * TODO: Make this type more strict
 */
type Conditional = string;
/**
 *
 * @param args - NOTE: The first condition must exist. In fact, the only time a condition may not exist is if it is the last argument since it will be converted to `else` instead of `elseIf`
 */
export function macroIf(
	...args: { condition?: Conditional; content: string }[]
) {
	let returnString = "";

	args.forEach(({ condition, content }, index) => {
		if (index == 0) {
			returnString += `<<if ${condition ?? ""}>> ${content}`;
		} else {
			returnString += condition
				? `<<elseif ${condition}>> ${content}`
				: `<<else>> ${content}`;
		}

		if (index == args.length - 1) {
			returnString += `<</if>>`;
		}
	});

	return returnString;
}

export function macroPrint(textToPrint: string) {
	return `<<print ${textToPrint}>>`;
}
