export function getBase62ForURI(URI: Spicetify.URI | any): string | null {
	// Accross different Spotify versions, the URI format has changed.
	// Not sure if this is compatible for all of them, hope so
	let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI) return null

	return (AdaptedURI.hasBase62Id ? AdaptedURI.id : AdaptedURI.getBase62Id()) || null
}