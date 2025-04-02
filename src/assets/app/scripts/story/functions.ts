import type { PassageBase } from "twine-sugarcube";

const passagesToAdd: PassageBase[] = [];

setup.initPassages = () => {
  passagesToAdd.forEach((passage) => {
    Story.add(passage);
  });
};

/** Use this for any passages you want to add*/
export function addPassage(passageData: PassageBase) {
  passagesToAdd.push(passageData);
}
