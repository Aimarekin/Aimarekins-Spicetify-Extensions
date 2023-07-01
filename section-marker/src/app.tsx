// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm, watchForElement } from "./DOM_watcher"
import "./style.scss"

const PROGRESS_BAR_SELECTOR = ".playback-progressbar > .progress-bar"

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync || !Spicetify?.React) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)
	
	function createPlaybarOverlay() {
		const overlay = (<div className="section-marker-container section-marker-no-data">
			<div className="section-marker-sections" />
			<div className="section-marker-markers" />
		</div>) as unknown as HTMLDivElement

		// Remove elements if transition ends and there's no data
		/* overlay.addEventListener("transitionend", () => {
			if (overlay.classList.contains("section-marker-no-data")) {
				overlay.querySelectorAll(".section-marker-marker, .section-marker-section").forEach(
					(elm) => elm.replaceChildren()
				)
			}
		}) */

		return overlay
	}

	function createMarker() {
		const marker = (<div className="section-marker-marker" />) as unknown as HTMLDivElement

		return marker
	}

	function createSection() {
		const section = (<div className="section-marker-section" />) as unknown as HTMLDivElement

		return section
	}

	const sectionValues = {
		start: (analysis: AudioAnalysis.Analysis, i: number) =>
			analysis.sections[i].start,
		duration: (analysis: AudioAnalysis.Analysis, i: number) =>
			analysis.sections[i].duration,
		index:
			(_: AudioAnalysis.Analysis, i: number) => i,
	}

	function hydrateSectionContainer(uriRAW: any) {
		playbarOverlay.classList[
			playbarOverlay.classList.contains("section-marker-no-data") ? "add": "remove"
		]("section-marker-had-no-data")

		const uri = Spicetify.URI.from(uriRAW)
		if (!uri || uri.type !== "track") {
			playbarOverlay.classList.add("section-marker-no-data")
			return
		}
		playbarOverlay.classList.add("section-marker-loading-data")

		Spicetify.getAudioData(uriRAW).then((audioData) => {
			const markerContainer = playbarOverlay.querySelector(".section-marker-markers") as HTMLDivElement
			const sectionContainer = playbarOverlay.querySelector(".section-marker-sections") as HTMLDivElement

			const markerElms = Array.from(markerContainer.querySelectorAll(".section-marker-marker") as NodeListOf<HTMLDivElement>)
			const sectionElms = Array.from(sectionContainer.querySelectorAll(".section-marker-section") as NodeListOf<HTMLDivElement>)

			for (let i = markerElms.length; i < audioData.sections.length; i++) {
				// Create not yet existing elements
				const marker = createMarker() as HTMLDivElement
				const section = createSection() as HTMLDivElement

				[marker, section].forEach((elm) => elm.classList.add(`section-marker-not-exists`))

				markerContainer.appendChild(marker)
				sectionContainer.appendChild(section)

				markerElms.push(marker)
				sectionElms.push(section)
			}

			// Let the new elements create so they are rendered,
			// set properties afterwards for them to transition
			requestAnimationFrame(() => {
				const trackDuration = audioData.track.duration.toString()

				playbarOverlay.style.setProperty("--section-marker-data-track-duration", trackDuration)
				playbarOverlay.dataset.sectionMarkerDataTrackDuration = trackDuration

				playbarOverlay.classList.remove("section-marker-loading-data")
				if (playbarOverlay.classList.contains("section-marker-no-data")) {
					playbarOverlay.classList.remove("section-marker-no-data")
					playbarOverlay.classList.add("section-marker-had-no-data")
				}

				for (let i = 0; i < audioData.sections.length; i++) {
					const marker = markerElms[i] as HTMLDivElement
					const section = sectionElms[i] as HTMLDivElement

					[marker, section].forEach((elm) => {
						elm.classList.remove(`section-marker-not-exists`)

						for (const [key, value] of Object.entries(sectionValues)) {
							const val = value(audioData, i).toString()

							elm.dataset["sectionMarkerData" + capitalize(key)] = val
							elm.style.setProperty("--section-marker-data-" + key, val)
						}
					})
				}

				// Remove no longer necessary elements
				for (let i = audioData.sections.length; i < markerElms.length; i++) {
					const marker = markerElms[i] as HTMLDivElement
					const section = sectionElms[i] as HTMLDivElement

					[marker, section].forEach((elm) => elm.classList.add("section-marker-not-exists"))
				}
			})
		}).catch((err) => {
			console.warn("SECTION-MARKER: Failed to get audio data:", err, "for", uriRAW, uri)
			playbarOverlay.classList.remove("section-marker-loading-data", "section-marker-had-no-data")
			playbarOverlay.classList.add("section-marker-no-data")
		})
	}


	// Add the playbar overlay
	const playbarOverlay = createPlaybarOverlay()
	watchForElement(PROGRESS_BAR_SELECTOR, await waitForElm(".main-nowPlayingBar-center"), (playbar) => {
		(playbar as HTMLElement).appendChild(playbarOverlay)
	})

	// Watch for song changes to add the section markers
	let shownSong : string | null = null
	let preloadedSong : string | null = null
	Spicetify.Player.addEventListener("onprogress", () => {
		const data = Spicetify.Player.origin.getState()
		const uri = data.hasContext
			? Spicetify.Player.data?.track?.uri || null
			: null

		// Preload the next song's data if less than 10 seconds (in ms 10000) left
		if (data.hasContext) {
			if (Spicetify.Player.getDuration() - Spicetify.Player.getProgress() < 10000) {
				const nextSong = Spicetify.Queue.nextTracks[0]?.contextTrack?.uri
				if (nextSong && nextSong !== preloadedSong) {
					preloadedSong = nextSong
					Spicetify.getAudioData(nextSong)
				}
			}
		}

		if (uri == shownSong) return
		shownSong = uri

		hydrateSectionContainer(uri)
	})
}
	
export default main
