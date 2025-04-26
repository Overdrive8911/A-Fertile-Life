import { watchDOM } from "../../../declarations/functions";
import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { div } from "../../functions/html_elements";
import { nav, passageArea } from "./ui.module.css";

let passageObserver: MutationObserver | undefined;
let linkContainerObserver: MutationObserver | undefined;
/**
 * This will connect all the links and their copies
 */
const linkMap = new WeakMap<HTMLElement | NodeList, HTMLElement | NodeList>();

// This will copy all links in the current passage into a special container for ease of use.
// Copied links, when clicked, also scroll the passage to the original link's position unless they are connected to other passages.
// Copied links will be removed when te passage is refreshed or the original link is removed from the DOM.
runOnPassageEnd((e) => {
	const $bottomLinkContainer = $(convertToClass(nav)).empty();
	const $passageContent = $((e.detail as any).content);
	const linkSelector = "a.link-internal";

	function processLinks(
		$elementToSearchForLinks: JQuery | JQuery<NodeList>,
		areLinksAdded = true
	) {
		const $possibleChildLinks = $elementToSearchForLinks.find(linkSelector);

		// Sometimes (especially when links are removed via replacing and the likes) `$elementToSearchForLinks` is the link itself.
		const $links =
			$possibleChildLinks.length > 0
				? $possibleChildLinks
				: $elementToSearchForLinks.is(linkSelector)
				? $elementToSearchForLinks
				: $();

		$links.each((index, originalLink) => {
			const $originalLink = $(originalLink);

			function getIdenticalLinkInBottomContainer() {
				return linkMap.get(originalLink);
			}

			if (areLinksAdded) {
				// Prevent duplicates in cases like timed macros
				if (!getIdenticalLinkInBottomContainer()) {
					const linkOffset = $originalLink.offset()?.top ?? 0;
					const passageContentOffset = $passageContent.offset()?.top ?? 0;
					const distance = linkOffset - passageContentOffset;
					const $link = $originalLink.clone(true);

					linkMap.set(originalLink, $link[0]);

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
				$(getIdenticalLinkInBottomContainer() ?? {})
					.parent()
					.remove();
				linkMap.delete(originalLink);
			}

			// Add numbers to all the links initially
			$(getIdenticalLinkInBottomContainer() ?? {}).html(
				`${index + 1}. ${$originalLink.html()}`
			);
		});
	}

	processLinks($passageContent);

	passageObserver?.disconnect();
	passageObserver = watchDOM($passageContent[0], {}, (mutations) => {
		mutations.forEach((mutation) => {
			processLinks($(mutation.removedNodes), false);
			processLinks($(mutation.addedNodes));
		});
	});

	linkContainerObserver?.disconnect();
	linkContainerObserver = watchDOM(
		$bottomLinkContainer[0],
		{ subtree: false },
		(_) => {
			const $links = $bottomLinkContainer.find(linkSelector);
			// Loop through all the links and give / edit their listing numbers
			$links.each((index, link) => {
				const $link = $(link);

				// "1. Your voice is a bit odd." gives "Your voice is a bit odd."
				const linkText = $link.html();
				const textToRemove = linkText.match(/^\d+\.\s*/)?.[0] ?? "";
				const parsedLinkText = linkText.replace(textToRemove, "");

				$link.html(`${index + 1}. ${parsedLinkText}`);
			});
		}
	);
}, false);
