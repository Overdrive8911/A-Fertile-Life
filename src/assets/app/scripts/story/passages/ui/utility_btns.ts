import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { save, settings, restart, inventory } from "./ui.module.css";

runOnPassageEnd(() => {
	const addAriaClick = (className: string, func: (e: JQuery.Event) => any) => {
		$(convertToClass(className)).ariaClick((e) => func(e));
	};

	addAriaClick(settings, () => {
		UI.settings();
	});
	addAriaClick(save, () => {
		UI.saves();
	});
	addAriaClick(restart, () => {
		UI.restart();
	});
});
