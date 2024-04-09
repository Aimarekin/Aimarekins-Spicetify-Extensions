import waitPolledCondition from "wait-polled-condition"
import getTracksMatchingSearchQuery from "./util/getTracksMatchingSearchQuery"

const BAD_TO_THE_BONE_ISRCS = ["USEM38500069", "USEM30400010"]

const bad_to_the_bone_uris = waitPolledCondition(() => Spicetify?.CosmosAsync).then(async () => {	
	const uris = new Set<string>()

	for (const isrc of BAD_TO_THE_BONE_ISRCS) {
		const tracks = await getTracksMatchingSearchQuery("isrc:" + isrc)
		tracks.forEach((uri) => uris.add(uri))
	}

	return uris
})

export default async function isBadToTheBone(uri: string | Spicetify.URI) {
	const coercedURI = Spicetify.URI.from(uri)

	if (!(coercedURI instanceof Spicetify.URI) || coercedURI.type !== Spicetify.URI.Type.TRACK) {
		return false
	}

	return (await bad_to_the_bone_uris).has(uri.toString())
}