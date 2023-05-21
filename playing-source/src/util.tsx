import { Translate } from "./localizer";

export function waitForElm(selector:string, within:HTMLElement = document.body, timeoutAfter = 5000, shouldReject = false): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        var timeoutId: NodeJS.Timeout;
        if (timeoutAfter > 0) {
            timeoutId = setTimeout(() => {
                if (shouldReject) {
                    return reject("Did not find element after timeout.");
                } else {
                    console.warn("waitForElm has waited for", timeoutAfter ," for selector", selector, "within", within, "but it has not yet been found.");
                }
            }, timeoutAfter);
        }

        let el = within.querySelector(selector);
        if (el) {
            return resolve(el as HTMLElement);
        }

        let observer = new MutationObserver((mutations) => {
            let el = within.querySelector(selector);
            if (el) {
                observer.disconnect();
                clearTimeout(timeoutId);
                return resolve(el as HTMLElement);
            }
        });

        observer.observe(within, {
            childList: true,
            subtree: true
        });
    });
}

var _getUriName_cache : Record<string, string | null | Promise<string | null> > = {};
export function storeUriNameChache(URI: string, name: string | null | undefined) {
    _getUriName_cache[URI] = name === undefined ? null : (name || null);
}

export function getUriName(URI:string | undefined): Promise<string | null> {
    if (!URI) return new Promise((resolve) => resolve(null));

    let cached = _getUriName_cache[URI];
    if (cached !== undefined) {
        if (cached instanceof Promise) {
            return cached;
        }
        return new Promise((resolve) => resolve(cached));
    }

    return new Promise((resolve) => {
        const namePromise = _getUriName(URI);
        if (shouldCacheUriName(URI)) {
            _getUriName_cache[URI] = namePromise;
        }
        namePromise.then((name) => resolve(name) ).catch(() => resolve(null));
    });
};

function shouldCacheUriName(SourceURI:string): boolean {
    const URI = Spicetify.URI.from(SourceURI);
    return (
        !Spicetify.URI.isAd(URI) &&
        !Spicetify.URI.isSearch(URI) &&
        !Spicetify.URI.isLocalAlbum(URI) &&
        !Spicetify.URI.isLocalArtist(URI) &&
        !Spicetify.URI.isLocalTrack(URI)
    );
}

async function _getUriName(SourceURI:string): Promise<string | null> {
    const URI = Spicetify.URI.from(SourceURI);
    if (!URI) return null;


    if (Spicetify.URI.isTrack(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/tracks/${URI._base62Id}`))?.name || null;
    }
    else if (Spicetify.URI.isPlaylistV1OrV2(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/playlists/${URI._base62Id}?fields=name`))?.name || null;
    }
    else if (Spicetify.URI.isAlbum(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/albums/${URI._base62Id}`))?.name || null;
    }
    else if (Spicetify.URI.isArtist(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/artists/${URI._base62Id}`))?.name || null;
    }

    else if (Spicetify.URI.isEpisode(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/episodes/${URI._base62Id}`))?.name || null;
    }
    else if (Spicetify.URI.isShow(URI)) {
        return (await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/shows/${URI._base62Id}`))?.name || null;
    }

    else if (Spicetify.URI.isStation(URI)) {

        return await getUriName("spotify:" + SourceURI.substring("spotify:station:".length));
    }

    else if (Spicetify.URI.isProfile(URI)) {
        const res = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/users/${URI._base62Id}`);
        return res?.display_name || res?.id || null;
    }

    else if (Spicetify.URI.isAd(URI)) {
        return "Advertisement";
    }
    else if (Spicetify.URI.isSearch(URI)) {
        let query = (Spicetify.URI.from(URI)?.query as string) || null;
        return query ? Translate("search_format").formatUnicorn(query) : null;
    }

    else if (Spicetify.URI.isLocalTrack(URI)) {
        return URI?.track || null;
    }
    else if (Spicetify.URI.isLocalAlbum(URI)) {
        return URI?.album || null;
    }
    else if (Spicetify.URI.isLocalArtist(URI)) {
        return URI?.artist || null;
    }

    return null;
};