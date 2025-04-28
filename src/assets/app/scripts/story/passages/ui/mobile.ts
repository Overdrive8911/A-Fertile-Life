import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { mobile, open } from "./ui.module.css";

runOnPassageEnd(() => {
	const $mobileSidebar = $(convertToClass(mobile));
	const EVENT_TYPE = "click";

	$mobileSidebar.off(EVENT_TYPE).on(EVENT_TYPE, () => {
		$mobileSidebar.toggleClass(open);
	});

	const $directDivInMobileSidebar = $mobileSidebar.children("div");
	$directDivInMobileSidebar.off(EVENT_TYPE).on(EVENT_TYPE, (ev) => {
		// Don't need any of the children to propagate any events
		ev.stopPropagation();
	});
});
