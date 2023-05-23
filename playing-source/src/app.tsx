// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm, generateBindsFor, getUriName } from "./util"
import { Translate } from "./localizer"
import { SourceType, SourceInfo, getContext } from "./context_handling"
import "./format_unicorn"
import "./style.scss"

type Promisable<T> = T | Promise<T>

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	
	// Create album overlay
	const createAlbumOverlay = () => (
		<div className="playing-source-ao-container">
			<div className="playing-source-ao">
				<a className="playing-source-ao-header">
					PLAYING FROM
				</a>
				<a className="playing-source-ao-source">
					...
				</a>
			</div>
		</div>
	) as unknown as HTMLDivElement
	
	// For expanded:
	// OLD GUI:
	// Root class is "main-downloadClient-container"
	// Watch for creation of element with class "main-coverSlotExpanded-container"
	// NEW SIDEBAR:
	// Root class is "UalNRoO1omHtEEniypS5"
	// Then watch for creation of element with class "cover-art"

	// For collapsed:
	// Root class is "main-nowPlayingBar-left"
	// Then watch for creation of element with class "main-coverSlotCollapsed-container"

	// For right sidebar:
	// This feature is still in development, and may change/get more specific in the future
	// Root class is "Root__top-container"
	// Display on top of "main-nowPlayingView-coverArt"
	
	/* BINDING TO EXPANDED COVERS */

	const albumOverlays = generateBindsFor(
		createAlbumOverlay,
		[
			[ ".main-downloadClient-container", ".main-coverSlotExpanded-container" ],
			[ ".UalNRoO1omHtEEniypS5", ".cover-art" ],
			//[ ".Root__top-container", ".main-nowPlayingView-coverArt" ], //Doesn't work just yet
		]
	)

	/* BINDING TO COLLAPSED COVER */

	const TippyProps = {
		...Spicetify.TippyProps,
		delay : 0,
		trigger: "mouseenter focus",
		interactive: true,
		allowHTML: true,
		offset: [0, 30],
	}

	let tippyInstance: unknown = null
	const tippyContents = (
		<div className="playing-source-tt">
			<a className="playing-source-tt-header">
				Playing from
			</a>
			<div className="playing-source-tt-source-container">
				<a className="playing-source-tt-source">
					...
				</a>
			</div>
		</div>
	) as unknown as HTMLDivElement
	const tippyHeader = tippyContents.querySelector(".playing-source-tt-header") as HTMLSpanElement
	const tippySourceContainer = tippyContents.querySelector(".playing-source-tt-source-container") as HTMLDivElement
	const tippySource = tippySourceContainer.querySelector(".playing-source-tt-source") as HTMLAnchorElement

	waitForElm(".main-nowPlayingBar-left").then((collapsedParent) => {
		let currentCollapsedParent : Element | null = null
		function appendCollapsedOverlay() {
			const el = collapsedParent.querySelector(".main-coverSlotCollapsed-container")
			if (el && el !== currentCollapsedParent) {
				currentCollapsedParent = el
				tippyInstance?.destroy()
				tippyInstance = Spicetify.Tippy(el, TippyProps)
				tippyInstance.popper.querySelector(".main-contextMenu-tippy").appendChild(tippyContents)
			}
		}
		appendCollapsedOverlay()

		new MutationObserver(appendCollapsedOverlay).observe(collapsedParent, {
			childList: true,
			subtree: true
		})
	})

	/*
		UPDATE SOURCE
	*/

	const sourcesWithoutName = new Set([
		SourceType.TRACK,
		SourceType.RECENT_SEARCHED,
		SourceType.AD,
		SourceType.USER_TOP_TRACKS,
		SourceType.LIKED_SONGS,
		SourceType.QUEUE,
		SourceType.LOCAL_FILES,
		SourceType.UNKNOWN,
	])

	const presetSourceLinks = {
		[SourceType.AD]: null,
		[SourceType.QUEUE]: null,
	}
	const getContextLink = (context: SourceInfo = getContext()) => (
		context.type in presetSourceLinks ? presetSourceLinks[context.type] : Spicetify.Player.data?.context_uri
	)

	function setShownText(headerText: string, sourceText: string | null) {
		tippyHeader.innerText = headerText
		tippySource.innerText = sourceText || ""

		albumOverlays.forEach((el:HTMLElement) => {
			const overlayHeader = el.querySelector(".playing-source-ao-header") as HTMLAnchorElement
			const overlaySource = el.querySelector(".playing-source-ao-source") as HTMLAnchorElement

			overlayHeader.innerText = headerText
			overlaySource.innerText = sourceText || ""

			overlaySource.classList[headerText === null ? "add" : "remove"]("playing-source-hidden")
			overlaySource.removeAttribute("href")
			overlayHeader.removeAttribute("href")
			const link = getContextLink()
			if (link) {
				(sourceText === null ? overlayHeader : overlaySource).setAttribute("href", link)
			}
		})
	}

	let sourceUpdateIndex = 0
	let lastSource: SourceInfo | null = null
	function updateSource() {
		const source = getContext()
		// Don't update if it's the same source
		if (lastSource !== null && lastSource.type === source.type && lastSource?.uri === source?.uri) return
		lastSource = source

		let headerText: string
		let sourceText: Promisable<string | null> = null
		sourceUpdateIndex++

		switch (source.type) {
			case SourceType.TRACK:
				headerText = Translate("playing_TRACK")
				break
			case SourceType.RECOMMENDED:
				if (source?.uri) {
					headerText = Translate("playing_RECOMMENDED")
					sourceText = getUriName(source.uri)
				}
				else {
					headerText = Translate("playing_RECOMMENDED_generic")
				}
				break
			default:
				headerText = Translate("playing_" + source.type)
				sourceText = getUriName(source.uri)
				break
		}

		if (sourcesWithoutName.has(source.type)) {
			sourceText = null
		}
		else if (sourceText === null) {
			sourceText = Translate("unknown")
		}

		setShownText(headerText, sourceText instanceof Promise ? Translate("loading") : sourceText)

		if (sourceText instanceof Promise) {
			const index = sourceUpdateIndex
			sourceText.then((resolved) => {
				// Don't update if the source has changed
				if (index !== sourceUpdateIndex) return

				setShownText(headerText, resolved)
			})
		}
	}

	Spicetify.Player.addEventListener("onprogress", updateSource)
}
	
export default main
