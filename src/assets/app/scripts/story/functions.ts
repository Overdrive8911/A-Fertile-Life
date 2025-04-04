import type { PassageBase } from "twine-sugarcube";
import type {
  GenericHtmlElementAttributes,
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
function containerElement(
  elementTag: string,
  data: GenericHtmlElementAttributes,
  content: string
) {
  const attributes = Object.entries(data).reduce((acc, [key, val]) => {
    return `${acc} ${key}="${typeof val == "string" ? val : val?.join(" ")}"`;
  }, "");

  return `<${elementTag} ${attributes}>${content}</${elementTag}>`;
}

export function div(data: GenericHtmlElementAttributes, content: string) {
  return containerElement("div", data, content);
}

// !SECTION

// SECTION - Macros and widgets

// !SECTION
