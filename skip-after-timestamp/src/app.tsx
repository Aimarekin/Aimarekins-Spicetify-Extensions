// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, createFragment } from "./jsx"
import { Translate } from "./localizer"
import { waitForElm, getPercentageClickedOn } from "./util"
import { formatTime, formatPercentage, parseTime, parsePercentage } from "./string_representations"
import { SettingsSection } from "spcr-settings";
import "./format_unicorn"
import "./style.scss"

// Pixels
const DRAG_THRESHOLD = 8
// Milliseconds
const MINIMUM_SKIP_DURATION = 1 * 1000

const distancePoints = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

async function main() {
	while (!Spicetify?.Player || !Spicetify?.Locale || !Spicetify?.showNotification || !Spicetify?.CosmosAsync) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	// We have to detect when the track is seeked
	// so as to not skip the track when the user seeks
	// Bind to CosmosAsync updates

	Spicetify.CosmosAsync.sub("sp://player/v2/main", (state) => {
		if (state.playback_id !== Spicetify.Player.data.playback_id) return

		const progress = state.position_as_of_timestamp
		if (progress === undefined || progress < MINIMUM_SKIP_DURATION) return

		if (progress >= skipAfterDuration()) {
			setSkipThisPlayback(false)
		}
	})


	// Add the settings section
	const settings = new SettingsSection(Translate("skip_after_timestamp"), "skip-after-timestamp", {
		"percentage-mode": {
			type: "toggle",
			description: Translate("percentage_mode_setting"),
			defaultValue: false,
			events: {
				"onChange": () => {
					setPercentageModeTranslated(settings.getFieldValue("percentage-mode"), true)
				}
			}
		}
	})
	await settings.pushSettings()

	// Watch for creation of the playback bar
	const playbackBar = await waitForElm(".playback-progressbar")

	// Create the marker
	const marker = (
		<div className="skip-after-timestamp-marker">
			<div className="skip-after-timestamp-container">
				<button className="skip-after-timestamp-button" type="button">
				</button>
			</div>
		</div>
	) as unknown as HTMLDivElement
	document.body.appendChild(marker)

	// Set the CSS variables for remaining relative to the playback bar
	const observedProperties = ["left", "top", "right", "bottom"]
	const cachedValues = Array(observedProperties.length).fill(null)
	function updatePlaybackVariables() {
		const playbackBarRect = playbackBar.getBoundingClientRect()

		for (const [i, prop] of observedProperties.entries()) {
			const value = playbackBarRect[prop]
			if (value === cachedValues[i]) continue
			marker.style.setProperty("--skip-after-timestamp-playback-" + prop, value + "px")
			cachedValues[i] = value
		}

		requestAnimationFrame(updatePlaybackVariables)
	}
	updatePlaybackVariables()

	// Add marker click events
	marker.addEventListener("mousedown", (e) => {
		// From here, the user might either
		// lift the mouse to interact with the marker
		// or begin dragging it

		const initialX = e.clientX
		const initialY = e.clientY

		function markerClick(e: MouseEvent) {
			// Stop listening to movement
			window.removeEventListener("mousemove", mouseMove)

			// If the click was inside the marker, handle it
			if (!marker.contains(e.target as Node)) return

			e.preventDefault()

			if (e.button === 0) {
				// Deactivate skipping
				disableSkipAfter(true)
	
				Spicetify.showNotification(Translate("disabled_auto_skip"))
				marker.classList.remove("skip-after-timestamp-active")
			}
			// Right click
			else if (e.button === 2) {
				// Toggle skipping the track
				setSkipThisPlayback(!shouldSkipThisPlayback(), true)
			}
		}

		function mouseMove(e: MouseEvent) {
			// If the mouse has moved far enough, start dragging
			if (distancePoints(initialX, initialY, e.clientX, e.clientY) > DRAG_THRESHOLD) {
				beginDrag(e)
				window.removeEventListener("mouseup", markerClick)
				window.removeEventListener("mousemove", mouseMove)
			}
		}

		window.addEventListener("mouseup", markerClick, { once: true })
		window.addEventListener("mousemove", mouseMove)
	})

	const TippyProps = {
		...Spicetify.TippyProps,
		interactive: true,
		interactiveBorder: 30
	}
	// Create a tooltip showing the timestamp the marker is set to
	const markerTooltip = Spicetify.Tippy(marker, TippyProps)
	const markerInput = (<input className="skip-after-timestamp-input" type="text"/>) as unknown as HTMLInputElement
	markerTooltip.popper.querySelector(".main-contextMenu-tippy").appendChild(markerInput)

	// Listen to marker input
	markerInput.addEventListener("focusout", (e) => {
		const value = markerInput.value
		if (value === "") return

		// Visually reset the input box
		markerInput.value = formattedSkipAfter()

		// First, attempt to parse as the current mode
		let parsed = isPercentageMode() ? parsePercentage(value) : parseTime(value)
		let parseAsPercentage = isPercentageMode()

		if (parsed === null) {
			// If that fails, try the other mode
			parseAsPercentage = !parseAsPercentage
			parsed = isPercentageMode() ? parseTime(value) : parsePercentage(value)
		}

		// If parsing failed, or the parsed value is visually the same, cancel
		if (parsed === null || (parseAsPercentage ? formatPercentage(parsed) : formatTime(parsed)) === formattedSkipAfter()) return
		
		(parseAsPercentage ? setSkipAfterPercentage : setSkipAfterDuration)(parsed, true)
	})
	// Lose focus when enter is pressed
	markerInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			markerInput.blur()
		}
	})

	// Utility functions
	const formattedSkipAfter = () => isPercentageMode() ? formatPercentage(skipAfterPercentage()) : formatTime(skipAfterDuration())
	const timeToPercentage = (duration: number, totalTime = Spicetify.Player.getDuration()) => duration / totalTime
	const percentageToTime = (percentage: number, totalTime = Spicetify.Player.getDuration()) => percentage * totalTime


	let _skipAfterEnabled: boolean
	let _skipThisPlayback: boolean
	let _isPercentageMode: boolean
	let _skipAfterDuration: number
	let _skipAfterPercentage: number

	const isSkipAfterEnabled = () => _skipAfterEnabled === true
	const shouldSkipThisPlayback = () => _skipThisPlayback === true
	const isPercentageMode = () => _isPercentageMode === true
	const skipAfterDuration = () => isPercentageMode() ? percentageToTime(_skipAfterPercentage) : _skipAfterDuration
	const skipAfterPercentage = () => isPercentageMode() ? _skipAfterPercentage : timeToPercentage(_skipAfterDuration)

	function disableSkipAfter(notify: boolean = false) {
		if (!isSkipAfterEnabled()) return

		// Deactivate skipping
		_skipAfterEnabled = false
		// Reset "skip this playback" state
		setSkipThisPlayback(true)

		marker.classList.remove("skip-after-timestamp-active")

		if (notify) {
			Spicetify.showNotification(Translate("disabled_auto_skip"))
		}
	}

	function showSkipNotification(justEnabledSkipThis: boolean = false) {
		const prefix = justEnabledSkipThis ? "this" : shouldSkipThisPlayback() ? "will" : "future"

		if (isPercentageMode()) {
			Spicetify.showNotification(Translate(prefix + "_skip_after_percentage").formatUnicorn(formatPercentage(skipAfterPercentage())))
		}
		else {
			Spicetify.showNotification(Translate(prefix + "_skip_after_time").formatUnicorn(formatTime(skipAfterDuration())))
		}
	}

	function setSkipAfterDuration(duration: number, notify: boolean = false) {
		if (!isPercentageMode() && duration === skipAfterDuration()) return

		markerTooltip.hide()
		marker.classList.add("skip-after-timestamp-active")

		marker.classList.add("skip-after-timestamp-duration-mode")
		marker.classList.remove("skip-after-timestamp-percentage-mode")

		// Enable skip, set mode to duration and set the duration
		_skipAfterEnabled = true
		setPercentageMode(false)
		_skipAfterDuration = duration
		updateMarkerProgress()

		// Disable skipping the current track if it'd result in an instant skip
		if (hasPassedSkipTime()) setSkipThisPlayback(false)

		const shownTime = formatTime(duration)
		if (notify) {
			showSkipNotification()
		}

		markerInput.value = formatTime(duration)
	}

	function setSkipAfterPercentage(percentage: number, notify: boolean = false) {
		if (isPercentageMode() && percentage === skipAfterPercentage()) return

		markerTooltip.hide()
		marker.classList.add("skip-after-timestamp-active")

		marker.classList.remove("skip-after-timestamp-duration-mode")
		marker.classList.add("skip-after-timestamp-percentage-mode")

		// Enable skip, set mode to percentage and set the percentage
		_skipAfterEnabled = true
		setPercentageMode(true)
		_skipAfterPercentage = percentage
		updateMarkerProgress()

		// Disable skipping the current track if it'd result in an instant skip
		if (hasPassedSkipTime()) setSkipThisPlayback(false)

		const shownPercentage = formatPercentage(percentage)
		if (notify) {
			showSkipNotification()
		}

		markerInput.value = formatPercentage(percentage)
	}

	const setSkipAfter = (percentage: number, notify = false) =>
		isPercentageMode()
		?
		setSkipAfterPercentage(percentage, notify)
		:
		setSkipAfterDuration(percentageToTime(percentage), notify)

	function setSkipThisPlayback(skip: boolean, notify: boolean = false) {
		if (skip === _skipThisPlayback) return
		_skipThisPlayback = skip

		marker.classList[skip ? "remove" : "add"]("skip-after-timestamp-dont-skip-this-playback")

		if (notify) {
			if (skip) {
				showSkipNotification(true)
			}
			else {
				Spicetify.showNotification(Translate("disabled_once"))
			}
		}
	}

	function setPercentageMode(percentageMode: boolean, notify: boolean = false) {
		if (percentageMode === isPercentageMode()) return

		_isPercentageMode = percentageMode
		settings.setFieldValue("percentage-mode", percentageMode)
		marker.classList[percentageMode ? "add" : "remove"]("skip-after-timestamp-percentage-mode")

		if (notify && isSkipAfterEnabled()) showSkipNotification()
	}

	function setPercentageModeTranslated(percentageMode: boolean, notify: boolean = false) {
		if (percentageMode === isPercentageMode()) return

		if (isSkipAfterEnabled()) {
			if (percentageMode) {
				setSkipAfterPercentage(skipAfterPercentage(), notify)
			}
			else {
				setSkipAfterDuration(skipAfterDuration(), notify)
			}
		}
		else {
			setPercentageMode(percentageMode, notify)
		}
	}

	// Default values
	disableSkipAfter()
	setSkipThisPlayback(true)
	setPercentageMode(settings.getFieldValue("percentage-mode"))


	function updateMarkerProgress(percentage: number = skipAfterPercentage()) {
		marker.style.setProperty("--skip-after-timestamp-set", percentage.toString())
		marker.classList[percentage > 1 ? "add" : "remove"]("skip-after-timestamp-overflow")
	}

	const hasPassedSkipTime = () =>
		isPercentageMode()
		?
		Spicetify.Player.getProgressPercent() >= _skipAfterPercentage
		:
		Spicetify.Player.getProgress() >= _skipAfterDuration

	const shouldSkip = () =>
		isSkipAfterEnabled()
		&&
		shouldSkipThisPlayback()
		&&
		hasPassedSkipTime()
		&&
		Spicetify.Player.getProgress() > MINIMUM_SKIP_DURATION
		&&
		!isDragging


	let isDragging = false

	function beginDrag(e: MouseEvent) {
		// Refuse to drag if there is nothing playing
		if (!(Spicetify.Player.origin.getState().hasContext)) return

		if (isDragging) return
		isDragging = true

		// Disable tippy while dragging
		markerTooltip.disable()

		const updateProgress = (e: MouseEvent) =>
			marker.style.setProperty("--skip-after-timestamp-drag", getPercentageClickedOn(e, playbackBar).toString())

		marker.classList.add("skip-after-timestamp-dragging")
		updateProgress(e)

		window.addEventListener("mousemove", updateProgress)

		function mouseUpCallback(upE:MouseEvent) {
			if (upE.button !== e.button) return

			// Stop listening
			window.removeEventListener("mousemove", updateProgress)
			window.removeEventListener("mouseup", mouseUpCallback)
			isDragging = false

			// Re-enable tippy
			markerTooltip.enable()

			marker.classList.remove("skip-after-timestamp-dragging")
			let percentage = getPercentageClickedOn(upE, playbackBar)

			setSkipAfter(percentage, true)
		}

		window.addEventListener("mouseup", mouseUpCallback)
	}

	// Detect right click on the playback bar
	playbackBar.addEventListener("mousedown", (e: MouseEvent) => {
		if (e.button === 2) beginDrag(e)
	})

	let last_playback_id: string | undefined = undefined
	let isSkipping = false

	Spicetify.Player.addEventListener("onprogress", () => {
		if (!(Spicetify.Player.origin.getState().hasContext)) {
			disableSkipAfter()
			return
		}

		if (Spicetify.Player.data.playback_id !== last_playback_id) {
			last_playback_id = Spicetify.Player.data.playback_id
			setSkipThisPlayback(true)
			isSkipping = false
			updateMarkerProgress()
		}
		if (isSkipping) return

		if (shouldSkip()) {
			if (Spicetify.Player.isPlaying()) {
				isSkipping = true
				Spicetify.Player.next()
			}
			else {
				setSkipThisPlayback(false)
			}
		}
	})

	console.log("Loaded skip-after-timestamp")
}
	
export default main
