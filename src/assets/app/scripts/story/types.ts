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
  [key: `data-${string}`]: string;
}>;

export type ImageElementAttributes = GenericHtmlElementAttributes & {
  src: string;
  alt?: string;
};
