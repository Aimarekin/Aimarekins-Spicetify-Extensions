import { getBase62ForURI } from "./util"

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
    return await Spicetify.CosmosAsync.get(
        `wg://metadata/4/track/${Spicetify.URI.idToHex(getBase62ForURI(URI)!)!}?market=from_token`,
        undefined,
        {
            Accept: "application/json"
        }
    ) as TrackMetadata
}

export function extractPreviewsFromMetadata(metadata: TrackMetadata): string[] {
    return metadata.preview?.map(preview => "https://p.scdn.co/mp3-preview/" + preview.file_id ) || []
}

export async function getPreviewURLFor(URI: string | Spicetify.URI): Promise<string | null> {
    return extractPreviewsFromMetadata(await getMetadataForTrack(URI))[0] || null
}