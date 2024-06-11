import i18next from "i18next"
export { i18next }

import translations from "translations"

i18next.init({
    debug: DEV,
    resources: translations
})

export const t = i18next.t