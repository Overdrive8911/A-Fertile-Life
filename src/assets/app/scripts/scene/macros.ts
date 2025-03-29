import type { MacroContext } from "twine-sugarcube";
import { doesPassageExist } from "../declarations/general_declarations";
import { endScene, startScene } from "./functions";
import type { SceneState } from "./types";
import type { AreaUUID } from "../location/types_and_interfaces";

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

Macro.add("endScene", {
  handler: () => {
    const self = this as unknown as MacroContext;

    const option = self.args[0] as SceneState | undefined;
    const passageOrAreaIdToWarpTo = self.args[0] as
      | string
      | AreaUUID
      | undefined;

    endScene(option, passageOrAreaIdToWarpTo);
  },
});
