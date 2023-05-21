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

	switch (provider) {
	case "context":
		switch (CtxURI.type) {
		case "track":
			storeUriNameChache(RawURI, Spicetify.Player.data?.track?.metadata?.title)
			return {
				type: SourceType.TRACK,
				uri: RawURI
			}
		case "album":
			storeUriNameChache(RawURI, Spicetify.Player.data?.context_metadata?.context_description)
			return {
				type: SourceType.ALBUM,
				uri: RawURI
			}
		case "playlist":
		case "playlist-v2":
			storeUriNameChache(RawURI, Spicetify.Player.data?.context_metadata?.context_description)
			return {
				type: SourceType.PLAYLIST,
				uri: RawURI
			}
		case "artist":
			storeUriNameChache(RawURI, Spicetify.Player.data?.context_metadata?.context_description)
			return {
				type: SourceType.ARTIST,
				uri: RawURI
			}
		case "station":
			return {
				type: SourceType.STATION,
				uri: RawURI
			}
		case "episode":
			storeUriNameChache(RawURI, Spicetify.Player.data?.track?.metadata?.title)
			return {
				type: SourceType.EPISODE,
				uri: RawURI
			}
		case "show":
			storeUriNameChache(RawURI, Spicetify.Player.data?.context_metadata?.context_description)
			return {
				type: SourceType.PODCAST,
				uri: RawURI
			}
		case "collection":
			return {
				type: SourceType.LIKED_SONGS,
				uri: RawURI
			}
		case "user-toplist":
			return {
				type: SourceType.USER_TOP_TRACKS,
				uri: RawURI
			}
		case "search":
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