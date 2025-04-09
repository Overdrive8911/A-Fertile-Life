import type {
  GenericHtmlElementAttributes,
  ImageElementAttributes,
} from "../types";

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
          return `${acc} ${key}='${
            typeof val == "string" ? val : val?.join(" ")
          }'`;
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

export function em(content: string): ContainerElement;
export function em(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function em(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("em", dataOrContent, content as string)
    : createElement("em", dataOrContent);
}

export function strong(content: string): ContainerElement;
export function strong(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function strong(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("strong", dataOrContent, content as string)
    : createElement("strong", dataOrContent);
}

export function button(content: string): ContainerElement;
export function button(
  data: GenericHtmlElementAttributes,
  content: string
): ContainerElementWithAttributes;
export function button(
  dataOrContent: GenericHtmlElementAttributes | string,
  content?: string
) {
  return typeof dataOrContent == "object"
    ? createElement("button", dataOrContent, content as string)
    : createElement("button", dataOrContent);
}

export function img(data: ImageElementAttributes) {
  return createElement("img", data);
}
/**
 * Simple line break :D
 */

export const br = "<br>";
