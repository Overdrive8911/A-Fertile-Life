import { ItemId } from "../../inventory_and_items/declarations/item_enums";
import { StoryPassageName } from "../enums";
import {
  addPassage,
  br,
  macroButton,
  macroLink,
  macroMeter,
  macroSetOrRun,
  macroTextBox,
  p,
  tempCounterVar,
  tempVar,
} from "../functions";

addPassage({
  text:
    p(
      "Here, you are. Standing in the middle of the void. Surrounded by the nothingness that once held your reality together. That time is long past however. You came here for a reason; to experiment, to experiment to your fill. In this place, nothing can truly be created or destroyed but the dark matter her can be moulded to your will."
    ) +
    p(
      macroSetOrRun(tempCounterVar, 0.5) +
        "Custom meter:" +
        macroMeter(tempCounterVar, "11.5rem", "1rem") +
        macroButton(
          "Increase",
          macroSetOrRun(
            tempCounterVar,
            tempCounterVar + ">=1?0:" + tempCounterVar + "+0.1"
          )
        )
    ) +
    p(
      "It's time to get down to business, so go on and manipulate this new world to how you see fit!"
    ) +
    macroTextBox(tempVar("cache1"), ItemId.CHEESE) +
    p(
      macroLink(
        "Add the Item above to Inventory (Click 'Enter' before this link)",
        // TODO: Use a function instead of a raw string
        `<<giveItem ${tempVar("cache1")}>>`
      ) +
        br +
        macroLink("Add 5 of them", `<<giveItem ${tempVar("cache1")} 5>>`)
    ) +
    macroTextBox(tempVar("cache2"), ItemId.CHEESE) +
    p(
      macroLink(
        "Remove the Item above to Inventory (Click 'Enter' before this link)",
        `<<deleteItem ${tempVar("cache2")}}>>`
      ) +
        br +
        macroLink("Remove 5 of them", `<<deleteItem ${tempVar("cache2")} 5>>`)
    ) +
    p(macroLink("Add All Items Once", `<<run setup.addAllItems()>>`)) +
    p(
      macroLink(
        "PLAP! PLAP! PLAP! PLAP! Get Pregnant! Get Pregnant! Get Pregnant! Get Pregnant!",
        `<<impregnate 60 5 $player.womb 1>>`
      )
    ) +
    p(macroLink("[[Teleport to default map|Fertilo_Inc_Porch]]")) +
    p(macroLink("Skip 30 minutes", `<<skipTime 0 0 30>>`)) +
    p(macroLink("Rewind 30 minutes", `<<skipTime 0 0 -30>>`)) +
    p(macroLink("Skip 1 day", `<<skipTime 1 0 0>>`)) +
    p(macroLink("Rewind 1 day", `<<skipTime -1 0 0>>`)) +
    p(macroLink("Skip 1 week", `<<skipTime 7 0 0>>`)) +
    p(macroLink("Rewind 1 week", `<<skipTime -7 0 0>>`)) +
    p(macroLink(`[[Reload Passage|${StoryPassageName.DEBUG_SANDBOX}]]`)) +
    p(macroLink("Test Prologue Scene", `<<startScene "Prologue_Beginning">>`)),
  name: StoryPassageName.DEBUG_SANDBOX,
  tags: [""],
});
