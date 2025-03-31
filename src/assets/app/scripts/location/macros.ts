import type { MacroContext } from "twine-sugarcube";
import { warpToArea } from "./navigation";

Macro.add("warp", {
  handler() {
    const self = this as unknown as MacroContext;
    const passageOfAreaToWarpTo = self.args[0] as string;

    warpToArea(passageOfAreaToWarpTo);
  },
});
