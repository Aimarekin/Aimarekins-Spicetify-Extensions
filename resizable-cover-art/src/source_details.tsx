import { getUriMetadata, undefinedMetadata, MetadataValues } from "./metadata"
import { SourceType, SourceInfo, subsourceTypes } from "./context"
import { SafeSourceDetails } from "./displayed_state"

export type ExtractedColors = Record<
    | "undefined"
    | "DARK_VIBRANT"
    | "LIGHT_VIBRANT"
    | "VIBRANT"
    | "VIBRANT_NON_ALARMING"
    | "DESATURATED"
    , string
>

// fetch the link from Spotify's playbar
export const fromPlaybar = Symbol("fromPlaybar")
export type FromPlaybar = typeof fromPlaybar

export type LinkValues = MetadataValues | FromPlaybar
type LinkGenerator = (arg0: SourceInfo) => LinkValues

interface SourceDetailsBase {
	name: Promise<MetadataValues>,
	img: Promise<MetadataValues>,
    link: LinkValues
}

interface SourceDetailsSubsourceGeneric extends SourceDetailsBase {
    type: SourceType.STATION | SourceType.RECOMMENDED,
    uri: string,
    colors: Promise<ExtractedColors>,
}

interface SourceDetailsSubsourceHasSubtype extends SourceDetailsSubsourceGeneric {
    subType: Exclude<subsourceTypes, SourceType.UNKNOWN>,
    subUri: string
}

interface SourceDetailsSubsourceHasNoSubtype extends SourceDetailsSubsourceGeneric {
    subType: SourceType.UNKNOWN,
    subUri?: string
}

type SourceDetailsSubsource = SourceDetailsSubsourceHasSubtype | SourceDetailsSubsourceHasNoSubtype

interface SourceDetailsUnknown extends SourceDetailsBase {
    type: SourceType.UNKNOWN,
    uri?: string,
    colors?: Promise<ExtractedColors>
}

type GenericsWithColor =
    | SourceType.TRACK
    | SourceType.EPISODE
    | SourceType.PODCAST
    | SourceType.RECOMMENDED
    | SourceType.PLAYLIST
    | SourceType.ARTIST
    | SourceType.ALBUM


type NonGenerics =
    | SourceType.STATION
    | SourceType.RECOMMENDED
    | SourceType.UNKNOWN

interface SourceDetailsGenericWithColor extends SourceDetailsBase {
    type: GenericsWithColor,
    uri: string,
    colors: Promise<ExtractedColors>
}

interface SourceDetailsGenericWithoutColor extends SourceDetailsBase {
    type: Exclude<SourceType, GenericsWithColor | NonGenerics>,
    uri: string
}

type SourceDetailsGeneric = SourceDetailsGenericWithColor | SourceDetailsGenericWithoutColor

export type SourceDetails = SourceDetailsSubsource | SourceDetailsUnknown | SourceDetailsGeneric

export interface SafeSourceDetails {
    type: SourceType,
    subType?: SourceType,

    uri?: string,
    subUri?: string,

    name: MetadataValues,
    nameFetched: boolean,

    img: MetadataValues,
    imgFetched: boolean,

    link: string,

    colors: ExtractedColors,
    colorsFetched: boolean
}

const sourcesWithoutMeaningfulMetadata = new Set([
    SourceType.TRACK,
    SourceType.EPISODE,
    SourceType.RECENT_SEARCHED,
    SourceType.RECOMMENDED_NO_SOURCE,
    SourceType.AD,
    SourceType.USER_TOP_TRACKS,
    SourceType.LIKED_SONGS,
    SourceType.QUEUE,
    SourceType.LOCAL_FILES,
    SourceType.UNKNOWN,
])

const sourcesWithColor = new Set([
    SourceType.TRACK,
    SourceType.EPISODE,
    SourceType.PODCAST,
    SourceType.RECOMMENDED,
    SourceType.PLAYLIST,
    SourceType.ARTIST,
    SourceType.ALBUM,
    SourceType.STATION
])

// Redirect to radio
const subtypeSourceGenerator: LinkGenerator = (ctx: SourceInfo) => ctx.uri

const presetSourceLinkGenerators = {
    [SourceType.RECOMMENDED]: subtypeSourceGenerator,
    [SourceType.RECOMMENDED_NO_SOURCE]: undefined,
    //[SourceType.SEARCH]: (ctx: SourceInfo) => () => ctx.uri,
    //[SourceType.RECENT_SEARCHED]: "/search",
    //[SourceType.STATION]: subtypeSourceGenerator,
    [SourceType.AD]: undefined,
    [SourceType.QUEUE]: "/queue",
}

export function getSourceDetails(context: SourceInfo): SourceDetails {
    const detailsTargetUri = context.type == SourceType.STATION ? context.subUri : context.uri
    const metadata = detailsTargetUri && !sourcesWithoutMeaningfulMetadata.has(context.type) ? getUriMetadata(detailsTargetUri) : undefinedMetadata

    //@ts-ignore
    return {
        type: context.type,
        uri: context.uri,
        
        name: metadata.name,
        img: metadata.img,
        link: context.type in presetSourceLinkGenerators
            ? (() => {
                const link = presetSourceLinkGenerators[context.type as keyof typeof presetSourceLinkGenerators]
                return typeof link === "function" ? link(context) : link
            })()
            : fromPlaybar,

        ...("subType" in context ? {
            subType: context.subType,
            subUri: context.subUri,
        } : {}),

        ...(detailsTargetUri && sourcesWithColor.has(context.type) ? {
            colors: Spicetify.colorExtractor(detailsTargetUri).catch(() => {}),
        } : {}),
    }
}

// Wraps sourcedetails in a promise that resolves to a safe sourcedetails
// the callback is called every time the sourcedetails change
export function wrapSafeSourceDetails(details: SourceDetails, callback: (arg0: SafeSourceDetails) => void): void {
    const safeDetails = {
        ...details,

        name: undefined,
        nameFetched: false,

        img: undefined,
        imgFetched: false,

        ...("colors" in details ? {
            colors: undefined,
            colorsFetched: false,
        } : {})
    }

    callback(safeDetails)

    details.name.then(resolvedName => {
        safeDetails.name = resolvedName
        safeDetails.nameFetched = true
        callback(safeDetails)
    })

    details.img.then(resolvedImg => {
        safeDetails.img = resolvedImg
        safeDetails.imgFetched = true
        callback(safeDetails)
    })

    details.colors?.then(resolvedColors => {
        safeDetails.colors = resolvedColors
        safeDetails.colorsFetched = true
        callback(safeDetails)
    })
}