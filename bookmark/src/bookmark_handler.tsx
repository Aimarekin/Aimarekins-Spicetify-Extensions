import { settings } from "./settings"
import { stringStorage, translate } from "./localizer"

const FALLBACK_BOOKMARKS_PLAYLIST_NAME = "Bookmarked Songs"

const bookmarkPlaylistNames = new Set<string>(FALLBACK_BOOKMARKS_PLAYLIST_NAME)
for (const langKeys in Object.values(stringStorage)) {
    const name = (langKeys as unknown as { [key:string]: string})["playlist_title"]
    if (name) bookmarkPlaylistNames.add(name)
}

let _bookmarkPlaylistURIPromise: Promise<string> | null = null
export function getBookmarkPlaylistURI(): Promise<string> {
    if (_bookmarkPlaylistURIPromise) return _bookmarkPlaylistURIPromise

    _bookmarkPlaylistURIPromise = new Promise(async (resolve) => {
        // First, attempt to find the bookmark playlist as it is saved in the settings
        const bookmarkPlaylistURI: string | undefined = settings.getFieldValue("bookmark-playlist-uri")

        // We must verify it exists

        const rootlist = await Spicetify.Platform.RootlistAPI.getContents()
        // Traverse the rootlist to find the bookmark playlist
        const traverse = (items): string | undefined => {
            for (const item of items) {
                if (item.type == "folder") {
                    const res = traverse(item.items)
                    if (res !== undefined) return res
                }
                else if (item.type == "playlist") {
                    if (bookmarkPlaylistURI !== undefined ? bookmarkPlaylistURI == item.uri : bookmarkPlaylistNames.has(item.name)) {
                        return item.uri
                    }
                }
            }
        }

        const foundURI = traverse(rootlist.items)
        if (foundURI) {
            resolve(foundURI)
            return
        }

        // Not found - create one
        const res = await Spicetify.CosmosAsync.post(`https://api.spotify.com/v1/users/${Spicetify.Platform.OfflineAPI._username}/playlists`, {
            name: translate("playlist_title", false) || FALLBACK_BOOKMARKS_PLAYLIST_NAME,
            public: false
        })
        resolve(res.uri)

        // Upload the bookmark playlist image
        new Promise<void>(resolve => {
            // TODO
            resolve()
        })
    })

    return _bookmarkPlaylistURIPromise
}

const bookmarkedSongs = new Set<string>()
let _getBookmarkedSongsPromise: Promise<Set<string>> | null = null
function getBookmarkedSongs(): Promise<Set<string>> {
    if (_getBookmarkedSongsPromise) return _getBookmarkedSongsPromise

    _getBookmarkedSongsPromise = new Promise(async (resolve) => {
        const res = await Spicetify.Platform.PlaylistAPI.getContents(await getBookmarkPlaylistURI(), {decorateFormatListData: false, filter: "", offset: 0})
        for (const item of res.items) {
            bookmarkedSongs.add(item.uri)
        }
        resolve(bookmarkedSongs)
    })

    return _getBookmarkedSongsPromise
}

export async function isBookmarked(uri: string): Promise<boolean> {
    return (await getBookmarkedSongs()).has(uri)
}

// REMEMBER TO LISTEN TO addSync and removeSync

export async function bookmark(uris: string[]): Promise<void> {
    await Spicetify.Platform.PlaylistAPI.add(await getBookmarkPlaylistURI(), uris, {before: "start"})
}

export async function unbookmark(uris: string[]): Promise<void> {
    await Spicetify.Platform.PlaylistAPI.remove(await getBookmarkPlaylistURI(), uris)
}