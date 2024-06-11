export const formatTime = (ms: number) =>  Math.floor(ms / 60000) + ":" + Math.floor((ms % 60000) / 1000).toString().padStart(2, "0")


export const formatPercentage = (percentage: number, forCSS = false) =>
    `${forCSS ? percentage * 100 : Math.floor(percentage * 100)}%`


export const cleanNumber = (str: string) => str.trim().replace(",", ".")

export const parseDirtyFloat = (str: any) => (typeof str === "string") ? (str.match(/[^\d.]/) ? NaN : parseFloat(cleanNumber(str))) : NaN


export function parseTime(representation: string) {
    if (!representation || !representation.match(/\d/)) return null

    const times = representation.split(":")
    if (times.length > 3) return null

    const hours = times.length > 2 ? parseDirtyFloat(times[times.length - 3]) : 0
    const minutes = times.length > 1 ? parseDirtyFloat(times[times.length - 2]) : 0
    const seconds = parseDirtyFloat(times[times.length - 1])

    const res = (hours * 3600 + minutes * 60 + seconds) * 1000
    console.log("TIME", representation, res)
    return isNaN(res) ? null : res
}

export function parsePercentage(representation: string) {
    if (!representation || !representation.match(/\d/)) return null

    const res = parseDirtyFloat(representation.replace("%", "")) / 100
    console.log("PERCENT", representation, res)
    return isNaN(res) ? null : res
}