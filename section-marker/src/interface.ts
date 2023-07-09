import { waitForElm, watchForElement } from "./DOM_watcher"

// Under this playbar width, the markers will not be shown
const MINIMUM_MARKERS_WIDTH = 300 // px

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

// Create the playbar injected elements
const sectionContainer = document.createElement("div")
sectionContainer.classList.add("section-marker-element", "section-marker-sections")

const markerContainer = document.createElement("div")
markerContainer.classList.add("section-marker-element", "section-marker-markers")

let hasInjected = false
export async function injectInterface() {
    if (hasInjected) throw new Error("Interface already injected")
    hasInjected = true

    // Set the size variables
    function setDimensions(w: number, h: number) {
        document.body.style.setProperty("--section-marker-playbar-width", w + "px")
        document.body.style.setProperty("--section-marker-playbar-height", h + "px")

        document.body.classList[w < MINIMUM_MARKERS_WIDTH ? "add" : "remove"]("section-marker-playbar-below-marker-width")
    }

    // Create the resizeobserver
    let playbar: HTMLDivElement
    const playbarResizeObserver = new ResizeObserver(() => {
        setDimensions(playbar.clientWidth, playbar.clientHeight)
    })

    // Initial setup
    document.body.classList.add("section-marker-no-data")

    // Append the containers
    let lastPlaybar: HTMLDivElement | null = null
    watchForElement(".playback-bar .playback-progressbar", await waitForElm("#main > .Root"), (el) => {
        if (lastPlaybar === el) return
        playbar = el as HTMLDivElement

        lastPlaybar?.classList.remove("section-marker-injected-playbar")
        playbar.classList.add("section-marker-injected-playbar")

        const playbarSliderArea = (playbar as HTMLDivElement).querySelector(".x-progressBar-sliderArea")!

        playbarSliderArea.appendChild(sectionContainer)
        playbarSliderArea.appendChild(markerContainer)

        setDimensions(playbar.clientWidth, playbar.clientHeight)

        playbarResizeObserver.disconnect()
        playbarResizeObserver.observe(playbar)
    })
}

export function hydrateEmpty() {
    document.body.classList.remove("section-marker-loading-data", "section-marker-had-no-data", "section-marker-less-than-two-sections")
    document.body.classList.add("section-marker-no-data")
}

export function hydrateLoading() {
    document.body.classList[
        document.body.classList.contains("section-marker-no-data") ? "add": "remove"
    ]("section-marker-had-no-data")
    document.body.classList.add("section-marker-loading-data")
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
    const markerContainer = document.body.querySelector(".section-marker-markers") as HTMLDivElement
    const sectionContainer = document.body.querySelector(".section-marker-sections") as HTMLDivElement

    const markerElms = Array.from(markerContainer.querySelectorAll(".section-marker-marker") as NodeListOf<HTMLDivElement>)
    const sectionElms = Array.from(sectionContainer.querySelectorAll(".section-marker-section") as NodeListOf<HTMLDivElement>)

    document.body.classList[audioData.sections.length < 2 ? "add" : "remove"]("section-marker-less-than-two-sections")

    for (let i = markerElms.length; i < audioData.sections.length; i++) {
        // Create not yet existing elements
        const marker = document.createElement("div") 
        marker.classList.add("section-marker-marker")

        const section = document.createElement("div")
        section.classList.add("section-marker-section");

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

        document.body.style.setProperty("--section-marker-data-track-duration", trackDuration)
        document.body.dataset.sectionMarkerDataTrackDuration = trackDuration

        document.body.classList.remove("section-marker-loading-data")
        if (document.body.classList.contains("section-marker-no-data")) {
            document.body.classList.remove("section-marker-no-data")
            document.body.classList.add("section-marker-had-no-data")
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