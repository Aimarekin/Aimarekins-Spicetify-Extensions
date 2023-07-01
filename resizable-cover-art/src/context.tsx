import { setCachedUriUnsafeMetadata, unfetched, UnsafeMetadataValues, URIUnsafeMetadata } from "./metadata"
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

export type subsourceTypes =
	| SourceType.TRACK
	| SourceType.ARTIST
	| SourceType.ALBUM
	| SourceType.PLAYLIST
	| SourceType.UNKNOWN

interface SourceInfoSubsourceGeneric {
	type: SourceType.STATION | SourceType.RECOMMENDED,
	uri: string,
}

interface SourceInfoSubsourceHasSubtype extends SourceInfoSubsourceGeneric {
	subType: Exclude<subsourceTypes, SourceType.UNKNOWN>,
	subUri: string
}

interface SourceInfoSubsourceHasNoSubtype extends SourceInfoSubsourceGeneric {
	subType: SourceType.UNKNOWN,
	subUri?: string
}

type SourceInfoSubsource = SourceInfoSubsourceHasSubtype | SourceInfoSubsourceHasNoSubtype

interface SourceInfoGeneric {
	type: Exclude<SourceType, SourceType.STATION | SourceType.RECOMMENDED | SourceType.UNKNOWN>,
	uri: string
}

interface SourceInfoUnknown {
	type: SourceType.UNKNOWN
	uri?: string
}

export type SourceInfo = SourceInfoSubsource | SourceInfoGeneric | SourceInfoUnknown

const wrapImageURL = (url: string | undefined) =>
	url === undefined ? undefined : (
		/^(?:spotify:image:|https?:\/\/)/.test(url) ? url : "spotify:image:" + url
	)

const warnForTypes = new Set([SourceType.UNKNOWN, SourceType.RECOMMENDED_NO_SOURCE])

const warnedNotSupported = new Set<string>()

export function getCurrentContext(): SourceInfo {
	const returned = _getContext()

	if (warnForTypes.has(returned.type) || "subType" in returned && warnForTypes.has(returned.subType)) {
		const RawURI = Spicetify.Player.data?.context_uri
		const CtxURI = Spicetify.URI.from(RawURI)
		const provider = Spicetify.Player.data?.track?.provider

		const fullIdentifier = `${provider}@${RawURI}`
		if (!warnedNotSupported.has(fullIdentifier)) {
			console.warn("PLAYING-SOURCE: Unknown context for provider", provider, "with URI", RawURI, "\n", CtxURI, "\n", returned, "\n", Spicetify.Player.data)
			warnedNotSupported.add(fullIdentifier)
		}
	}

	return returned
}

// Same as URIUnsafeMetadata but without promises and optional
interface NonPromisedURIUnsafeMetadata {
	name?: UnsafeMetadataValues,
	img?: UnsafeMetadataValues
}

const stationTypes: Record<string, subsourceTypes | undefined> = {
	[Spicetify.URI.Type.TRACK]: SourceType.TRACK,
	[Spicetify.URI.Type.ALBUM]: SourceType.ALBUM,
	[Spicetify.URI.Type.ARTIST]: SourceType.ARTIST,
	[Spicetify.URI.Type.PLAYLIST]: SourceType.PLAYLIST,
	[Spicetify.URI.Type.PLAYLIST_V2]: SourceType.PLAYLIST,
}

function storeToCache(uri: string, metadata: NonPromisedURIUnsafeMetadata) {
	// Replace all values with promises
	// and if any of them is undefined, replace for fetch
	// as it might be unreliable
	let cleanedMetadata: URIUnsafeMetadata = {
		name: unfetched,
		img: unfetched
	}
	let anyMeaningfulValue = false
	for (const key in metadata) {
		const v = metadata[key as keyof NonPromisedURIUnsafeMetadata]
		if (v !== undefined && v !== unfetched) {
			cleanedMetadata[key as keyof NonPromisedURIUnsafeMetadata] = Promise.resolve(v)
			anyMeaningfulValue = true
		}
	}

	// If no value was set, or was anything other than undefined,
	// don't overwrite the cache
	if (!anyMeaningfulValue) return

	setCachedUriUnsafeMetadata(uri, cleanedMetadata)
}

function _getContext(data = Spicetify.Player.data): SourceInfo {
	const trackMetadata = data?.track?.metadata
	const ctxMetadata = data?.context_metadata

	const RawURI = trackMetadata?.context_uri || data?.context_uri

	// The latest version doesn't correctly process the local files URI
	if (RawURI == "spotify:internal:local-files") return { type: SourceType.LOCAL_FILES, uri: RawURI }

	const CtxURI = Spicetify.URI.from(RawURI)
	if (!CtxURI) return { type: SourceType.UNKNOWN }

	const provider = Spicetify.Player.data?.track?.provider
	if (!provider) return { type: SourceType.UNKNOWN }

	switch (provider) {
		case "context": {
			switch (CtxURI.type) {
				case Spicetify.URI.Type.TRACK: {
					storeToCache(RawURI, {
						name: trackMetadata?.title,
						img: trackMetadata?.image_small_url
					})
					return {
						type: SourceType.TRACK,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.ALBUM: {
					storeToCache(RawURI, {
						name: ctxMetadata?.context_description,
						img: wrapImageURL(ctxMetadata?.image_url)
					})
					return {
						type: SourceType.ALBUM,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.PLAYLIST:
				case Spicetify.URI.Type.PLAYLIST_V2: {
					// For special playlists (like daily mix), the image is stored differently
					const imgSource = ctxMetadata?.image_url || ctxMetadata?.image
					storeToCache(RawURI, {
						name: ctxMetadata?.context_description,
						img: imgSource ? wrapImageURL(imgSource) : undefined
					})
					return {
						type: SourceType.PLAYLIST,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.ARTIST: {
					storeToCache(RawURI, {
						name: ctxMetadata?.context_description
					})
					return {
						type: SourceType.ARTIST,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.STATION: {
					// Get the station's source
					const substationURIRaw = getURIFromStation(CtxURI)
					if (!substationURIRaw) return { type: SourceType.UNKNOWN, uri: RawURI }
					return {
						type: SourceType.STATION,
						uri: RawURI,
						subType: stationTypes[Spicetify.URI.from(substationURIRaw)!.type] ?? SourceType.UNKNOWN,
						subUri: substationURIRaw
					}
				}
				case Spicetify.URI.Type.EPISODE: {
					storeToCache(RawURI, {
						name: ctxMetadata?.context_description,
						img: trackMetadata?.image_small_url
					})
					return {
						type: SourceType.EPISODE,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.SHOW: {
					storeToCache(RawURI, {
						name: ctxMetadata?.context_description,
						img: trackMetadata?.["show.cover_image.uri"]
					})
					return {
						type: SourceType.PODCAST,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.COLLECTION: {
					return {
						type: SourceType.LIKED_SONGS,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.COLLECTION_ARTIST: {
					// It isn't safe to assume that the playing track has the same artist as the collection.
					return {
						type: SourceType.ARTIST_LIKED_SONGS,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.USER_TOPLIST: {
					return {
						type: SourceType.USER_TOP_TRACKS,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.SEARCH: {

					if (CtxURI?.query == "") {
						return {
							type: SourceType.RECENT_SEARCHED,
							uri: RawURI
						}
					}
					else {
						return {
							type: SourceType.SEARCH,
							uri: RawURI
						}
					}
				}
				case Spicetify.URI.Type.FOLDER:{
					return {
						type: SourceType.FOLDER,
						uri: RawURI
					}
				}
				case Spicetify.URI.Type.APPLICATION: {
					if (getBase62ForURI(CtxURI) === "local-files") {
						return {
							type: SourceType.LOCAL_FILES,
							uri: RawURI
						}
					}
				}
			}
			return {
				type: SourceType.UNKNOWN,
				uri: RawURI
			}
		}
		case "ad": {
			return {
				type: SourceType.AD,
				uri: RawURI
			 }
		}
		case "autoplay": {
			switch (CtxURI?.type) {
				case Spicetify.URI.Type.STATION: {
					// Get the station's source
					const substationURIRaw = getURIFromStation(CtxURI)
					if (!substationURIRaw) return { type: SourceType.UNKNOWN, uri: RawURI }
					return {
						type: SourceType.RECOMMENDED,
						uri: RawURI,
						subType: stationTypes[Spicetify.URI.from(substationURIRaw)!.type] ?? SourceType.UNKNOWN,
						subUri: substationURIRaw
					}
				}
			}

			return {
				type: SourceType.RECOMMENDED_NO_SOURCE,
				uri: RawURI
			}
		}
		case "queue": {
			return {
				type: SourceType.QUEUE,
				uri: RawURI
			}
		}
	}

	return { type: SourceType.UNKNOWN }
}