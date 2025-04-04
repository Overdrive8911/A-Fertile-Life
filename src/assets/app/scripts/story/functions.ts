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
function element(
  elementTag: string,
  data: GenericHtmlElementAttributes
): `<${string} ${string} />`;
function element(
  elementTag: string,
  data: GenericHtmlElementAttributes,
  content: string
): `<${string} ${string}> ${string} </${string}>`;
function element(
  elementTag: string,
  data: GenericHtmlElementAttributes,
  content?: string
) {
  const attributes = Object.entries(data).reduce((acc, [key, val]) => {
    return `${acc} ${key}="${typeof val == "string" ? val : val?.join(" ")}"`;
  }, "");

  return content
    ? `<${elementTag} ${attributes}>${content}</${elementTag}>`
    : `<${elementTag} ${attributes} />`;
}

export function div(data: GenericHtmlElementAttributes, content: string) {
  return element("div", data, content);
}

export function span(data: GenericHtmlElementAttributes, content: string) {
  return element("span", data, content);
}

export function p(data: GenericHtmlElementAttributes, content: string) {
  return element("p", data, content);
}

export function img(data: ImageElementAttributes) {
  return element("img", data);
}

// !SECTION

// SECTION - Macros and widgets

// !SECTION
