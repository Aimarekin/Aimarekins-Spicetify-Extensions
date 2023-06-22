export function getBase62ForURI(URI: Spicetify.URI | any): string | null {
	// Accross different Spotify versions, the URI format has changed.
	// Not sure if this is compatible for all of them, hope so
	let AdaptedURI = Spicetify.URI.from(URI)
	if (!AdaptedURI) return null

	return (AdaptedURI.hasBase62Id ? AdaptedURI.id : AdaptedURI.getBase62Id()) || null
}

const base16Characters = "0123456789abcdef"
	, base62Characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	, base16Translations: string[] = [];
base16Translations.length = 256;
for (let e = 0; e < 256; e++)
	base16Translations[e] = base16Characters[e >> 4] + base16Characters[15 & e];
const base62LookupValues: number[] = [];
base62LookupValues.length = 128;
for (let e = 0; e < base62Characters.length; ++e)
	base62LookupValues[base62Characters.charCodeAt(e)] = e;

// Transform a base 62 ID to a base 16 ID
// Taken straight from xpui (with modifications)
// Though this is to be implemented in Spicetify, it might not be available in some versions (not as of currently v2.20.1)
export function base62To16(e: string): string | null {
	if (22 !== e.length)
		return null;
	const t = 2.3283064365386963e-10
		, n = 4294967296
		, o = 238328;
	let i, r, a, s, l;
	return i = 56800235584 * base62LookupValues[e.charCodeAt(0)] + 916132832 * base62LookupValues[e.charCodeAt(1)] + 14776336 * base62LookupValues[e.charCodeAt(2)] + 238328 * base62LookupValues[e.charCodeAt(3)] + 3844 * base62LookupValues[e.charCodeAt(4)] + 62 * base62LookupValues[e.charCodeAt(5)] + base62LookupValues[e.charCodeAt(6)],
	r = i * t | 0,
	i -= r * n,
	l = 3844 * base62LookupValues[e.charCodeAt(7)] + 62 * base62LookupValues[e.charCodeAt(8)] + base62LookupValues[e.charCodeAt(9)],
	i = i * o + l,
	i -= (l = i * t | 0) * n,
	r = r * o + l,
	l = 3844 * base62LookupValues[e.charCodeAt(10)] + 62 * base62LookupValues[e.charCodeAt(11)] + base62LookupValues[e.charCodeAt(12)],
	i = i * o + l,
	i -= (l = i * t | 0) * n,
	r = r * o + l,
	r -= (l = r * t | 0) * n,
	a = l,
	l = 3844 * base62LookupValues[e.charCodeAt(13)] + 62 * base62LookupValues[e.charCodeAt(14)] + base62LookupValues[e.charCodeAt(15)],
	i = i * o + l,
	i -= (l = i * t | 0) * n,
	r = r * o + l,
	r -= (l = r * t | 0) * n,
	a = a * o + l,
	l = 3844 * base62LookupValues[e.charCodeAt(16)] + 62 * base62LookupValues[e.charCodeAt(17)] + base62LookupValues[e.charCodeAt(18)],
	i = i * o + l,
	i -= (l = i * t | 0) * n,
	r = r * o + l,
	r -= (l = r * t | 0) * n,
	a = a * o + l,
	a -= (l = a * t | 0) * n,
	s = l,
	l = 3844 * base62LookupValues[e.charCodeAt(19)] + 62 * base62LookupValues[e.charCodeAt(20)] + base62LookupValues[e.charCodeAt(21)],
	i = i * o + l,
	i -= (l = i * t | 0) * n,
	r = r * o + l,
	r -= (l = r * t | 0) * n,
	a = a * o + l,
	a -= (l = a * t | 0) * n,
	s = s * o + l,
	s -= (l = s * t | 0) * n,
	l ? null : base16Translations[s >>> 24] + base16Translations[s >>> 16 & 255] + base16Translations[s >>> 8 & 255] + base16Translations[255 & s] + base16Translations[a >>> 24] + base16Translations[a >>> 16 & 255] + base16Translations[a >>> 8 & 255] + base16Translations[255 & a] + base16Translations[r >>> 24] + base16Translations[r >>> 16 & 255] + base16Translations[r >>> 8 & 255] + base16Translations[255 & r] + base16Translations[i >>> 24] + base16Translations[i >>> 16 & 255] + base16Translations[i >>> 8 & 255] + base16Translations[255 & i]
}