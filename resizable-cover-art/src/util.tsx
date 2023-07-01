import { Translate } from "./localizer"

export function getBase62ForURI(URI: Spicetify.URI | any): string | null {
	// Accross different Spotify versions, the URI format has changed.
	// Not sure if this is compatible for all of them, hope so
	let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI) return null

	return (AdaptedURI.hasBase62Id ? AdaptedURI.id : AdaptedURI.getBase62Id()) || null
}

export function getURIFromStation(URI: Spicetify.URI | any): string | null {
	let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI || AdaptedURI.type != Spicetify.URI.Type.STATION) return null

	return "spotify:" + AdaptedURI.toString().substring("spotify:station:".length)
}

export function getURIFromCollection(URI: Spicetify.URI | any): string | null {
	let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI || !AdaptedURI.type.startsWith("collection")) return null

	switch (AdaptedURI.type) {
		case Spicetify.URI.Type.COLLECTION_ARTIST: {
			return "spotify:artist:" + getBase62ForURI(AdaptedURI)
		}
		case Spicetify.URI.Type.COLLECTION_ALBUM: {
			return "spotify:album:" + getBase62ForURI(AdaptedURI)
		}
	}

	console.warn("getURIFromCollection: Unknown collection type: " + AdaptedURI.type)
	return AdaptedURI.toString()
}

export function getSubURI<T>(URI: T): string | Exclude<T, Spicetify.URI> {
	const subURI = getURIFromStation(URI) || getURIFromCollection(URI)
	if (subURI) return subURI

	const AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI) return URI as Exclude<T, Spicetify.URI>
	return AdaptedURI.toString()
}