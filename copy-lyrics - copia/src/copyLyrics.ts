import loc from "loc.json"
import waitPolledCondition from "wait-polled-condition"

const FALLBACK_LOCALE = "en"

export default function copyLyrics(lyricsText: string): Promise<void> {
	return new Promise((resolve, reject) => {
		waitPolledCondition(() => Spicetify?.Platform?.ClipboardAPI?.copy).then(() => {
			(Spicetify.Platform.ClipboardAPI.copy(lyricsText) as Promise<void>).then(() => {
				Spicetify.showNotification(loc[Spicetify.Locale.getLocale()] || loc[FALLBACK_LOCALE])
				resolve()
			}, (reason) => {
				console.error("Couldn't copy lyrics to clipboard", reason)
				Spicetify.showNotification("💀")
				reject(reason)
			})
		}, reject)
	})
}