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
 */

export function macroSetOrRun(
  storyVariable: SugarcubeVariable,
  val: string | number | object
) {
  return `<<set ${storyVariable}=${
    typeof val == "string" ? val : JSON.stringify(val)
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
