import "./style.css"
import loc from "./loc.json"

export type LocalizationTable = typeof loc

const FALLBACK_LANG = "en"

const lerp = (a:number, b:number, progress:number) => a * (1 - progress) + b * progress

async function main() {
	while (!Spicetify?.Platform || !Spicetify?.URI || !Spicetify?.showNotification || !Spicetify?.Locale) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	// Javascript's selectstart event can not be used here
	// because it literally fires on mouse click
	// So we have to handle it ourselves

	// Get any current valid selection of the lyrics
	function getSelectedLyrics(): string | null {
		// The lyrics have been selected if the selection as a string is not empty
		// and the selection is contained within the lyrics container

		// The lyrics must be displayed
		const lyricsContainer = document.querySelector(".lyrics-lyrics-container") as HTMLElement
		if (!lyricsContainer) return null
		const selection = window.getSelection()
		if (!selection || selection.rangeCount < 1) return null
		const selectionText = selection.toString().trim()
		const selectionRange = selection.getRangeAt(0)
		// The selection text must be non-empty
		if (!selectionText) return null
		// The selection must be contained within the os-content container
		const osContent = document.querySelector(".os-content:has(.lyrics-lyrics-container)")
		if (!osContent || !osContent.contains(selectionRange.commonAncestorContainer)) return null

		return selectionText
	}

	// Handle when a selection begins
	let isSelecting = false
	let hasBegunSelectionSinceLastCopy = false

	const stopPropagation = (event: Event) => event.stopPropagation()

	document.addEventListener("selectionchange", () => {
		// Check if it's a valid selection
		if (!getSelectedLyrics()) {
			isSelecting = false
			
			// If it's connected, disconnect the click listener
			document.querySelector(".lyrics-lyrics-container")?.removeEventListener("click", stopPropagation, { capture: true })

			return
		}
		if (isSelecting) return

		// A selection has begun
		console.log("Selection begun")

		isSelecting = true
		hasBegunSelectionSinceLastCopy = true
		
		const lyricsContainer = document.querySelector(".lyrics-lyrics-container") as HTMLElement
		// Add the selecting class that changes the cursor
		lyricsContainer.classList.add("copy-lyrics-selecting")
		// Make the selection visible
		lyricsContainer.classList.remove("copy-lyrics-deselection-animation")
		// Prevent the lyrics from being clickable
		lyricsContainer.addEventListener("click", stopPropagation, { capture: true })
		// Later disconnect it when the selection ends

		// Stop any ongoing animations
		selectionAnimationIndex++
	})

	// We don't want to continue animating the deselection animation
	// if the user has begun a new selection
	let selectionAnimationIndex = 0

	// Attempt to copy the selected lyrics
	function tryCopyLyrics() {
		console.log("Attempting a copy...", hasBegunSelectionSinceLastCopy)

		// Don't allow copying if a selection hasn't started since the last copy
		if (!hasBegunSelectionSinceLastCopy) return
		console.log("PASSED 1")

		// Check if lyrics are currenty being displayed
		const lyricsContainer = document.querySelector(".lyrics-lyrics-container") as HTMLElement
		if (!lyricsContainer) return
		console.log("PASSED 2")

		// Get the selection and check if it's a selection of the lyrics
		const selectionText = getSelectedLyrics()
		if (!selectionText) return
		console.log("PASSED 3")

		// Copy the selection
		Spicetify.Platform.ClipboardAPI.copy(selectionText)
		hasBegunSelectionSinceLastCopy = false

		// Show a notification
		// This notification has an ID of "copy-lyrics-notification"
		// so we can detect if it's still being shown
		Spicetify.showNotification(loc[Spicetify.Locale._locale] || loc[FALLBACK_LANG])

		// Add the class copy-lyrics-deselection-animation to all selected nodes
		// This will trigger a CSS animation that will slowly fade out the selected lyrics
		lyricsContainer.classList.add("copy-lyrics-deselection-animation")
		// Remove the selecting class that changes the cursor
		document.querySelector(".lyrics-lyrics-container")?.classList.remove("copy-lyrics-selecting")

		// Handle animation
		// Go from rgba(255, 255, 0, 255) to rgba(255, 255, 255, 0)
		const startColor = [255, 255, 0, 1]
		const endColor = [255, 255, 255, 0]
		const start = performance.now()
		const duration = 500
		selectionAnimationIndex++
		const thisSelectionAnimationIndex = selectionAnimationIndex
		const update = () => {
			// Check if this animation is still the latest one
			if (thisSelectionAnimationIndex != selectionAnimationIndex) { console.log("Animation cancelled"); return}

			const progress = (performance.now() - start) / duration
			//console.log(progress)
			let color
			if (progress >= 1) {
				// Animation is done
				color = endColor
			} else {
				// Update the color
				color = startColor.map((c, i) => lerp(c, endColor[i], progress))
				requestAnimationFrame(update)
			}
			lyricsContainer.style.setProperty("--copy-lyrics-selection-color", `rgba(${color.join(", ")})`)
		}
		requestAnimationFrame(update)
	}

	// When the mouse lifts it is a possible selection
	window.addEventListener("mouseup", tryCopyLyrics)

	// Add CTRL+A shortcut
	document.addEventListener("keyup", (event) => {
		if (!(event.ctrlKey && event.code == "KeyA")) return
		//console.log("CTRLA!")

		// Check if lyrics are currenty being displayed
		const lyricsContainer = document.querySelector(".lyrics-lyrics-contentContainer")
		if (!lyricsContainer) return

		// Select all lyrics
		const selection = window.getSelection()
		if (!selection) return

		event.preventDefault()
		selection.empty()
		selection.selectAllChildren(lyricsContainer)

		// We are guaranteed to be wanting to re-copy now
		// so we can clear the last copied selection
		isSelecting = true
		hasBegunSelectionSinceLastCopy = true

		tryCopyLyrics()
	})
}
	
export default main
