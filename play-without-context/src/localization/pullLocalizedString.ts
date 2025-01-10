import loc from "./loc.json"

const FALLBACK_LANG = "en"

export default function pullLocalizedString(localization: string) {
	return loc[localization] || loc[localization.split("-")[0]] || loc[FALLBACK_LANG]
}
