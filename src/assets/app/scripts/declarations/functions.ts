/**
 * Watch a DOM element or selector for mutations.
 *
 * @param target   CSS selector or DOM element to observe.
 * @param options          MutationObserverInit options.
 * @param callback       Function to call on each mutation.
 * @returns {MutationObserver}      The observer instance (so you can later disconnect).
 */
export function watchDOM(
	target: string | HTMLElement,
	options: MutationObserverInit,
	callback: (
		mutationsList: MutationRecord[],
		observer: MutationObserver
	) => void
) {
	// Resolve selector to a DOM node if needed
	const node =
		typeof target === "string" ? document.querySelector(target) : target;
	if (!node) {
		throw new Error("watchDOM: target element not found");
	}

	// Create observer linked to callback
	const observer = new MutationObserver((mutationsList) => {
		callback(mutationsList, observer);
	});

	// Start observing with user-provided or sensible defaults
	observer.observe(node, {
		childList: options.childList ?? true,
		subtree: options.subtree ?? true,
		attributes: options.attributes ?? false,
		characterData: options.characterData ?? false,
		...options,
	});

	return observer;
}

/**
 * Pass in an Event
 */
export function validateKeyEvent(e: unknown) {
	const { target } = e as Event;
	// Don't trigger in textboxes and similar elements
	if (
		target instanceof HTMLElement &&
		(["INPUT", "TEXTAREA"].includes(target.nodeName) ||
			target.isContentEditable)
	)
		return false;

	return true;
}
