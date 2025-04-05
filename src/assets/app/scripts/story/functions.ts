import type {
  PassageBase,
  SugarCubeSetupObject,
  SugarCubeStoryVariables,
  SugarCubeTemporaryVariables,
} from "twine-sugarcube";
import type {
  GenericHtmlElementAttributes,
  ImageElementAttributes,
  PassageDescriptorWithOptionalTags,
} from "./types";
import type { MeterArgType } from "../ui/macros/meter/meter";
import { CustomMacro } from "../declarations/enums";

const passagesToAdd: PassageBase[] = [];

setup.initPassages = () => {
  passagesToAdd.forEach((passage) => {
    Story.add(passage);
  });
};

/** Use this for any passages you want to add*/
export function addPassage(passageData: PassageDescriptorWithOptionalTags) {
  const text = passageData.text;
  passagesToAdd.push({
    name: passageData.name,
    tags: passageData.tags ?? [""],
    text: typeof text == "string" ? text : text.join(""),
  });
}

// SECTION - Utility html elements
type SelfClosingElement = `<${string} />`;
type SelfClosingElementWithAttributes = `<${string} ${string} />`;
type ContainerElement = `<${string}> ${string} </${string}>`;
type ContainerElementWithAttributes =
  `<${string} ${string}> ${string} </${string}>`;

function createElement(elementTag: string): SelfClosingElement;
function createElement(
  elementTag: string,
  data: GenericHtmlElementAttributes
): SelfClosingElementWithAttributes;
function createElement(elementTag: string, content: string): ContainerElement;
function createElement(
  elementTag: string,
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
function createElement(
  elementTag: string,
  dataOrMaybeContent?: GenericHtmlElementAttributes | string,
  actualContent?: string
) {
  const attributes =
    typeof dataOrMaybeContent == "object"
      ? Object.entries(dataOrMaybeContent).reduce((acc, [key, val]) => {
          return `${acc} ${key}="${
            typeof val == "string" ? val : val?.join(" ")
          }"`;
        }, "")
      : "";

  const htmlNoContentStr:
    | SelfClosingElement
    | SelfClosingElementWithAttributes = `<${elementTag} ${attributes} />`;
  const htmlContentStr = (
    content: string
  ): ContainerElement | ContainerElementWithAttributes =>
    `<${elementTag} ${attributes}> ${content} </${elementTag}>`;

  return typeof dataOrMaybeContent == "object"
    ? actualContent
      ? htmlContentStr(actualContent)
      : htmlNoContentStr
    : dataOrMaybeContent
    ? htmlContentStr(dataOrMaybeContent)
    : htmlNoContentStr;
}

export function div(content: string): ContainerElement;
export function div(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function div(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("div", dataOrContent, content as string)
    : createElement("div", dataOrContent);
}

export function span(content: string): ContainerElement;
export function span(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function span(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("span", dataOrContent, content as string)
    : createElement("span", dataOrContent);
}

export function p(content: string): ContainerElement;
export function p(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function p(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("p", dataOrContent, content as string)
    : createElement("p", dataOrContent);
}

export function img(data: ImageElementAttributes) {
  return createElement("img", data);
}

// !SECTION

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

export function meter(...args: MeterArgType) {
  return createMacro(CustomMacro.METER, args);
}

// !SECTION

// SECTION - Variable-specific functions
// Constructs all valid paths into a nested object T
type Path<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...Path<T[K]>];
    }[keyof T]
  : [];
function getStoryVar<T, P extends Path<T>>(obj: T, ...path: P) {
  const identifier =
    obj == variables() ? "$" : obj == temporary() ? "_" : "setup.";

  return `${identifier}${path.join(".")}` as const;
}

export function stateFulVar<P extends Path<SugarCubeStoryVariables>>(
  ...args: P
) {
  return getStoryVar(variables(), ...args) as `$${string}`;
}
export function tempVar<P extends Path<SugarCubeTemporaryVariables>>(
  ...args: P
) {
  return getStoryVar(temporary(), ...args) as `_${string}`;
}
export function staticVar<P extends Path<SugarCubeSetupObject>>(...args: P) {
  return getStoryVar(setup, ...args) as `setup.${string}`;
}
// Just to reduce repetition for the player's properties :3
export function playerVar<P extends Path<SugarCubeStoryVariables["player"]>>(
  ...args: P
) {
  //@ts-ignore
  return stateFulVar("player", ...args);
}
// !SECTION

// SECTION - Others
/**
 * Use this on a string that evaluates to a variable so that changes made to the variable show up on the passage :D
 */
export function liveVar(variable: string) {
  return `{{${variable}}}` as const;
}
// !SECTION
