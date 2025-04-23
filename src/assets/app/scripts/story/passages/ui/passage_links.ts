import { watchDOM } from "../../../declarations/functions";
import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { div } from "../../functions/html_elements";
import { nav, passageArea } from "./ui.module.css";

let observer: MutationObserver | undefined;
// This will move all links (connected to other passages) in the current passage into a special container for ease of use.
runOnPassageEnd((e) => {
	const $bottomLinkContainer = $(convertToClass(nav)).empty();
	const $passageContent = $((e.detail as any).content);

	function processLinks($elementToSearchForLinks: JQuery<any>) {
		const $addedLinks = $elementToSearchForLinks.find(
			// "a[data-passage]:not(.link-broken)"
			// "[data-name*=link]:has(a)"
			"a.link-internal"
		);

		$addedLinks.each((_, ele) => {
			const $originalLink = $(ele);
			const $link = $originalLink.clone(true);

			$link.appendTo($bottomLinkContainer).ariaClick(() => {
				const linkOffset = $originalLink.offset()?.top ?? 0;
				const passageContentOffset = $passageContent.offset()?.top ?? 0;
				const distance = linkOffset - passageContentOffset;

				$(convertToClass(passageArea)).animate({ scrollTop: distance }, 750);

				const $linkContainer = $link.parent();
				$linkContainer.remove();
			});
			$link.wrap(div({ role: "button", tabIndex: "0" }, ""));

			$link.parent().on("click keydown", (ev) => {
				if (ev.type == "click" || ev.key == "Enter" || ev.key == " ") {
					e.preventDefault();
					$link.trigger("click");
				}
			});
		});
	}

	processLinks($passageContent);

	observer?.disconnect;
	observer = watchDOM($passageContent[0], {}, (mutations) => {
		mutations.forEach((mutation) => {
			const $addedNodes = $(mutation.addedNodes);
			processLinks($addedNodes);
		});
	});
}, false);
