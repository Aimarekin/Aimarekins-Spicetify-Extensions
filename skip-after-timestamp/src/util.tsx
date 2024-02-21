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

export function getPercentageClickedOn(e: MouseEvent, elm: HTMLElement) {
	const mouseClickOffset = e.clientX - elm.getBoundingClientRect().left
	return Math.min(Math.max(mouseClickOffset / elm.clientWidth, 0), 1)
}

export function returnAnyAccess(obj: any, paths: string[]): any {
	for (const path of paths) {
		if (obj[path] !== undefined) {
			return obj[path]
		}
	}
	return undefined
}