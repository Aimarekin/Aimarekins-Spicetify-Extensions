export function waitForElm(selector:string, within:HTMLElement = document.body, {timeoutAfter = 5000, rejectOnTimeout = false, signal}: {timeoutAfter?: number, rejectOnTimeout?: boolean, signal?: AbortSignal}): Promise<HTMLElement> {
	return new Promise((resolve, reject) => {
		const el = within.querySelector(selector)
		if (el) {
			return resolve(el as HTMLElement)
		}

		const observer = new MutationObserver(() => {
			// TODO: Search only the subtree that has changed
			const el = within.querySelector(selector)
			if (el) {
				disconnect()
				return resolve(el as HTMLElement)
			}
		})

		const disconnect = () => {
			observer.disconnect()
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}

		let timeoutId: number | undefined

		if (timeoutAfter > 0) {
			timeoutId = setTimeout(() => {
				if (rejectOnTimeout) {
					disconnect()
					return reject("Did not find element after timeout.")
				} else {
					console.warn("waitForElm has waited for", timeoutAfter ," for selector", selector, "within", within, "but it has not yet been found.")
				}
			}, timeoutAfter)
		}

		observer.observe(within, {
			childList: true,
			subtree: true
		})

		signal?.addEventListener("abort", (ev) => {
			disconnect()
			reject(new DOMException("Aborted", "AbortError"))
		})
	})
}