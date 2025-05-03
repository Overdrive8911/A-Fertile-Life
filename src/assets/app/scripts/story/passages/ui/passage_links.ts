import { validateKeyEvent, watchDOM } from "../../../declarations/functions";
import {
	convertToClass,
	runOnPassageEnd,
} from "../../../declarations/general_declarations";
import { Direction } from "../../../location/enums";
import {
	currentArea,
	currentAreaConnections,
} from "../../../location/functions";
import { warpToConnectedArea } from "../../../location/navigation";
import { div, span, strong } from "../../functions/html_elements";
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
	/**
	 * Matches "1. " in "1. Test Button" and "🡺. " in "🡺. East to Bakery"
	 */
	const listStarterRegex = /^\d+\.\s*/;
	const CLICK_EVENT = "click";
	const currAreaConnections = currentAreaConnections();
	const keydownNamespaceEvent = "keydown.navLink";

	$(window).off(keydownNamespaceEvent);

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
			const listNumber = index + 1;

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

						// NOTE: In some cases, the link has no events (perhaps due to a passage reload?), checking it through the internal api and manually finding the original link should work.
						if (!($ as any)._data(originalLink, "events")) {
							const $realLink = $(convertToClass(passageArea))
								.find(linkSelector)
								.filter((_, possibleRealLink) => {
									const linkText = $link.html();
									return (
										$(possibleRealLink).html() ==
										linkText.replace(
											linkText.match(listStarterRegex)?.[0] ?? "",
											""
										)
									);
								});

							$realLink.trigger(CLICK_EVENT);
						}
					});
					$link.wrap(div());

					$link.parent().on(`${CLICK_EVENT} keydown`, (ev) => {
						if (ev.type == CLICK_EVENT || ev.key == "Enter" || ev.key == " ") {
							e.preventDefault();
							$link.trigger(CLICK_EVENT);
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
				`${listNumber}. ${$originalLink.html()}`
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
				const textToRemove = linkText.match(listStarterRegex)?.[0] ?? "";
				const parsedLinkText = linkText.replace(textToRemove, "");

				$link.html(`${index + 1}. ${parsedLinkText}`);
			});
		}
	);

	// Add navigation buttons if the user is in the appropriate "area" passage
	if (currentArea().passage == passage()) {
		currAreaConnections.forEach(({ area }, direction) => {
			let dirArrow: "🡺" | "🡸" | "🡹" | "🡻" | "🢙" | "🢛" = "🡺";
			let dirKeyShortcut: "W" | "A" | "S" | "D" | "Q" | "E" = "D";

			switch (direction) {
				case Direction.NORTH:
					dirArrow = "🡹";
					dirKeyShortcut = "W";
					break;
				case Direction.EAST:
					dirArrow = "🡺";
					dirKeyShortcut = "D";
					break;
				case Direction.SOUTH:
					dirArrow = "🡻";
					dirKeyShortcut = "S";
					break;
				case Direction.WEST:
					dirArrow = "🡸";
					dirKeyShortcut = "A";
					break;
				case Direction.UP:
					dirArrow = "🢙";
					dirKeyShortcut = "Q";
					break;
				case Direction.DOWN:
					dirArrow = "🢛";
					dirKeyShortcut = "E";
					break;
			}

			const $navText = $(
				span(
					`${dirArrow}. Go${strong(direction)}to${strong(
						`${area.name} (${dirKeyShortcut})`
					)}`
				)
			);
			$navText.prependTo($bottomLinkContainer);
			$navText.wrap(div());
			const $navTextWrapper = $navText.parent();
			$navTextWrapper.ariaClick(() => {
				warpToConnectedArea(direction);
			});
		});
	}

	// Add an event handler to the window for accessing the bottom container links
	$(window).on(keydownNamespaceEvent, (ev) => {
		const possibleNumberKeysClicked = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
		const numericKeyValue = parseInt(ev.key!);
		const linkIndex = possibleNumberKeysClicked.findIndex(
			(numKey) => numKey == numericKeyValue
		);

		if (validateKeyEvent(ev) && linkIndex != -1)
			$($bottomLinkContainer.find(linkSelector)[linkIndex])
				.parent()
				.trigger(CLICK_EVENT);
	});
}, false);
