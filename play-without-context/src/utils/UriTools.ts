export function coerceSpicetifyUri(source: unknown): Spicetify.URI {
	if (source instanceof Spicetify.URI) {
		return source
	}

	const transformedURI = Spicetify.URI.from(source)

	if (!transformedURI) {
		throw new Error("Invalid URI")
	}

	return transformedURI
}

type SpicetifyURIType = (typeof Spicetify.URI.Type)[keyof typeof Spicetify.URI.Type]

export function coerceSpicetifyUriType(
	source: unknown,
	expectedType: SpicetifyURIType | SpicetifyURIType[]
): Spicetify.URI {
	const uri = coerceSpicetifyUri(source)

	const expectedTypesArr = Array.isArray(expectedType) ? expectedType : [expectedType]
	if (!expectedTypesArr.includes(uri.type)) {
		throw new Error(`Expected URI type to be one of ${expectedTypesArr.join(", ")} but got ${uri.type}`)
	}

	return uri
}
