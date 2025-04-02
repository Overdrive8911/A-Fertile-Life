import type { PassageBase } from "twine-sugarcube";

const passagesToAdd: PassageBase[] = [];

setup.initPassages = () => {
  passagesToAdd.forEach((passage) => {
    Story.add(passage);
  });
};

type PassageDescriptorWithOptionalTags = {
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
   * The raw text of the passage.
   * @since 2.0.0
   */
  text: string;
};
/** Use this for any passages you want to add*/
export function addPassage(passageData: PassageDescriptorWithOptionalTags) {
  passagesToAdd.push({
    name: passageData.name,
    tags: passageData.tags ?? [""],
    text: passageData.text,
  });
}
