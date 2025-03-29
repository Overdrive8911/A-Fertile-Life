import type { MacroContext } from "twine-sugarcube";
import { doesPassageExist } from "../declarations/general_declarations";
import { startScene } from "./functions";

const noPassageNamePassed = Error("No passage name passed.");
const passageDoesNotExist = Error("Passage does not exist.");

Macro.add("startScene", {
  handler: () => {
    const self = this as unknown as MacroContext;

    const sceneStartPassageName = self.args[0] as string | undefined;

    if (!sceneStartPassageName) {
      throw noPassageNamePassed;
    } else {
      if (!doesPassageExist(sceneStartPassageName)) {
        throw passageDoesNotExist;
      } else {
        startScene(sceneStartPassageName);
      }
    }
  },
});
