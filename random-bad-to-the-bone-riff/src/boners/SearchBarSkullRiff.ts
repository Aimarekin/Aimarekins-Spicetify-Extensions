import { playSingleRiff, playRiff } from "../badToTheBonePlayer"
import { waitForElm } from "../DOMWatcher";
import countCharacterOcurrences from "../util/countCharacterOcurrences"
import initializedWithGetterHandler from "./handlers/initializedWithGetterHandler";

const SEARCH_ROUTE_REGEX = /^\/search(\/.*)?/

const PAGE_ROOT_SELECTOR = ".Root__main-view"
const SEARCH_BAR_SELECTOR = ".x-searchInput-searchInputInput"

const SKULL_EMOJI = "💀"

export function searchBarSkullRiff(boneLevel: number) {
	if (boneLevel >= 0.2) {
		playRiff(boneLevel)
	}
	else if (boneLevel > 0) {
		playSingleRiff()
	}
}

export default function searchBarSkullRiffHandler(): (boneLevel: number) => void {
	return initializedWithGetterHandler((getBoneLevel: () => number) => {
		let currentlyInSearchPage = false
		let canceller: (() => void) | undefined

		const scanLoc = (loc: string) => {
			if (SEARCH_ROUTE_REGEX.test(loc)) {
				if (currentlyInSearchPage) {
					return
				}

				currentlyInSearchPage = true
				const abortController = new AbortController()

				canceller = () => abortController.abort

				waitForElm(SEARCH_BAR_SELECTOR, document.querySelector(PAGE_ROOT_SELECTOR) as HTMLElement, { signal: abortController.signal }).then((el) => {
					const countSkullEmojis = () => countCharacterOcurrences((el as HTMLInputElement).value, SKULL_EMOJI)

					let skullEmojiCount = countSkullEmojis()

					const skullTextObserver = new MutationObserver(() => {
						const thisCount = countSkullEmojis()

						if (thisCount > skullEmojiCount) {
							searchBarSkullRiff(getBoneLevel())
						}

						skullEmojiCount = thisCount
					})

					skullTextObserver.observe(el, { attributeFilter: ["value"] })

					canceller = () => skullTextObserver.disconnect()
				})
			} else {
				currentlyInSearchPage = false

				if (canceller) {
					canceller()
					canceller = undefined
				}
			}
		}

		scanLoc(Spicetify.Platform.History.location.pathname)

		Spicetify.Platform.History.listen((loc) => scanLoc(loc.pathname))
	})
}