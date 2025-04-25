import { watchDOM } from "../../../declarations/functions";
import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { div } from "../../functions/html_elements";
import { nav, passageArea } from "./ui.module.css";

let observer: MutationObserver | undefined;

// This will copy all links in the current passage into a special container for ease of use.
// Copied links, when clicked, also scroll the passage to the original link's position unless they are connected to other passages.
// Copied links will be removed when te passage is refreshed or the original link is removed from the DOM.
runOnPassageEnd((e) => {
	const $bottomLinkContainer = $(convertToClass(nav)).empty();
	const $passageContent = $((e.detail as any).content);

	function processLinks(
		$elementToSearchForLinks: JQuery | JQuery<NodeList>,
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

						const $passageArea = $(convertToClass(passageArea));
						// No use scrolling if the link navigates to another passage
						if (!$link.is("[data-passage]")) {
							$passageArea.animate({ scrollTop: distance }, 750);
						} else {
							// Snap back to the top so the player doesn't miss anything on the new passage :D
							$passageArea.scrollTop(0);
						}
					});
					$link.wrap(div());

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
