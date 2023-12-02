import { setUriCache } from "./name_handler"
import { getBase62ForURI, getURIFromStation } from "./util";

export enum SourceType {
	TRACK = "TRACK",
    EPISODE = "EPISODE",
    PODCAST = "PODCAST",
	RECOMMENDED = "RECOMMENDED",
	RECOMMENDED_NO_SOURCE = "RECOMMENDED_NO_SOURCE",
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
	FOLDER = "FOLDER",
    QUEUE = "QUEUE",
	AD = "AD",

	UNKNOWN = "UNKNOWN"
}

export interface SourceInfo {
	type: SourceType;
	uri?: string;
}

const warnedNotSupported = new Set<string>()

export function getContext(): SourceInfo {
	const returned = _getContext()

	if (returned.type == SourceType.UNKNOWN) {
		const RawURI = Spicetify.Player.data?.context_uri
		const CtxURI = Spicetify.URI.from(RawURI)
		const provider = Spicetify.Player.data?.item?.provider

		const fullIdentifier = `${provider}@${RawURI}`
		if (!warnedNotSupported.has(fullIdentifier)) {
			console.warn("PLAYING-SOURCE: Unknown context for provider", provider, "with URI", RawURI, "\n", CtxURI, Spicetify.Player.data)
			warnedNotSupported.add(fullIdentifier)
		}
	}

	return returned
}

function _getContext(): SourceInfo {
	const RawURI = Spicetify.Player.data?.context_uri

	// The latest version doesn't correctly process the local files URI
	if (RawURI == "spotify:internal:local-files") return { type: SourceType.LOCAL_FILES }

	const CtxURI = Spicetify.URI.from(RawURI)
	if (!CtxURI) return { type: SourceType.UNKNOWN }

	const provider = Spicetify.Player.data?.track?.provider
	if (!provider) return { type: SourceType.UNKNOWN }

	// The available metadata might be unreliable
	// This function makes sure we don't accept "undefined" as something's name
	function storeToCache(name: string | undefined) {
		if (name !== undefined) {
			setUriCache(RawURI, name)
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

					if (CtxURI?.query == "") {
						return { type: SourceType.RECENT_SEARCHED }
					}
					else {
						return {
							type: SourceType.SEARCH,
							uri: RawURI
						}
					}
				case Spicetify.URI.Type.FOLDER:
					return {
						type: SourceType.FOLDER,
						uri: RawURI
					}
				case Spicetify.URI.Type.APPLICATION:
					if (getBase62ForURI(CtxURI) === "local-files") {
						return { type: SourceType.LOCAL_FILES }
					}
			}
			break
		case "ad":
			return { type: SourceType.AD }
		case "autoplay":
			// When playing from autoplay,
			// the context_uri in the track metadata is more reliable
			const MetadataURI = Spicetify.Player.data?.track?.metadata?.context_uri || RawURI
			const MetadataCtxURI = Spicetify.URI.from(MetadataURI)

			switch (MetadataCtxURI?.type) {
				case Spicetify.URI.Type.SEARCH:
					return { type: SourceType.RECOMMENDED_NO_SOURCE }
				case Spicetify.URI.Type.STATION:
					return {
						type: SourceType.RECOMMENDED,
						uri: getURIFromStation(MetadataURI) as string
					}
				default:
					return {
						type: SourceType.RECOMMENDED,
						uri: MetadataURI
					}
			}
		case "queue":
			return { type: SourceType.QUEUE }
	}

	return { type: SourceType.UNKNOWN }
}
