export default async function getTracksMatchingSearchQuery(query: string) {
	const tracks: string[] = [];
	let offset = 0;

	while (true) {
		const response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50&offset=${offset}`)

		for (const track of response.tracks.items) {
			tracks.push(track.uri)
		}

		offset += 50

		if (offset >= response.tracks.total) {
			break
		}
	}

	return tracks
}