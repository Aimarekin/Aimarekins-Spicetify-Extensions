export type SupportedLangs = "en" | "es"

import en from "./loc/en.json"
import es from "./loc/es.json"

const fallbackLang = "en"
const stringStorage: { [lang in SupportedLangs]: { [key:string]: string}} = {
	en: en,
	es: es
}

export function Translate(key: string, locale?: SupportedLangs): string {
	locale = locale || Spicetify.Locale.getLocale() as SupportedLangs

	if (stringStorage[locale]) {
		return stringStorage[locale][key] || key
	} else {
		return Translate(key, fallbackLang)
	}
}