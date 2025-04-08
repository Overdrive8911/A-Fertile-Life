import type { PassageBase } from "twine-sugarcube";
import type { PassageDescriptorWithOptionalTags } from "../types";

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
