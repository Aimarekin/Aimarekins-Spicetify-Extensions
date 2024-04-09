export function watchForElement(
	selector: string,
	within: HTMLElement = document.body,
	callback: (el: Node) => void,
	destructionCallback?: (el: Node) => void
) {
	function elementFound(el: Node) {
		callback(el as HTMLElement)

		if (destructionCallback) {
			new MutationObserver((records, observer) => {
				for (const record of records) {
					for (const removedNode of record.removedNodes) {
						if (removedNode !== el) continue
						observer.disconnect()
						destructionCallback(el)
						return
					}
				}
			}).observe(el.parentNode!, {
				childList: true
			})
		}
	}

	// Initial search
	const el = within.querySelector(selector)
	if (el) elementFound(el)

	new MutationObserver((records) => {
		for (const record of records) {
			for (const addedNode of record.addedNodes) {
				if (!(addedNode instanceof HTMLElement)) continue
				const el = addedNode.querySelectorAll(selector).forEach(elementFound)
			}
		}
	}).observe(within, {
		childList: true,
		subtree: true
	})
}