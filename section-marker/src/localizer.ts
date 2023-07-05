import i18next from "i18next"
export { i18next }

import { resources } from "./loc"

i18next.init({
    debug: true,
    lng: Spicetify.Locale.getLocale(),
    resources: resources
})
console.log(i18next)

export const t = i18next.t