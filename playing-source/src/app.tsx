// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm, getUriName } from "./util"
import { Translate } from "./localizer"
import { SourceType, getContext } from "./context_handling"
import { } from "./format_unicorn"


async function main() {
	while (!Spicetify?.Player || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	
	// Inject CSS
	const style = document.createElement("style")
	style.innerHTML = `
	.playing-source-ao-container {
		transition: filter 0.1s ease-in-out;
		pointer-events: none;
		position: absolute;
		display: block;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		--playing-source-ao-bkg-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;
		filter: opacity(0);
	}

	.main-downloadClient-container:hover .playing-source-ao-container {
		filter: opacity(1);
	}

	.playing-source-ao-before {
		width: 100%;
		height: 50px;
		background: linear-gradient(transparent, var(--playing-source-ao-bkg-color));
	}

	.playing-source-ao {
		width: 100%;
		height: min-content;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-end;
		align-items: center;
		background: var(--playing-source-ao-bkg-color);
		padding: 10px;
		padding-top: 0;
		gap: 5px;
		text-shadow: 0 0 4px black;
	}

	.playing-source-ao-header {
		font-weight: 100;
		font-size: 0.8em;
		text-transform: uppercase;
	}

	.playing-source-ao-source {
		pointer-events: auto;
		font-weight: bold;
		text-overflow: ellipsis;
		overflow-x: hidden;
		white-space: nowrap;
		max-width: 100%;
	}

	.playing-source-ao-source:hover {
		text-decoration: none;
	}

	.playing-source-ao-source[href]:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.playing-source-tt {
		text-align: center
	}

	.playing-source-tt-header {
		font-style: italic;
	}

	.playing-source-tt-source {
		font-weight: bold;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 200px;
	}

	.playing-source-hidden {
		display: none !important;
	}
	`
	document.head.appendChild(style)
	
	// Create album overlay
	const albumOverlay = (
		<div className="playing-source-ao-container">
			<div className="playing-source-ao-before"></div>
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
	// Wait until root element "main-downloadClient-container" is available
	// That one won't go away
	// Then watch for creation of element with class "main-coverSlotExpanded-container"

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

	function updateSource() {
		const source = getContext()
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

	updateSource()

	Spicetify.Player.addEventListener("songchange", updateSource)
}
	
export default main
