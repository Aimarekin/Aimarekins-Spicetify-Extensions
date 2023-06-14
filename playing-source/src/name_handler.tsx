import { Translate } from "./localizer"
import { getBase62ForURI } from "./util"

export type NamePromise = Promise<string | null>

let cachedURI: string | null = null
let cachedName: NamePromise

/* const typesThatShouldntCache = new Set<string | undefined>([
	Spicetify.URI.Type.AD,
	Spicetify.URI.Type.SEARCH,
	Spicetify.URI.Type.LOCAL_TRACK,
	Spicetify.URI.Type.LOCAL_ALBUM,
	Spicetify.URI.Type.LOCAL_ARTIST
]) */

export function setUriCache(URI: string, name: string | null) {
    cachedURI = URI
    cachedName = new Promise((resolve) => resolve(name))
}

export function getUriName(URI:string | undefined): NamePromise {
	if (!URI) return new Promise((resolve) => resolve(null))

    if (URI == cachedURI) return cachedName

    cachedURI = URI
    cachedName = _getUriName(URI)
    return cachedName
}

async function _getUriName(SourceURI:string): NamePromise {
	console.log("FETCHING NAME FOR", SourceURI)

	const URI = Spicetify.URI.from(SourceURI)
	if (URI === null) return null
	const base62 = getBase62ForURI(URI)

	switch (URI.type) {
		case Spicetify.URI.Type.TRACK:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${base62}`))?.name || null
		case Spicetify.URI.Type.PLAYLIST:
		case Spicetify.URI.Type.PLAYLIST_V2:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${base62}?fields=name`))?.name || null
		case Spicetify.URI.Type.ALBUM:
		case Spicetify.URI.Type.COLLECTION_ALBUM:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${base62}`))?.name || null
		case Spicetify.URI.Type.ARTIST:
		case Spicetify.URI.Type.COLLECTION_ARTIST:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${base62}`))?.name || null
		case Spicetify.URI.Type.EPISODE:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${base62}`))?.name || null
		case Spicetify.URI.Type.SHOW:
			if (!base62) return null
			return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/shows/${base62}`))?.name || null
		case Spicetify.URI.Type.STATION:
            // Station is "radio"
            // Get name of where the station is from
			return await getUriName("spotify:" + SourceURI.substring("spotify:station:".length))
		case Spicetify.URI.Type.PROFILE: {
			if (!base62) return null
			const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/users/${base62}`)
			return res?.display_name || res?.id || null
		}
		case Spicetify.URI.Type.FOLDER: {
			// Getting this is a little more complicated. We have to traverse the user's playlists and find the one that matches the folder's ID
			const traverse = (item): string | undefined => {
				if (item.type == "folder") {
					if (item.uri == SourceURI) {
						return item.name
					}
					let returned = item.items.forEach(traverse)
                    if (returned) return returned
				}
			}
			return traverse(await Spicetify.Platform.RootlistAPI.getContents()) || null
		}

		case Spicetify.URI.Type.AD:
			return Translate("playing_ad")
		case Spicetify.URI.Type.SEARCH: {
			const query = (Spicetify.URI.from(URI)?.query as string) || null
			return query ? Translate("search_format").formatUnicorn(query) : null
		}

		case Spicetify.URI.Type.LOCAL_TRACK: {
			return URI?.track || null
		}
		case Spicetify.URI.Type.LOCAL_ALBUM: {
			return URI?.album || null
		}
		case Spicetify.URI.Type.LOCAL_ARTIST: {
			return URI?.artist || null
		}
	}

	return null
}