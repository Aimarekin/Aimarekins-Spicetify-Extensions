import waitPolledCondition from "wait-polled-condition"
import { playWithoutContext, PLAYABLE_WITHOUT_CONTEXT_URI_TYPES, prependToQueue } from "./utils/PlayerTools"
import { tryCatch } from "./utils/TryCatch"
import { coerceSpicetifyUriType } from "./utils/UriTools"
import pullLocalizedString from "./localization/pullLocalizedString"

waitPolledCondition([
	() => window.Spicetify,
	() => Spicetify.ContextMenu,
	() => Spicetify.Player,
	() => Spicetify.Locale
]).then(async () => {
	const menuItem = new Spicetify.ContextMenu.Item(
		pullLocalizedString(Spicetify.Locale.getLocale()),
		(uris: string[]) => {
			if (uris.length > 1) {
				playWithoutContext(uris[0])
				prependToQueue(uris.slice(1))
			} else {
				playWithoutContext(uris[0])
			}
		},
		(uris: string[]) =>
			uris.length > 0 &&
			uris.every((uri) => tryCatch(coerceSpicetifyUriType, uri, PLAYABLE_WITHOUT_CONTEXT_URI_TYPES)[0]),
		"play"
	)

	menuItem.register()
})
