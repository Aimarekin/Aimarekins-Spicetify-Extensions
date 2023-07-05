// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { waitForElm } from "./DOM_watcher"

// Under this playbar width, the markers will not be shown
const MINIMUM_MARKERS_WIDTH = 300 // px

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

// Create the playbar injected elements
const sectionContainer = (<div className="section-marker-element section-marker-sections" />) as unknown as HTMLDivElement
const markerContainer = (<div className="section-marker-element section-marker-markers" />) as unknown as HTMLDivElement

let playbar: HTMLElement

let alreadyInjected = false
export async function injectInterface() {
    if (alreadyInjected) throw new Error("Interface has already been injected!")
    alreadyInjected = true

    // Append the containers
    playbar = await waitForElm(".playback-bar .progress-bar")
    const playbarSliderArea = playbar.querySelector(".x-progressBar-sliderArea")!

    // Initial setup
	playbar.classList.add("section-marker-no-data")

	playbarSliderArea.appendChild(sectionContainer)
	playbarSliderArea.appendChild(markerContainer)

    // Set the height variable
    function setDimensions() {
        playbar.style.setProperty("--section-marker-playbar-height", playbar.clientHeight + "px")
        playbar.style.setProperty("--section-marker-playbar-width", playbar.clientWidth + "px")

        playbar.classList[playbar.clientWidth < MINIMUM_MARKERS_WIDTH ? "add" : "remove"]("section-marker-playbar-below-marker-width")
    }
    setDimensions()

    // Watch for changes to the playbar's dimensions
    // (it'd be weird for something to change the height but compatibility ig yay!!! :D :3 :P)
    new ResizeObserver(setDimensions).observe(playbar)
}

export function hydrateEmpty() {
    playbar.classList.remove("section-marker-loading-data", "section-marker-had-no-data")
    playbar.classList.add("section-marker-no-data")
}

export function hydrateLoading() {
    playbar.classList[
        playbar.classList.contains("section-marker-no-data") ? "add": "remove"
    ]("section-marker-had-no-data")
    playbar.classList.add("section-marker-loading-data")
}

const sectionValues = {
    start: (analysis: AudioAnalysis.Analysis, i: number) =>
        analysis.sections[i].start,
    duration: (analysis: AudioAnalysis.Analysis, i: number) =>
        analysis.sections[i].duration,
    index:
        (_: AudioAnalysis.Analysis, i: number) => i,
}

export function hydrateAnalysis(audioData: AudioAnalysis.Analysis) {
    const markerContainer = playbar.querySelector(".section-marker-markers") as HTMLDivElement
    const sectionContainer = playbar.querySelector(".section-marker-sections") as HTMLDivElement

    const markerElms = Array.from(markerContainer.querySelectorAll(".section-marker-marker") as NodeListOf<HTMLDivElement>)
    const sectionElms = Array.from(sectionContainer.querySelectorAll(".section-marker-section") as NodeListOf<HTMLDivElement>)

    for (let i = markerElms.length; i < audioData.sections.length; i++) {
        // Create not yet existing elements
        const marker = (<div className="section-marker-marker" />) as unknown as HTMLDivElement
        const section = (<div className="section-marker-section" />) as unknown as HTMLDivElement

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

        // "Remove" no longer necessary elements
        for (let i = audioData.sections.length; i < markerElms.length; i++) {
            const marker = markerElms[i] as HTMLDivElement
            const section = sectionElms[i] as HTMLDivElement

            [marker, section].forEach((elm) => elm.classList.add("section-marker-not-exists"))
        }
    })
}