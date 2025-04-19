import { convertToClass } from "../../declarations/general_declarations";
import {
	restartBtn,
	saveBtn,
	settingBtn,
} from "./../../story/passages/styles/ui/top_section.module.css";
$(document).on(":passageend", () => {
	// SECTION - Add the settings, restart and save menus to the icons
	$(convertToClass(settingBtn)).ariaClick(() => {
		UI.settings();
	});
	$(convertToClass(saveBtn)).ariaClick(() => {
		UI.saves();
	});
	$(convertToClass(restartBtn)).ariaClick(() => {
		UI.restart();
	});

	// switchToAlternateUiStatBarIconWhenNeeded("901px", "24x24");
});

$(window).on("resize", () => {
	// Run it upon resize. Mostly applies to devices with resizeable browsers
	// switchToAlternateUiStatBarIconWhenNeeded("901px", "24x24");
});
