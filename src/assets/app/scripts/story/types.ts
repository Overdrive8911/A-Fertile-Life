import type { SugarcubeVariable } from "../declarations/types";
import type { StoryPassageName } from "./enums";

type PassageNameOrPassageNameInStoryVariable =
  | StoryPassageName
  | SugarcubeVariable;

/**
 * `[[Link]]` -> `[[Grocery]]` or `[[$go]]`
 *
 * `[[Text|Link]]` -> `[[Go buy milk|Grocery]]` or `[[$show|$go]]`
 */
export type LinkMarkup =
  | `[[${PassageNameOrPassageNameInStoryVariable}]]`
  | `[[${string}|${PassageNameOrPassageNameInStoryVariable}]]`;

/**
 * `[img[Image]]` -> `[img[home.png]]` or `[img[$src]]`
 *
 * `[img[Image][Link]]` -> `[img[home.png][Home]]` or `[img[$src][$go]]`
 *
 * `[img[Title|Image]]` -> `[img[Go home|home.png]]` or `[img[$show|$src]]`
 *
 * `[img[Title|Image][Link]]` -> `[img[Go home|home.png][Home]]` or `[img[$show|$src][$go]]`
 */
export type ImageMarkup =
  | `[img[${string}]]`
  | `[img[${string}][${PassageNameOrPassageNameInStoryVariable}]]`
  | `[img[${string}|${string}]]`
  | `[img[${string}|${PassageNameOrPassageNameInStoryVariable}]]`;

export type PassageDescriptorWithOptionalTags = {
  /**
   * The tags of the passage.
   * @since 2.0.0
   */
  tags?: string[];

  /**
   * The name of the passage.
   * @since 2.37.0
   */
  name: string;
  /**
   * The raw text of the passage. Can optionally be split up into chunks of text for ease of use
   * @since 2.0.0
   */
  text: string | string[];
};

export type GenericHtmlElementAttributes = Partial<{
  id: string;
  class: string | string[];
  style: string;
  [key: `data-${string}`]: string;
}>;

export type ImageElementAttributes = GenericHtmlElementAttributes & {
  src: string;
  alt?: string;
};
