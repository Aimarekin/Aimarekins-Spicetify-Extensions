import { coerceSpicetifyUri, coerceSpicetifyUriType } from "./UriTools"

const LOCAL_FILES_URI = "spotify:internal:local-files"
export const PLAYABLE_WITHOUT_CONTEXT_URI_TYPES = ["track", "episode", "local"]

export function playWithoutContext(
	uri: unknown
): ReturnType<typeof Spicetify.Player.origin.play | typeof Spicetify.Player.playUri> {
	const coercedUri = coerceSpicetifyUriType(uri, PLAYABLE_WITHOUT_CONTEXT_URI_TYPES)

	if (coercedUri.type === Spicetify.URI.Type.LOCAL) {
		return Spicetify.Player.origin.play(
			{
				uri: LOCAL_FILES_URI,
				pages: [
					{
						items: [
							{
								uri
							}
						]
					}
				]
			},
			{},
			{}
		)
	} else {
		return Spicetify.Player.playUri(coercedUri.toString())
	}
}

const QUEUE_INTERACTION = { interactionId: null }

export function prependToQueue(
	uris: unknown[]
): ReturnType<typeof Spicetify.Player.origin.addToQueue | typeof Spicetify.Player.origin.insertIntoQueue> {
	const coercedUris = uris.map((uri) => coerceSpicetifyUri(uri))

	const urisToInsert = coercedUris.map((uri) => ({ uri: uri.toString(), uid: null }))
	const firstQueuedItem = Spicetify.Player.origin.getQueue().queued[0]

	if (firstQueuedItem) {
		return Spicetify.Player.origin.insertIntoQueue(
			urisToInsert,
			{
				before: {
					uri: firstQueuedItem.uri,
					uid: firstQueuedItem.uid
				}
			},
			QUEUE_INTERACTION
		)
	} else {
		return Spicetify.Player.origin.addToQueue(urisToInsert, QUEUE_INTERACTION)
	}
}
