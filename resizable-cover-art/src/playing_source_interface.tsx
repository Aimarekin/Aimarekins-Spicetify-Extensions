import { DisplayedState } from "./displayed_state"

export type PlayingSourceInterface = HTMLDivElement

const formatForCSSClass = (str:string) => str.replace("_", "-").toLowerCase()

export function createInterface(classContext: string[]) {
    const onImageLoad = (e: any) => e.target.classList.add("main-image-loaded")

    return (
    <div className={`playing-source-container playing-source-v2 ${
        classContext.map((c) => "playing-source-context-" + c).join(" ")
    }`}>
        <div className="playing-source">
            <a className="playing-source-header">...</a>
            <a className="playing-source-source-container-link">
                <div className="playing-source-source-container">
                    <div className="playing-source-source-image-container">
                        <img
                            className="playing-source-source-image main-image-image main-image-loading"
                            alt=""
                            onLoad={onImageLoad}
                        />
                    </div>
                    <span className="playing-source-source-name">...</span>
                </div>
            </a>
        </div>
    </div>
    ) as unknown as PlayingSourceInterface
}


export function UpdateInterface(display: PlayingSourceInterface, displayedState: DisplayedState){
    // Remove previous type classes
    const classList = display.classList.forEach(className => {
        if(className.startsWith("playing-source-type-")){
            display.classList.remove(className)
        }
    })

    // Add new type classes
    const typeClassName = formatForCSSClass(displayedState.type)
    display.classList.add("playing-source-type-" + typeClassName, "playing-source-type-main-" + typeClassName)
    if(displayedState.subType){
        const subTypeClassName = formatForCSSClass(displayedState.subType)
        display.classList.add("playing-source-type-" + subTypeClassName, "playing-source-type-subtype-" + subTypeClassName)
    }

    // Add colors
    if (displayedState.haveColorVariables && !displayedState.colorsFetching) {
}

/* const [imageLoaded, setImageLoaded] = react.useState(false)

    function onImageLoad() {
        setImageLoaded(true)
    }

    let colors: Record<string, string> = {}
    if (displayedState.haveColorVariables && !displayedState.colorsFetching) {
        colors["--extracted-entity-color"] = displayedState.mainColor!

        for (const k in displayedState.colorVariables) {
            colors["--extracted-entity-color-" + formatForCSSClass(k)] = displayedState.colorVariables[k]
        }
    }

    return (
    <div className={`playing-source-container playing-source-v2 ${
            "playing-source-type-" + formatForCSSClass(displayedState.type)
        } ${
            displayedState.subType ? "playing-source-subtype-" + formatForCSSClass(displayedState.subType) : ""
        } ${
            displayedState.hasName ? "playing-source-has-name" : ""
        } ${
            displayedState.hasImg ? "playing-source-has-image" : ""
        } ${
            displayedState.haveColorVariables ? "playing-source-has-colors" : ""
        } ${
            displayedState.colorsFetching ? "playing-source-fetching" : ""
        } ${
            classContext.map((c) => "playing-source-context-" + c).join(" ")
        }`}
        style={colors}
        >
        <div className="playing-source">
            <a className="playing-source-header" href={displayedState.link}>{displayedState.header}</a>
            <a className="playing-source-source-container-link" href={displayedState.link}>
                <div className="playing-source-source-container">
                    <div className="playing-source-source-image-container">
                        <img
                            className={`playing-source-source-image main-image-image main-image-loading ${
                                imageLoaded ? "main-image-loaded" : ""
                            } ${
                                displayedState.imgFetching ? "playing-source-fetching" : ""
                            }`}
                            alt=""
                            src={displayedState.img}
                            onLoad={onImageLoad}
                        />
                    </div>
                    <span className={`playing-source-source-name ${displayedState.nameFetching ? "playing-source-fetching": ""}`}>{displayedState.name}</span>
                </div>
            </a>
        </div>
    </div>
    ) */