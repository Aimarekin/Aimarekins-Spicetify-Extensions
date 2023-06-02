import { createElement, createFragment } from "./jsx"
import { waitForElm } from "./DOM_watcher"

const previewingModal = (
    <div className="previewify-modal">
        <div className="previewify-modal__overhang" />
        <div className="previewify-modal__container">
            <img className="main-image-image previewify-modal__image" src="spotify:image:ab67616d0000b273a6eda16f17371a30534b4bba"/>
            <a className="previewify-modal__title">Shelter Song</a>
            <span className="previewify-modal__authors" />
            <div className="previewify-modal__controls">
                <button className="previewify-modal__controls__cancel"></button>
                <button className="previewify-modal__controls__next"></button>
            </div>
        </div>
    </div>
)

waitForElm(".Root__main-view .main-view-container").then((el) => el.appendChild(previewingModal))