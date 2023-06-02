interface TrackMetadata {
    album: {},
    artist: {
        gid: string,
        name: string
    }[],
    name: string,
    canonical_uri: string,
    preview?: {
        file_id: string,
        format: string
    }[]

}

export async function getMetadataForTrack(URI: string | Spicetify.URI): Promise<TrackMetadata> {
    if (typeof URI === "string") URI = Spicetify.URI.fromString(URI)
    return await (await fetch(
        `https://spclient.wg.spotify.com/metadata/4/track/${URI.id}?market=from_token`,
        {
            headers: {
                Authorization: "Bearer " + Spicetify.Platform.Session.accessToken,
                Accept: "application/json"
            }
        }
    )).json() as TrackMetadata
}

export function extractPreviewFromMetadata(metadata: TrackMetadata): string[] {
    return metadata.preview?.map(preview => "https://p.scdn.co/mp3-preview/" + preview.file_id ) || []
}

export async function getPreviewURLFor(URI: string | Spicetify.URI): Promise<string[]> {
    return extractPreviewFromMetadata(await getMetadataForTrack(URI))
}