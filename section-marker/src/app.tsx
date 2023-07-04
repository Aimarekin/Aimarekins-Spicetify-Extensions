// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm } from "./DOM_watcher"
import "./style.scss"

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync || !Spicetify?.React) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

	const sectionContainer = (<div className="section-marker-element section-marker-sections" />) as unknown as HTMLDivElement
	const markerContainer = (<div className="section-marker-element section-marker-markers" />) as unknown as HTMLDivElement

	// Append the containers
	const playbar = await waitForElm(".playback-bar > .playback-progressbar > .progress-bar")
	const playbarSliderArea = playbar.querySelector(".x-progressBar-sliderArea")!

	// Initial setup
	playbar.classList.add("section-marker-no-data")

	playbarSliderArea.appendChild(sectionContainer)
	playbarSliderArea.appendChild(markerContainer)

	const createMarker = () => (<div className="section-marker-marker" />) as unknown as HTMLDivElement
	const createSection = () => (<div className="section-marker-section" />) as unknown as HTMLDivElement

	const sectionValues = {
		start: (analysis: AudioAnalysis.Analysis, i: number) =>
			analysis.sections[i].start,
		duration: (analysis: AudioAnalysis.Analysis, i: number) =>
			analysis.sections[i].duration,
		index:
			(_: AudioAnalysis.Analysis, i: number) => i,
	}

	function hydrateSectionContainer(uriRAW: any) {
		playbar.classList[
			playbar.classList.contains("section-marker-no-data") ? "add": "remove"
		]("section-marker-had-no-data")

		const uri = Spicetify.URI.from(uriRAW)
		if (!uri || uri.type !== "track") {
			playbar.classList.add("section-marker-no-data")
			return
		}
		playbar.classList.add("section-marker-loading-data")

		Spicetify.getAudioData(uriRAW).then((audioData) => {
			const markerContainer = playbar.querySelector(".section-marker-markers") as HTMLDivElement
			const sectionContainer = playbar.querySelector(".section-marker-sections") as HTMLDivElement

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

				playbar.style.setProperty("--section-marker-data-track-duration", trackDuration)
				playbar.dataset.sectionMarkerDataTrackDuration = trackDuration

				playbar.classList.remove("section-marker-loading-data")
				if (playbar.classList.contains("section-marker-no-data")) {
					playbar.classList.remove("section-marker-no-data")
					playbar.classList.add("section-marker-had-no-data")
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
			playbar.classList.remove("section-marker-loading-data", "section-marker-had-no-data")
			playbar.classList.add("section-marker-no-data")
		})
	}

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
