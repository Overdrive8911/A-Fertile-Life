import type { MacroContext } from "twine-sugarcube";
import { doesPassageExist } from "../declarations/general_declarations";
import { startScene } from "./functions";

Macro.add("startScene", {
  handler: () => {
    const self = this as unknown as MacroContext;

    const sceneStartPassageName = self.args[0] as string | undefined;

    if (!sceneStartPassageName) {
      throw Error("No passage name passed.");
    } else {
      if (!doesPassageExist(sceneStartPassageName)) {
        throw Error("Passage does not exist.");
      } else {
        startScene(sceneStartPassageName);
      }
    }
  },
});
