import { button, div } from "../../functions";
import {
  eastBtn,
  navOptions,
  northBtn,
  southBtn,
  westBtn,
} from "../styles/ui/bottom_section.module.css";
import { UiPassageName } from "./enums";
import { forceAddUI } from "./functions";

const passageText = div(
  { class: navOptions },
  button({ class: northBtn }, "North (W)") +
    button({ class: eastBtn }, "East (D)") +
    button({ class: southBtn }, "South (S)") +
    button({ class: westBtn }, "West (A)")
);

forceAddUI(UiPassageName.BOTTOM_SECTION, passageText);
