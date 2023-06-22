const AUDIO_FADE_IN = 0.2 // seconds
const AUDIO_FADE_OUT = 1 // seconds

function createAudioElement(url: string): HTMLAudioElement {
    const audio = document.createElement('audio')
    audio.src = url
    audio.preload = 'auto'
    return audio
}

const playingAudioElements: HTMLAudioElement[] = []

function animateVolumes() {
    for (const audio of playingAudioElements) {
        const desiredVolume: number

        // Fade out
        if (audio.currentTime > audio.duration - AUDIO_FADE_OUT / 1000) {
            audio.volume = Math.max(0, audio.volume - AUDIO_FADE_OUT / 1000)
        }
    }
}