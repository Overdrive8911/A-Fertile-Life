import type { MacroContext } from "twine-sugarcube";
import { doesPassageExist } from "../declarations/general_declarations";
import { endScene, startScene } from "./functions";
import type { SceneState } from "./types";
import type { AreaUUID } from "../location/types_and_interfaces";
import { SceneEnum } from "./enums";

const noPassageNamePassed = Error("No passage name passed.");
const passageDoesNotExist = Error("Passage does not exist.");

Macro.add("startScene", {
  handler() {
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
  handler() {
    const self = this as unknown as MacroContext;

    const passageOrAreaIdToWarpTo = self.args[0] as
      | string
      | AreaUUID
      | undefined;

    endScene(undefined, passageOrAreaIdToWarpTo);
  },
});

Macro.add("pauseScene", {
  handler() {
    const self = this as unknown as MacroContext;

    const passageOrAreaIdToWarpTo = self.args[0] as
      | string
      | AreaUUID
      | undefined;

    endScene(SceneEnum.STATE_PAUSED, passageOrAreaIdToWarpTo);
  },
});

Macro.add("cancelScene", {
  handler() {
    const self = this as unknown as MacroContext;
    const passageOrAreaIdToWarpTo = self.args[0] as
      | string
      | AreaUUID
      | undefined;

    endScene(SceneEnum.STATE_CANCELLED, passageOrAreaIdToWarpTo);
  },
});
