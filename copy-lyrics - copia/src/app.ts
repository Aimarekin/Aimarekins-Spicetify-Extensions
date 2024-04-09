import "./style.css"
import loc from "./loc.json"
import { watchForElement } from "./DOM_watcher"

export type LocalizationTable = typeof loc

const FALLBACK_LANG = "en"

const lerp = (a:number, b:number, progress:number) => a * (1 - progress) + b * progress

const LYRICS_CONTAINER_SELECTOR = ".lyrics-lyrics-container, .main-nowPlayingView-lyricsContent"

async function main() {
	while (!Spicetify?.Platform || !Spicetify?.URI || !Spicetify?.showNotification || !Spicetify?.Locale) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	// Inject CSS rule we have to modify through JS
	const InjectedCSSElement = document.createElement("style")
	InjectedCSSElement.innerHTML = ".lyrics-lyricsContent-lyric::highlight(copy-lyrics-deselection-highlight){background-color:#000}"
	document.head.appendChild(InjectedCSSElement)
	const InjectedHighlightRule = (InjectedCSSElement.sheet as CSSStyleSheet).cssRules[0]

	// Javascript's selectstart event can not be used here
	// because it literally fires on mouse click
	// So we have to handle it ourselves

	// Get any current valid selection of the lyrics
	function getSelectedLyrics(): string | null {
		// The lyrics have been selected if the selection as a string is not empty
		// and the selection is contained within a lyrics container

		// The lyrics must be displayed
		const lyricsContainer = document.querySelector(LYRICS_CONTAINER_SELECTOR)
		if (!lyricsContainer) return null

		// Selection must exist
		const selection = window.getSelection()
		if (!selection || selection.rangeCount < 1) return null

		// The selection text must be non-empty
		const selectionText = selection.toString().trim()
		if (!selectionText) return null

		// The selection must be contained within the os-content container, or the playing view
		const osContent = document.querySelector(".os-content:has(.lyrics-lyrics-container), .main-nowPlayingView-lyricsContent")
		if (!osContent || !osContent.contains(selection.getRangeAt(0).commonAncestorContainer)) return null

		return selectionText
	}

	// Handle when a selection begins
	let isSelecting = false
	let hasBegunSelectionSinceLastCopy = false

	const stopPropagation = (event: Event) => event.stopPropagation()

	document.addEventListener("selectionchange", () => {
		// Check if it's a valid selection
		// and perform corresponding modifications to styling

		// Valid selection
		if (getSelectedLyrics()) {
			// Do nothing if already selecting
			if (isSelecting) return

			isSelecting = true
			hasBegunSelectionSinceLastCopy = true
		}
		// No selection
		else {
			// Do nothing if not selecting
			if (!isSelecting) return

			isSelecting = false
		}

		// If not returned, this means there was a selection change
		// and we must perform modifications to styling
		document.querySelectorAll(LYRICS_CONTAINER_SELECTOR).forEach(lyricsContainer => {
			if (isSelecting) {
				// Add the selecting class that changes the cursor
				lyricsContainer.classList.add("copy-lyrics-selecting")
				// Remove and stop any existing deselection animation
				CSS.highlights.delete("copy-lyrics-deselection-highlight")
				selectionAnimationIndex++
				// Prevent the lyrics from being clickable
				lyricsContainer.addEventListener("click", stopPropagation, { capture: true })
				// Later disconnect it when the selection ends
			}
			else {
				// If it's connected, disconnect the click listener
				lyricsContainer.removeEventListener("click", stopPropagation, { capture: true })
				// Remove the text cursor class
				lyricsContainer.classList.remove("copy-lyrics-selecting")
			}
		})
	})

	// We don't want to continue animating the deselection animation
	// if the user has begun a new selection
	let selectionAnimationIndex = 0

	// Attempt to copy the selected lyrics
	function tryCopyLyrics() {
		// Don't allow copying if a selection hasn't started since the last copy
		if (!hasBegunSelectionSinceLastCopy) return

		// Get the selection and check if it's valid
		const selectionText = getSelectedLyrics()
		if (!selectionText) return

		// Copy the selection
		Spicetify.Platform.ClipboardAPI.copy(selectionText)
		hasBegunSelectionSinceLastCopy = false

		// Show a notification
		// This notification has an ID of "copy-lyrics-notification"
		// so we can detect if it's still being shown
		Spicetify.showNotification(loc[Spicetify.Locale.getLocale()] || loc[FALLBACK_LANG])

		// Handle animation
		// Highlight the copied text
		// https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API
		// Pretty experimental technology

		const selection = window.getSelection() as Selection

		// Delete existing highlight
		//CSS.highlights.delete("copy-lyrics-deselection-highlight")
		const highlight = new Highlight(selection.getRangeAt(0))
		CSS.highlights.set("copy-lyrics-deselection-highlight", highlight)

		// Remove selection
		selection.empty()

		// Handle animation for the highlight
		// Go from rgba(255, 255, 0, 0.7) to rgba(255, 255, 255, 0)
		// Because of what's probably a bug
		// the ::highlight pseudo-element doesn't inherit variables
		// so we have to animate the rule directly
		const startColor = [255, 255, 0, 0.7]
		const endColor = [255, 255, 255, 0]
		const start = performance.now()
		const duration = 500
		selectionAnimationIndex++
		const thisSelectionAnimationIndex = selectionAnimationIndex
		const update = () => {
			// Check if this animation is still the latest one
			if (thisSelectionAnimationIndex != selectionAnimationIndex) return

			const progress = (performance.now() - start) / duration
			let color
			if (progress >= 1) {
				// Animation is done
				color = endColor
			} else {
				// Update the color
				color = startColor.map((c, i) => lerp(c, endColor[i], progress))
				requestAnimationFrame(update)
			}
			InjectedHighlightRule.style.backgroundColor = `rgba(${color.join(", ")})`
		}
		requestAnimationFrame(update)
	}

	// When the mouse lifts it is a possible selection
	window.addEventListener("mouseup", tryCopyLyrics)

	function copyAllLyrics() {
		// Select all lyrics
		const selection = window.getSelection()
		if (!selection) return

		// Get lyrics container
		const lyricsContainer = document.querySelector(LYRICS_CONTAINER_SELECTOR)
		if (!lyricsContainer) return

		// Select it
		selection.empty()
		selection.selectAllChildren(lyricsContainer)

		// We are guaranteed to be wanting to re-copy now
		// so we can clear the last copied selection
		isSelecting = true
		hasBegunSelectionSinceLastCopy = true

		tryCopyLyrics()
	}

	// Add CTRL+A shortcut
	// (only for full-screen lyrics)
	document.addEventListener("keyup", (event) => {
		if (!(event.ctrlKey && event.code == "KeyA")) return

		// Check if full-screen lyrics are currenty being displayed
		const lyricsContainer = document.querySelector(".lyrics-lyrics-contentContainer")
		if (!lyricsContainer) return

		event.preventDefault()

		copyAllLyrics()
	})

	// Add right-click on lyrics to copy all
	watchForElement(".lyrics-lyricsContent-lyric", undefined, (lyric) => lyric.addEventListener("contextmenu", (e) => {
		e.preventDefault()
		copyAllLyrics()
	}))
}
	
export default main
