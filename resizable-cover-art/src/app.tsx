import { waitForElm, watchForElement } from "./DOM_watcher"
import { getSourceDetails, SourceDetails } from "./source_details"
import { Translate } from "./localizer"
import { SourceInfo, SourceType, getCurrentContext } from "./context"
import "./format_unicorn"
import "./style.scss"

type PlayingSourceInterface = HTMLDivElement

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync || !Spicetify?.React) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	const React = Spicetify.React

	const formatForCSSClass = (str:string) => str.replace("_", "-").toLowerCase()
	
	// Create album overlay
	
	
	// For expanded:
	// OLD GUI:
	// Root class is "main-downloadClient-container"
	// LIBRARY X:
	// Root class is "UalNRoO1omHtEEniypS5" (or "i4nABk12gLqZuh9Jbdw1" in 1.2.14.1149)
	// Both, then watch for creation of element with class "cover-art"

	// For collapsed:
	// Root class is "main-nowPlayingBar-left"
	// Then watch for creation of element with class "main-coverSlotCollapsed-container"

	// For right sidebar:
	// This feature is still in development, and may change/get more specific in the future
	// Root class is "Root__top-container"
	// Display on top of "main-nowPlayingView-coverArt"

	/* BINDING TO EXPANDED COVERS */

	function createInterfaceAO() {
		const el = createInterface()
		playingSourceInterfaces.push(el)
		el.classList.add("playing-source-album-overlay")
		return el
	}

	// Bind to old gui and library x
	// selector / within
	const expandingSelectors: [string, string][] = [
		[ ".cover-art", ".main-downloadClient-container" ],
		[ ".cover-art", ".UalNRoO1omHtEEniypS5,.i4nABk12gLqZuh9Jbdw1" ]
	]
	
	const InterfaceAO = createInterfaceAO()
	expandingSelectors.forEach((pair) => {
		waitForElm(pair[1], undefined, 0).then((foundParent) => {
			watchForElement(pair[0], foundParent, (el) => {
				el.appendChild(InterfaceAO)
				// Disable tippy
				destroyTippy()
			},
			() => {
				// Re-enable tippy
				addTippy()
			})
		})
	})

	// Bind to now playing view
	// TODO

	/*
		BINDING TO COLLAPSED COVER
		AKA TIPPY	
	*/

	const TippyProps = {
		...Spicetify.TippyProps,
		delay : 0,
		trigger: "mouseenter focus",
		interactive: true,
		allowHTML: true,
		offset: [0, 30] as [number, number],
		//interactiveDebounce: 50000,
	}

	let tippyInstance: Tippy.Instance | null = null
	let tippyShouldBeApplied = true
	let tippyRoot: HTMLElement | undefined = undefined

	const playingBarLeft = waitForElm(".main-nowPlayingBar-left")
	
	playingBarLeft.then((el) => {
		tippyRoot = el
		// Listen to changes in DOM
		watchForElement(".main-coverSlotCollapsed-container", tippyRoot, () => { 
			if (tippyShouldBeApplied) addTippy()
		})
	})
	const tippyContents = createInterface()
	tippyContents.classList.add("playing-source-tt")

	async function addTippy() {
		tippyShouldBeApplied = true
		const el = tippyRoot?.querySelector(".main-coverSlotCollapsed-container")
		if (!el || el === tippyInstance?.reference) return

		tippyInstance?.destroy()

		tippyInstance = Spicetify.Tippy(el, TippyProps) as Tippy.Instance
		tippyInstance.popper.querySelector(".main-contextMenu-tippy")!.appendChild(tippyContents)
	}

	function destroyTippy() {
		tippyShouldBeApplied = false
		tippyInstance?.destroy()
	}


	/*
		HYDRATE
	*/

	let hydrationIndex = 0
	let previousTypeClasses: string[] | null = null
	let previousVariables: string[] | null = null

	function hydrate(source: SourceDetails) {
		//console.log("Hydrating given", source)

		const thisHydrationIndex = ++hydrationIndex

		const removeClassTypes = previousTypeClasses
		const applyClassTypes = ["playing-source-type-" + formatForCSSClass(source.type)]
		if ("subType" in source) applyClassTypes.push("playing-source-subtype-" + formatForCSSClass(source.subType))
		previousTypeClasses = applyClassTypes

		const removeVariables = previousVariables
		let applyVariablesPromise: Promise<Record<string, string>>
		if ("colors" in source && source.colors) {
			applyVariablesPromise = source.colors.then((colors: Record<string, string>) => {
				const appliedVariables: Record<string, string> = { "--extracted-entity-color": colors.undefined }

				Object.keys(colors).forEach((key) => {
					if (key === undefined) return
					appliedVariables["--extracted-entity-color-" + formatForCSSClass(key)] = colors[key as keyof typeof colors]
				})

				previousVariables = Object.keys(appliedVariables)
				return appliedVariables
			})
		}
		else {
			previousVariables = null
			applyVariablesPromise = Promise.resolve({})
		}

		// Hydrate each interface
		playingSourceInterfaces.forEach((el) => {
			// Remove the currently applied source type class
			if (removeClassTypes) el.classList.remove(...removeClassTypes)
			// And add the new one
			el.classList.add(...applyClassTypes)

			// Set the name and image classes as appropiate
			el.classList["name" !== undefined ? "add" : "remove"]("playing-source-has-name")
			el.classList["image" !== undefined ? "add" : "remove"]("playing-source-has-image")

			// Set header
			const header = el.querySelector(".playing-source-header") as HTMLAnchorElement
			header.innerText = Translate("playing_" + source.type + (
				"subType" in source ? "_" + source.subType : ""
			))

			// Set name
			const nameEl = el.querySelector(".playing-source-source-name") as HTMLSpanElement

			nameEl.innerText = Translate("loading")
			nameEl.classList.add("playing-source-fetching")

			source.name.then((fullName) => {
				if (thisHydrationIndex !== hydrationIndex) return

				nameEl.classList.remove("playing-source-fetching")
				if (!fullName) {
					if (fullName === undefined) {
						el.classList.remove("playing-source-has-name")
					}
					else {
						nameEl.innerText = Translate("unknown")
					}
					return
				}
				nameEl.innerText = fullName
			})

			// Set image
			const imageEl = el.querySelector(".playing-source-source-image") as HTMLImageElement
	
			imageEl.removeAttribute("src")
			imageEl.classList.add("playing-source-fetching")
			imageEl.classList.remove("main-image-loaded")
	
			source.img.then((imageURL) => {
				if (thisHydrationIndex !== hydrationIndex) return
	
				imageEl.classList.remove("playing-source-fetching")
				if (!imageURL) {
					el.classList.remove("playing-source-has-image")
					return
				}
				imageEl.addEventListener("load", () => {
					if (thisHydrationIndex !== hydrationIndex) return
					imageEl.classList.add("main-image-loaded")
				}, { once: true })
				imageEl.src = imageURL
			})

			// Set extracted color
			removeVariables?.forEach((variable) => el.style.removeProperty(variable))

			el.classList.add("playing-source-fetching-color")
			el.classList.remove("playing-source-has-color")

			applyVariablesPromise.then((variables) => {
				if (thisHydrationIndex !== hydrationIndex) return

				el.classList.remove("playing-source-fetching-color")

				const colorVars = Object.keys(variables)
				if (colorVars.length) {
					el.classList.add("playing-source-has-color")

					colorVars.forEach((variable) => {
						el.style.setProperty(variable, variables[variable])
					})
				}
			})
		})
	}

	function hydrateLink(link: string | null) {
		playingSourceInterfaces.forEach((el) => {
			el.querySelectorAll("a").forEach((linkEl) =>
				link === null ? linkEl.removeAttribute("href") : linkEl.setAttribute("href", link)
			)
		})
	}

	/*
		WATCH FOR LINK
	*/
	// The link is very nicely given to us
	// as the href of "a" inside playingBarLeft
	// Watch it
	playingBarLeft.then((el) => {
		watchForElement("a", el, (found) => {
			hydrateLink((found as HTMLAnchorElement).getAttribute("href"))

			// Observe for changes in the href
			new MutationObserver((mutations) => {
				hydrateLink((found as HTMLAnchorElement).getAttribute("href"))
			}).observe(found, {
				attributes: true,
				attributeFilter: ["href"]
			})
		})
	})


	let lastContext: SourceInfo | null = null
	Spicetify.Player.addEventListener("onprogress", () => {
		const source = getCurrentContext()
		if (lastContext && source.type === lastContext.type && source.uri === lastContext.uri) return

		// New source
		lastContext = source
		hydrate(getSourceDetails(source))
	})
}
	
export default main
