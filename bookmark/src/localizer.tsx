export type SupportedLangs = "en" | "es"

import en from "./loc/en.json"
import es from "./loc/es.json"

const fallbackLang = "en"
export const stringStorage: { [lang in SupportedLangs]: { [key:string]: string}} = {
	en: en,
	es: es
}

export function translate(key: string, fallbackToKey = true, locale?: SupportedLangs): string | null {
  locale = locale || Spicetify.Locale.getLocale() as SupportedLangs;

  if (stringStorage[locale]) {
    return stringStorage[locale][key] || (fallbackToKey ? key : null);
  } else {
    return translate(key, fallbackToKey, fallbackLang);
  }
}