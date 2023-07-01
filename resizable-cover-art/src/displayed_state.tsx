import { SourceType } from "./context"
import { MetadataValues } from "./metadata"
import { ExtractedColors, SafeSourceDetails } from "./source_details"
import { Translate } from "./localizer"

export interface DisplayedState {
    type: SourceType,
    subType?: SourceType,

    header: string,

    name?: string,
    nameFetching: boolean,
    hasName: boolean,

    img?: string,
    imgFetching: boolean,
    hasImg: boolean,

    mainColor?: string,
    colorVariables?: { [key: string]: string },
    colorsFetching: boolean,
    haveColorVariables: boolean,

    link?: string
}

export function safeDetailsToDisplayedState(details: SafeSourceDetails): DisplayedState {
    return {
        type: details.type,
        subType: details.subType,

        header: details.name ?? Translate("playing_UNKNOWN"),

        name: details.name === null ? Translate("unknown") : details.name,
        nameFetching: details.nameFetched === false,
        hasName: !details.nameFetched || details.name !== undefined,

        img: details.img ?? undefined,
        imgFetching: details.imgFetched === false,
        hasImg: !details.imgFetched || details.img !== undefined,

        mainColor: details.colors?.undefined,
        colorVariables: details.colors ? (() => {
            let result: { [key: string]: string } = {}
            for (const k in details.colors) {
                if (k !== "undefined") {
                    result[k] = details.colors[k as keyof ExtractedColors]
                }
            }
            return result
        })() : {},
        colorsFetching: details.colorsFetched === true,
        haveColorVariables: !details.colorsFetched || details.colors !== undefined,

        link: details.link
    }
}