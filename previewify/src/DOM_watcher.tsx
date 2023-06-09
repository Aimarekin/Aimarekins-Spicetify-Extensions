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

export function bindElementTo(el: HTMLElement, rootSelector: string, containerSelector: string) {
	waitForElm(rootSelector, document.body).then((foundRoot) => {
		let currentParent : Element | null = null
		function appendElement() {
			const foundParent = foundRoot.querySelector(containerSelector)
			if (foundParent && foundParent !== currentParent) {
				currentParent = foundParent
				foundParent.appendChild(el)
			}
		}
		appendElement()

		new MutationObserver(appendElement).observe(foundRoot, {
			childList: true,
			subtree: true
		})
	})
}

export function generateBindsFor(generator: () => HTMLElement, options: string[][]) {
	const generated: HTMLElement[] = []
	options.forEach((option) => {
		const el = generator()
		generated.push(el)
		bindElementTo(el, option[0], option[1])
	})
	return generated
}