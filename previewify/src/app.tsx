// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { Translate } from "./localizer"
import "./format_unicorn"
import "./style.scss"
import { getMetadataForTrack, getPreviewURLFor } from "./preview_fetching"
import "./previewing_modal"

type Promisable<T> = T | Promise<T>

async function main() {
	while (!Spicetify?.Platform?.Session || !Spicetify.ContextMenu || !Spicetify?.URI || !Spicetify?.Locale) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	console.log("Previewify loaded")
	
	const play_preview_button = new Spicetify.ContextMenu.Item("Play preview",
		async (uri) => {
			getPreviewURLFor(uri[0]).then(url => {
				console.log(url)
			})
		},
		(uris) => {
			if (!(uris.length > 0 && uris.every((item) => Spicetify.URI.from(item)?.type === Spicetify.URI.Type.TRACK ))) return false
			play_preview_button.name = uris.length === 1 ? Translate("play_preview") : Translate("play_previews")
			return true
		},
		"enhance"
	)
	play_preview_button.register()

	//console.log(await getMetadataForTrack("spotify:track:6y0igZArWVi6Iz0rj35c1Y"))
	console.log(await getMetadataForTrack("spotify:track:6N6HSN3zytFXva8LTUUvIL"))

}
	
export default main
