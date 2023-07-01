import { Translate } from "./localizer"
import { getBase62ForURI, getURIFromStation, getSubURI } from "./util"

// string is the value
// null means error/unknown
// undefined means does not exist
export type MetadataValues = string | null | undefined

export interface URIMetadata {
    name: Promise<MetadataValues>,
    img: Promise<MetadataValues>
}

export const unfetched = Symbol("unfetched")
export type Unfetched = typeof unfetched
export type UnsafeMetadataValues = MetadataValues | Unfetched
export interface URIUnsafeMetadata {
    name: Promise<MetadataValues> | Unfetched,
    img: Promise<MetadataValues> | Unfetched
}

const nullPromise = Promise.resolve(null)
const undefinedPromise = Promise.resolve(undefined)
export const nullMetadata: URIMetadata = {
    name: nullPromise,
    img: nullPromise
}
export const undefinedMetadata: URIMetadata = {
    name: undefinedPromise,
    img: undefinedPromise
}
export const unfetchedMetadata: URIUnsafeMetadata = {
    name: unfetched,
    img: unfetched
}

const arrayLastElement = <T,>(arr: T[]): T => arr[arr.length - 1]

const nullifyPromise = <T,>(promise: Promise<T>): Promise<T | null> => promise.catch(() => {console.warn("PLAYING-SOURCE: Promise failed", promise); return null})
const cosmosGetWrap = <T,>(url: string): Promise<T | null> => nullifyPromise(Spicetify.CosmosAsync.get(url))
const cosmosGetWrapId = <T,>(url: string, id: string) => cosmosGetWrap<T>(url.replace("${id}", id))

const genericEndpoints = {
	[Spicetify.URI.Type.PLAYLIST]: "https://api.spotify.com/v1/playlists/${id}?fields=name,images",
	[Spicetify.URI.Type.PLAYLIST_V2]: "https://api.spotify.com/v1/playlists/${id}?fields=name,images",
	[Spicetify.URI.Type.ALBUM]: "https://api.spotify.com/v1/albums/${id}",
	[Spicetify.URI.Type.COLLECTION_ALBUM]: "https://api.spotify.com/v1/artists/${id}",
	[Spicetify.URI.Type.ARTIST]: "https://api.spotify.com/v1/artists/${id}",
	[Spicetify.URI.Type.COLLECTION_ARTIST]: "https://api.spotify.com/v1/artists/${id}",
	[Spicetify.URI.Type.SHOW]: "https://api.spotify.com/v1/shows/${id}",
	[Spicetify.URI.Type.EPISODE]: "https://api.spotify.com/v1/episodes/${id}",
}
const typesWithGenericEndpoints = new Set(Object.keys(genericEndpoints))

interface GenericResponse {
    name: string,
    images: SpotifyApi.ImageObject[]
}

// Clean a URI returning only the essential details
// (id, and if it's a radio/collection convert to original)
function cleanseURI(URI: Spicetify.URI | any): string | null {
    let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI) return null

    // TODO: cleaning up URI context info
    return getSubURI(AdaptedURI)
}

let cachedURI: string | null = null
let cachedMetadata: URIUnsafeMetadata
export function getUriMetadata(sourceURI: Spicetify.URI | any): Readonly<URIMetadata> {
    const cleanURI = cleanseURI(sourceURI)
    if (!cleanURI) return nullMetadata
    const metadata = cleanURI === cachedURI ? cachedMetadata : Object.assign({}, unfetchedMetadata)

    cachedURI = cleanURI
    cachedMetadata = metadata

    fillUriMetadata(cleanURI, cachedMetadata)

    //console.log("reply for", sourceURI, "converted to", cleanURI, "with", metadata)

    for (const [k, promisedV] of Object.entries(metadata)) {
        promisedV.then((v: UnsafeMetadataValues) => {
            if (v === null || v === unfetched) {
                console.warn("PLAYING-SOURCE: Metadata field", k, "for", sourceURI, "=>", cleanURI, "errored or could not be fetched:", v, metadata)
            }
        })
    }

    return metadata as URIMetadata
}

export function setCachedUriUnsafeMetadata(sourceURI: Spicetify.URI | null | any, metadata: URIUnsafeMetadata): void {
    if (sourceURI === null) {
        // Clear the cache
        cachedURI = null
        cachedMetadata = nullMetadata
    }

    const cleanURI = cleanseURI(sourceURI)
    if (!cleanURI) return

    cachedURI = cleanURI
    cachedMetadata = metadata
}

function fillIfUnfetched(object: URIUnsafeMetadata, key: keyof URIUnsafeMetadata, value: Promise<MetadataValues>) {
    if (object[key] === unfetched) object[key] = nullifyPromise(value)
}

const reqHandle = <T,P>(after: Promise<T | null>, handler: (arg0: T) => P) => after.then(res =>
    res !== null ? handler(res) : null
)
const nullifyMetadata = (metadata: URIUnsafeMetadata): void => Object.keys(metadata).forEach(k => {
    metadata[k as keyof URIUnsafeMetadata] = nullPromise
});

// Transforms currentMetadata into URIMetadata
function fillUriMetadata(sourceURI: string, currentMetadata: URIUnsafeMetadata): void {
    if (!Object.values(currentMetadata).includes(unfetched)) return

    // Fill missing values
    const uri = Spicetify.URI.from(sourceURI)
	if (uri === null) return nullifyMetadata(currentMetadata)

    if (typesWithGenericEndpoints.has(uri.type)) {
        const id = getBase62ForURI(uri)
        if (!id) return nullifyMetadata(currentMetadata)

        const req = cosmosGetWrapId<GenericResponse>(genericEndpoints[uri.type], id)
        //console.log("Filling for unfetched generic", uri, id, "with", req)
        fillIfUnfetched(currentMetadata, "name", reqHandle(req, res => res.name))
        fillIfUnfetched(currentMetadata, "img", reqHandle(req, res => arrayLastElement(res.images)?.url))

        return
    }
    else {
        switch (uri.type) {
            case Spicetify.URI.Type.TRACK: {
                // Images have to be fecthed from track's album
                const id = getBase62ForURI(uri)
                if (!id) return nullifyMetadata(currentMetadata)

                const req = cosmosGetWrapId<SpotifyApi.TrackObjectFull>("https://api.spotify.com/v1/tracks/${id}", id)
                fillIfUnfetched(currentMetadata, "name", reqHandle(req, res => res.name))
                fillIfUnfetched(currentMetadata, "img", reqHandle(req, res => arrayLastElement(res.album.images)?.url))

                return
            }
            case Spicetify.URI.Type.STATION: {
                // Station is "radio"
                // Fill from the original URI
                console.warn("PLAYING-SOURCE: Fetching metadata for station. This might cause cache misses.", sourceURI, currentMetadata)

                const originalURI = getURIFromStation(uri)
                if (originalURI === null) return nullifyMetadata(currentMetadata)

                return fillUriMetadata(originalURI, currentMetadata)
            }
            case Spicetify.URI.Type.PROFILE: {
                const id = getBase62ForURI(uri)
                if (!id) return nullifyMetadata(currentMetadata)

                const req = cosmosGetWrapId<SpotifyApi.UserObjectPublic>("https://api.spotify.com/v1/users/${id}", id)
                fillIfUnfetched(currentMetadata, "name", reqHandle(req, res => res.display_name ?? res.id))
                fillIfUnfetched(currentMetadata, "img", reqHandle(req, res => res.images ? arrayLastElement(res.images).url : null))

                return
            }
            case Spicetify.URI.Type.FOLDER: {
                // Getting this is a little more complicated. We have to traverse the user's playlists and find the one that matches the folder's ID
                const id = getBase62ForURI(uri)
                if (!id) return nullifyMetadata(currentMetadata)

                type RootlistItem = RootlistFolder | any
                type RootlistFolder = {
                    type: "folder",
                    name: string,
                    uri: string,
                    items: RootlistItem[]
                }
    
                const traverse = (item: RootlistFolder): string | null => {
                    if (item.type == "folder") {
                        if (getBase62ForURI(item.uri) == id) return item.name
                        for (const child of item.items) {
                            if (child.type != "folder") continue
                            const res = traverse(child)
                            if (res) return res
                        }
                    }
                    return null
                }
                const rootlistReq = Spicetify.Platform.RootlistAPI.getContents() as Promise<RootlistFolder>
                
                fillIfUnfetched(currentMetadata, "name", rootlistReq.then((res) => traverse(res)))
                fillIfUnfetched(currentMetadata, "img", undefinedPromise)

                return
            }
            case Spicetify.URI.Type.AD: {
                fillIfUnfetched(currentMetadata, "name", Promise.resolve(Translate("playing_ad")))
                fillIfUnfetched(currentMetadata, "img", undefinedPromise)

                return
            }
            case Spicetify.URI.Type.SEARCH: {
                const query = (uri?.query as string) || null
                if (query) {
                    fillIfUnfetched(currentMetadata, "name", Promise.resolve(Translate("search_format").formatUnicorn(query)))
                    fillIfUnfetched(currentMetadata, "img", undefinedPromise)
                }
                else { nullifyMetadata(currentMetadata) }

                return
            }
            case Spicetify.URI.Type.LOCAL: {
                // local is a "catch-all" for "track", "album" and "artist"
                // If there is a track name, it's a track
                // Otherwise, there's album -> album, artist -> artist
                // And if none, fallback to track
                // Afterwards, we have to get the image by browsing local files

                interface LocalTrack {
                    album: {
                        images: {
                            url: string
                        }[],
                        name: string,
                        uri: string
                    }
                    uri: string,
                    name: string,
                }

                function fillImageWithCondition(condition: (arg0: LocalTrack) => boolean): void {
                    if (currentMetadata.img !== unfetched) return
                    const req = Spicetify.Platform.LocalFilesAPI.getTracks() as Promise<LocalTrack[]>

                    currentMetadata.img = req.then((res) => {
                        for (const track of res) {
                            if (condition(track)) return arrayLastElement(track.album.images)?.url
                        }
                        return undefined
                    })
                }

                if (uri.track || !uri.album && !uri.artist) {
                    fillIfUnfetched(currentMetadata, "name", Promise.resolve(uri.track))
                    fillImageWithCondition(track => track.name == uri.track)
                }
                else if (uri.album) {
                    fillIfUnfetched(currentMetadata, "name", Promise.resolve(uri.album))
                    fillImageWithCondition(track => track.album.name == uri.album)
                }
                else if (uri.artist) {
                    fillIfUnfetched(currentMetadata, "name", Promise.resolve(uri.artist))
                    fillImageWithCondition(track => track.album.uri == uri.artist)
                }
            }
        }
    }

    // Unhandled
    console.warn("PLAYING-SOURCE: UNHANDLED URI WHILE FETCHING METADATA", uri)
    return nullifyMetadata(currentMetadata)
}