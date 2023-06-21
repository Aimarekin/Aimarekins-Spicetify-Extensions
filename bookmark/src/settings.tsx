import { SettingsSection } from "spcr-settings"
import { translate } from "./localizer"

export const settings = new SettingsSection(translate("bookmark"), "bookmark-settings", {
    "show-bookmark-button": {
        type: "toggle",
        description: translate("show-bookmark-button"),
        defaultValue: true,
        events: {
            "onChange": () => {
                // TODO
            }
        }
    },
    "bookmark-playlist-uri": {
        type: "input",
        description: translate("bookmark-playlist-uri"),
        defaultValue: "",
        events: {
            "onChange": () => {
                // TODO
            }
        }
    }
})

// Though this is a promise, it is not awaited as values are instantly loaded
settings.pushSettings()