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

	function processLinks(
		$elementToSearchForLinks: JQuery<any>,
		areLinksAdded = true
	) {
		const linkSelector = "a.link-internal";
		const $possibleChildLinks = $elementToSearchForLinks.find(linkSelector);

		// Sometimes (especially when links are removed via replacing and the likes) `$elementToSearchForLinks` is the link itself.
		const $links =
			$possibleChildLinks.length > 0
				? $possibleChildLinks
				: $elementToSearchForLinks.is(linkSelector)
				? $elementToSearchForLinks
				: $();

		$links.each((_, ele) => {
			const $originalLink = $(ele);

			function getIdenticalLinkInBottomContainer() {
				return $bottomLinkContainer.find(linkSelector).filter(function () {
					return $(this).html() == $originalLink.html();
				});
			}

			if (areLinksAdded) {
				// Prevent duplicates in cases liked timed macros
				if (getIdenticalLinkInBottomContainer().length < 1) {
					const linkOffset = $originalLink.offset()?.top ?? 0;
					const passageContentOffset = $passageContent.offset()?.top ?? 0;
					const distance = linkOffset - passageContentOffset;
					const $link = $originalLink.clone(true);

					$link.appendTo($bottomLinkContainer).ariaClick((e) => {
						// Otherwise, we'd get some recursion issues >~<
						e.stopPropagation();

						$(convertToClass(passageArea)).animate(
							{ scrollTop: distance },
							750
						);
					});
					$link.wrap(div(""));

					$link.parent().on("click keydown", (ev) => {
						if (ev.type == "click" || ev.key == "Enter" || ev.key == " ") {
							e.preventDefault();
							$link.trigger("click");
						}
					});
				}
			} else {
				// Search for links in the bottom container with identical text and remove them.
				getIdenticalLinkInBottomContainer().parent().remove();
			}
		});
	}

	processLinks($passageContent);

	observer?.disconnect();
	observer = watchDOM($passageContent[0], {}, (mutations) => {
		mutations.forEach((mutation) => {
			processLinks($(mutation.removedNodes), false);
			processLinks($(mutation.addedNodes));
		});
	});
}, false);
