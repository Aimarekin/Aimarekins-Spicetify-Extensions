import { hydrateLoading, hydrateEmpty, hydrateAnalysis } from "./interface"

const PRELOAD_DEBOUNCE = 15000 // ms

export function canThisBeAnalyzed(uriRAW: any) {
    const uri = Spicetify.URI.from(uriRAW)
    return uri && uri.type === Spicetify.URI.Type.TRACK
}

let analysisIndex = 0
let shownURI: string | null = null
export function showAnalysisForUri(uriRAW: any) {
    if (uriRAW === shownURI) return
    shownURI = uriRAW

    const thisAnalysisIndex = ++analysisIndex
    if (!canThisBeAnalyzed(uriRAW)) {
        hydrateEmpty()
        return
    }

    hydrateLoading()

    Spicetify.getAudioData(uriRAW).then((audioData) => {
        if (thisAnalysisIndex !== analysisIndex) return

        hydrateAnalysis(audioData)
    }).catch((err) => {
        console.warn("SECTION-MARKER: Failed to get audio data for", uriRAW, err)
        if (thisAnalysisIndex !== analysisIndex) return

        hydrateEmpty()
    })
}

let lastPreloadURI: string | null = null
let lastPreloadTime = 0
export function preloadAnalysis(uriRAW: any) {
    if (lastPreloadURI == uriRAW || Date.now() - lastPreloadTime < PRELOAD_DEBOUNCE || !canThisBeAnalyzed(uriRAW)) return

    lastPreloadURI = uriRAW
    lastPreloadTime = Date.now()

    Spicetify.getAudioData(uriRAW)
}