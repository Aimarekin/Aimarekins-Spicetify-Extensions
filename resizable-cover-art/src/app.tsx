import { waitForElm, watchForElement } from "./DOM_watcher"
import { translate } from "./localizer"
import { SettingsSection } from "spcr-settings"
import "./style.scss"

async function main() {
	while (!Spicetify?.Player?.data || !Spicetify?.URI || !Spicetify?.Locale || !Spicetify?.CosmosAsync || !Spicetify?.React) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	const settings = new SettingsSection(translate("resizable-cover-art"), "resizable-cover-art-settings", {
		"cover-art-size": {
			type: "input",
			description: translate("cover-art-size"),
			defaultValue: "",
			events: {
				"onChange": () => {
					resizeCoverArt(settings.getFieldValue("cover-art-size") as string || null)
				}
			}
		},
		"resize-direction": {
			type: "dropdown",
			description: translate("resize-direction"),
			options: [
				"not-shown",
				"top-left",
				"top-right",
				"bottom-left",
				"bottom-right"
			],
			defaultValue: "top-right",
			events: {
				"onChange": () => {
					setHandlePosition(settings.getFieldValue("resize-direction") as string)
				}
			}
		}
	})

	settings.pushSettings()

	const MINIMUM_COVER_ART_SIZE = 50

	const handle = document.createElement("div")
	handle.classList.add("resizable-cover-art-handle")

	// Handle handle positioning
	const handlePositionClasses = {
		"not-shown": "resizable-cover-art-handle--not-shown",
		"top-left": "resizable-cover-art-handle--top-left",
		"top-right": "resizable-cover-art-handle--top-right",
		"bottom-left": "resizable-cover-art-handle--bottom-left",
		"bottom-right": "resizable-cover-art-handle--bottom-right"
	}
	function setHandlePosition(position: string) {
		for (const [key, value] of Object.entries(handlePositionClasses)) {
			handle.classList[position === key ? "add" : "remove"](value)
		}
	}

	// Handle resizing
	let lastSetSize: string | null | undefined
	function resizeCoverArt(size: string | null) {
		if (size === "") size = null
		lastSetSize = size
		console.log("SET SIZE", size)

		const coverArt = document.querySelector(".main-coverSlotExpanded-container")
		if (!(coverArt instanceof HTMLElement)) return

		if (size !== null) {
			document.body.classList.add("resizable-cover-art-changed-size")
			document.body.style.setProperty("--resizable-cover-art-set-size", size)
		}
		else {
			document.body.classList.remove("resizable-cover-art-changed-size")
			document.body.style.removeProperty("--resizable-cover-art-set-size")
		}

		console.log("DONE")
	}

	let dragOffsetX = 0
	let dragOffsetY = 0

	const RECT_POSITIONS: Record<string, { x: "right" | "left", y: "bottom" | "top" }> = {
		"top-left": {
			x: "right",
			y: "bottom"
		},
		"top-right": {
			x: "left",
			y: "bottom"
		},
		"bottom-left": {
			x: "right",
			y: "top"
		},
		"bottom-right": {
			x: "left",
			y: "top"
		}
	}

	function onDrag(ev: PointerEvent) {
		console.log("DRAG", ev)
		// Get where to drag from
		const resize_direction = settings.getFieldValue("resize-direction") as string

		const coverSlotExpanded = document.querySelector(".main-coverSlotExpanded-container") as HTMLElement
		if (!coverSlotExpanded) return
		console.log("COVER SLOT EXPANDED", coverSlotExpanded)
		const coverSlotExpandedRect = coverSlotExpanded.getBoundingClientRect()

		if (!(resize_direction in RECT_POSITIONS)) return
		console.log("RESIZE DIRECTION", resize_direction)

		const anchorX = RECT_POSITIONS[resize_direction].x
		const anchorY = RECT_POSITIONS[resize_direction].y

		const desiredSize = Math.max(
			Math.abs(ev.clientX + dragOffsetX - coverSlotExpandedRect[anchorX]),
			Math.abs(ev.clientY + dragOffsetY - coverSlotExpandedRect[anchorY]),
			MINIMUM_COVER_ART_SIZE
		)

		// Get what unit to use for resize
		// based on the current set one
		let unit = (settings.getFieldValue("cover-art-set-size") as string ?? "").match(/[\d.]+(.*)/)?.[1]
		if (!unit) unit = "px"

		// Resize and set settings
		// If the unit is a percentage, that's vmin
		let convertedSize = convertPixelsToUnit(desiredSize, unit, coverSlotExpanded)
		resizeCoverArt(`${convertedSize}${unit}`)
	}

	handle.addEventListener("pointerdown", () => {
		document.addEventListener("pointermove", onDrag)
		handle.classList.add("resizable-cover-art-handle--is-resizing")

		document.addEventListener("pointerup", () => {
			document.removeEventListener("pointermove", onDrag)
			handle.classList.remove("resizable-cover-art-handle--is-resizing")

			// Save settings
			settings.setFieldValue("cover-art-size", lastSetSize ?? "")
		}, { once: true })
	})

	handle.addEventListener("mouseup", (ev) => {
		if (ev.button !== 2) return

		// Reset size
		resizeCoverArt(null)
		settings.setFieldValue("cover-art-size", "")

		ev.preventDefault()
	})

	const expanded_container = await waitForElm(".i4nABk12gLqZuh9Jbdw1")

	watchForElement(".main-coverSlotExpanded-container", expanded_container, (el) => {
		const art_size = settings.getFieldValue("cover-art-size") as string || null
		const resize_direction = settings.getFieldValue("resize-direction") as string
		resizeCoverArt(art_size)

		// Set handle position
		el.appendChild(handle)
		setHandlePosition(resize_direction)
	})

	// Add settings listeners
	settingss
}
	
export default main
