import type { PassageBase } from "twine-sugarcube";
import type {
  GenericHtmlElementAttributes,
  ImageElementAttributes,
  PassageDescriptorWithOptionalTags,
} from "./types";

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
function createElement(elementTag: string): `<${string} ${string} />`;
function createElement(
  elementTag: string,
  data: GenericHtmlElementAttributes
): `<${string} ${string} />`;
function createElement(
  elementTag: string,
  content: string
): `<${string} ${string}> ${string} </${string}>`;
function createElement(
  elementTag: string,
  data: GenericHtmlElementAttributes,
  content: string
): `<${string} ${string}> ${string} </${string}>`;
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

  const htmlNoContentStr = `<${elementTag} ${attributes} />` as const;
  const htmlContentStr = (content: string) =>
    `<${elementTag} ${attributes}>${content}</${elementTag}>` as const;

  return typeof dataOrMaybeContent == "object"
    ? actualContent
      ? htmlContentStr(actualContent)
      : htmlNoContentStr
    : dataOrMaybeContent
    ? htmlContentStr(dataOrMaybeContent)
    : htmlNoContentStr;
}

export function div(data: GenericHtmlElementAttributes, content: string) {
  return createElement("div", data, content);
}

export function span(data: GenericHtmlElementAttributes, content: string) {
  return createElement("span", data, content);
}

export function p(data: GenericHtmlElementAttributes, content: string) {
  return createElement("p", data, content);
}

export function img(data: ImageElementAttributes) {
  return createElement("img", data);
}

// !SECTION

// SECTION - Macros and widgets

// !SECTION
