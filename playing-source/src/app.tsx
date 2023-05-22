// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm, getUriName } from "./util"
import { Translate } from "./localizer"
import { SourceType, SourceInfo, getContext } from "./context_handling"
import "./format_unicorn"
import "./style.css"


async function main() {
	while (!Spicetify?.Player || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	
	// Create album overlay
	const albumOverlay = (
		<div className="playing-source-ao-container">
			<div className="playing-source-ao">
				<span className="playing-source-ao-header">
					PLAYING FROM
				</span>
				<a className="playing-source-ao-source">
					...
				</a>
			</div>
		</div>
	) as unknown as HTMLDivElement

	const albumOverlayHeader = albumOverlay.querySelector(".playing-source-ao-header") as HTMLSpanElement
	const albumOverlaySource = albumOverlay.querySelector(".playing-source-ao-source") as HTMLAnchorElement
	
	// For expanded:
	// Wait for root class
	// OLD GUI:
	// Watch for creation of element with class "main-coverSlotExpanded-container"
	// NEW SIDEBAR:
	// Then watch for creation of element with class "LROBF2WtGaVryVpVbSOu"

	// For collapsed:
	// Wait until root element "main-nowPlayingBar-left" is available
	// That one won't go away
	// Then watch for creation of element with class "main-coverSlotCollapsed-container"

	/* BINDING TO EXPANDED COVER */
	
	waitForElm(".main-downloadClient-container").then((expandedParent) => {
		let currentParent : Element | null = null
		function appendExpandedOverlay() {
			const el = expandedParent.querySelector(".main-coverSlotExpanded-container")
			if (el && el !== currentParent) {
				currentParent = el
				el.appendChild(albumOverlay)
			}
		}
		appendExpandedOverlay()

		new MutationObserver(appendExpandedOverlay).observe(expandedParent, {
			childList: true,
			subtree: true
		})
	})

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
			<span className="playing-source-tt-header">
				Playing from
			</span>
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
	let sourceUpdateIndex = 0

	const SourcesWithoutName = new Set([
		SourceType.TRACK,
		SourceType.RECENT_SEARCHED,
		SourceType.AD,
		SourceType.USER_TOP_TRACKS,
		SourceType.LIKED_SONGS,
		SourceType.QUEUE,
		SourceType.LOCAL_FILES,
		SourceType.UNKNOWN,
	])

	function setSourceText(headerText: string, sourceText: string | null, updateIndex = -1) {
		if (updateIndex !== -1 && updateIndex < sourceUpdateIndex) return
		if (sourceText === null) sourceText = Translate("unknown")

		albumOverlayHeader.innerText = headerText
		tippyHeader.innerText = headerText

		albumOverlaySource.innerText = sourceText
		tippySource.innerText = sourceText
	}

	let lastSource: SourceInfo | null = null
	function updateSource() {
		const source = getContext()
		// Don't update if it's the same source
		if (lastSource !== null && lastSource.type === source.type && lastSource?.uri === source?.uri) return
		lastSource = source
		sourceUpdateIndex++

		if (source?.uri) {
			albumOverlaySource.href = source.uri
			tippySource.href = source.uri
		}
		else {
			albumOverlaySource.removeAttribute("href")
			tippySource.removeAttribute("href")
		}

		let headerText: string
		let sourceText: Promise<string | null> | null = null

		if (SourcesWithoutName.has(source.type)) {
			albumOverlaySource.classList.add("playing-source-hidden")
			tippySourceContainer.classList.add("playing-source-hidden")
		}
		else {
			albumOverlaySource.classList.remove("playing-source-hidden")
			tippySourceContainer.classList.remove("playing-source-hidden")
			sourceText = getUriName(source.uri)
		}

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
				break
		}

		if (sourceText !== null) {
			setSourceText(headerText, Translate("loading"))
			sourceText.then(name => setSourceText(headerText, name, sourceUpdateIndex))
		}
		else {
			setSourceText(headerText, sourceText)
		}
		
	}

	Spicetify.Player.addEventListener("onprogress", updateSource)
}
	
export default main
