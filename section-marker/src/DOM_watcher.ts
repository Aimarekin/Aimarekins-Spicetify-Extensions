export function waitForElm(selector:string, within:HTMLElement = document.body, timeoutAfter = 5000, shouldReject = false): Promise<HTMLElement> {
	return new Promise((resolve, reject) => {
		let timeoutId: NodeJS.Timeout
		if (timeoutAfter > 0) {
			timeoutId = setTimeout(() => {
				if (shouldReject) {
					return reject("Did not find element after timeout.")
				} else {
					console.warn("waitForElm has waited for", timeoutAfter ," for selector", selector, "within", within, "but it has not yet been found.")
				}
			}, timeoutAfter)
		}

		const el = within.querySelector(selector)
		if (el) {
			return resolve(el as HTMLElement)
		}

		const observer = new MutationObserver(() => {
			const el = within.querySelector(selector)
			if (el) {
				observer.disconnect()
				clearTimeout(timeoutId)
				return resolve(el as HTMLElement)
			}
		})

		observer.observe(within, {
			childList: true,
			subtree: true
		})
	})
}

export function watchForElement(
	selector: string,
	within: HTMLElement = document.body,
	callback: (el: Node) => void,
	destructionCallback?: (el: Node) => void,
	watch_subtree = true
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
		subtree: watch_subtree
	})
}