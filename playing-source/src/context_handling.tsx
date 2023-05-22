import { storeUriNameChache } from "./util"

export enum SourceType {
	TRACK = "TRACK",
    EPISODE = "EPISODE",
    PODCAST = "PODCAST",
	RECOMMENDED = "RECOMMENDED",
	PLAYLIST = "PLAYLIST",
	SEARCH = "SEARCH",
	RECENT_SEARCHED = "RECENT_SEARCHED",
	ARTIST = "ARTIST",
	ALBUM = "ALBUM",
	STATION = "STATION",
    USER_TOP_TRACKS = "USER_TOP_TRACKS",
    LIKED_SONGS = "LIKED_SONGS",
	ARTIST_LIKED_SONGS = "ARTIST_LIKED_SONGS",
	LOCAL_FILES = "LOCAL_FILES",
    QUEUE = "QUEUE",
	AD = "AD",

	UNKNOWN = "UNKNOWN"
}

export interface SourceInfo {
	type: SourceType;
	uri?: string;
}

var lastValidSearchUri: string | null = null

export function getContext(): SourceInfo {
	const RawURI = Spicetify.Player.data?.context_uri
	const CtxURI = Spicetify.URI.from(RawURI)
	if (!CtxURI) return { type: SourceType.UNKNOWN }

	const provider = Spicetify.Player.data?.track?.provider
	if (!provider) return { type: SourceType.UNKNOWN }

	// The available metadata might be unreliable
	// This function makes sure we don't accept "undefined" as something's name
	function storeToCache(name: string | undefined) {
		if (name !== undefined) {
			storeUriNameChache(RawURI, name)
		}
	}

	switch (provider) {
		case "context":
			switch (CtxURI.type) {
				case Spicetify.URI.Type.TRACK:
					storeToCache(Spicetify.Player.data?.track?.metadata?.title)
					return {
						type: SourceType.TRACK,
						uri: RawURI
					}
				case Spicetify.URI.Type.ALBUM:
					storeToCache(Spicetify.Player.data?.context_metadata?.context_description)
					return {
						type: SourceType.ALBUM,
						uri: RawURI
					}
				case Spicetify.URI.Type.PLAYLIST:
				case Spicetify.URI.Type.PLAYLIST_V2:
					storeToCache(Spicetify.Player.data?.context_metadata?.context_description)
					return {
						type: SourceType.PLAYLIST,
						uri: RawURI
					}
				case Spicetify.URI.Type.ARTIST:

					storeToCache(Spicetify.Player.data?.context_metadata?.context_description)
					return {
						type: SourceType.ARTIST,
						uri: RawURI
					}
				case Spicetify.URI.Type.STATION:
					return {
						type: SourceType.STATION,
						uri: RawURI
					}
				case Spicetify.URI.Type.EPISODE:
					storeToCache(Spicetify.Player.data?.track?.metadata?.title)
					return {
						type: SourceType.EPISODE,
						uri: RawURI
					}
				case Spicetify.URI.Type.SHOW:
					storeToCache(Spicetify.Player.data?.context_metadata?.context_description)
					return {
						type: SourceType.PODCAST,
						uri: RawURI
					}
				case Spicetify.URI.Type.COLLECTION:
					return {
						type: SourceType.LIKED_SONGS,
						uri: RawURI
					}
				case Spicetify.URI.Type.COLLECTION_ARTIST:
					// It isn't safe to assume that the playing track has the same artist as the collection.
					return {
						type: SourceType.ARTIST_LIKED_SONGS,
						uri: RawURI
					}
				case Spicetify.URI.Type.USER_TOPLIST:
					return {
						type: SourceType.USER_TOP_TRACKS,
						uri: RawURI
					}
				case Spicetify.URI.Type.SEARCH:
					lastValidSearchUri = Spicetify.Player.data?.track?.uri || null
					if (lastValidSearchUri) {
						storeUriNameChache(lastValidSearchUri, Spicetify.Player.data?.track?.metadata?.title)
					}
					if (CtxURI?.query == "") {
						return { type: SourceType.RECENT_SEARCHED }
					}
					else {
						return {
							type: SourceType.SEARCH,
							uri: RawURI
						}
					}
				case Spicetify.URI.Type.APPLICATION:
					if (CtxURI._base62Id === "local-files") {
						return { type: SourceType.LOCAL_FILES }
					}
			}
			break
		case "ad":
			return { type: SourceType.AD }
		case "autoplay":
		// Spotify keeps the search URI as context when autoplaying,
		// instead of what it's autoplaying from.
		// This is a workaround to get the last valid search URI.
			return {
				type: SourceType.RECOMMENDED,
				uri: lastValidSearchUri || RawURI
			}
		case "queue":
			return { type: SourceType.QUEUE }
	}

	console.warn("PLAYING-SOURCE: Unknown context for:", RawURI, CtxURI, Spicetify.Player.data)
	return { type: SourceType.UNKNOWN }
}