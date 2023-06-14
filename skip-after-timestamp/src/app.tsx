import { Translate } from "./localizer"
import { waitForElm, getPercentageClickedOn } from "./util"
import "./format_unicorn"
import "./style.scss"

type Promisable<T> = T | Promise<T>

async function main() {
	while (!Spicetify?.Player || !Spicetify?.Locale || !Spicetify?.showNotification || !Spicetify?.SVGIcons) {
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	// Watch for creation of the playback bar
	const playbackBar = await waitForElm(".playback-bar")

	// Create the marker
	const marker = <div className="skip-after-timestamp-marker">
		<div className="skip-after-timestamp-container">
			<button className="skip-after-timestamp-button" type="button">
				<svg className="skip-after-timestamp-skip-icon" role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16">
					<path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/>
				</svg>
			</button>
		</div>
	</div>
	console.log(marker)
	playbackBar.appendChild(marker)

	// Add marker click events
	marker.addEventListener("click", (e: MouseEvent) => {
		if (e.button !== 0) return

		e.stopImmediatePropagation()
		e.stopPropagation()
		e.preventDefault()

		// Deactivate skipping
		skipAfterEnabled = false
		dontSkipThisOne = false

		Spicetify.showNotification(Translate("disabled_auto_skip"))
		marker.classList.remove("skip-after-timestamp-active")
	})

	const TippyProps = {
		...Spicetify.TippyProps,
		delay : 0,
		content: "..."
	}
	// Create a tooltip showing the timestamp the marker is set to
	const markerTooltip = Spicetify.Tippy(marker, TippyProps)

	const formatTime = (ms: number) => `${
		Math.floor(skipAfterDuration / 60000)
	}:${
		Math.floor((skipAfterDuration % 60000) / 1000).toString().padStart(2, "0")
	}`
	const formatPercentage = (percentage: number) => `${Math.floor(percentage * 100)}%`

	let skipAfterEnabled = false
	let dontSkipThisOne = false
	let skipAfterPercentageMode = false
	// Percentage or timestamp in milliseconds
	let skipAfterDuration = 0

	function updateMarkerProgress(percentage: number) {
		marker.style.left = `${percentage * 100}%`
	}

	const shouldSkip = () =>
		skipAfterEnabled && !dontSkipThisOne &&
		(skipAfterPercentageMode ? Spicetify.Player.getProgressPercent() : Spicetify.Player.getProgress() ) >= skipAfterDuration

	playbackBar.addEventListener("mousedown", (e: MouseEvent) => {
		if (e.button !== 2) return

		// For now, deactivate skipping
		skipAfterEnabled = false

		// Begin listening to the mouse
		const updateProgress = (e:MouseEvent) => updateMarkerProgress(getPercentageClickedOn(e, playbackBar))
		marker.classList.add("skip-after-timestamp-dragging")
		updateProgress(e)

		window.addEventListener("mousemove", updateProgress)

		function mouseUpCallback(e:MouseEvent) {
			if (e.button !== 2) return

			e.preventDefault()
			e.stopPropagation()
			e.stopImmediatePropagation()

			// Stop listening
			window.removeEventListener("mousemove", updateProgress)
			window.removeEventListener("mouseup", mouseUpCallback)

			marker.classList.remove("skip-after-timestamp-dragging")
			marker.classList.add("skip-after-timestamp-active")
			skipAfterEnabled = true

			// Set the new skipAfterDuration
			let percentage = getPercentageClickedOn(e, playbackBar)
			updateMarkerProgress(percentage)

			if (skipAfterPercentageMode) {
				skipAfterDuration = percentage

				const shownPercentage = formatPercentage(percentage)
				Spicetify.showNotification(Translate("will_skip_after_percentage").formatUnicorn(shownPercentage))
				markerTooltip.setContent(shownPercentage)
			}
			else {
				skipAfterDuration = Spicetify.Player.getDuration() * percentage

				const shownTime = formatTime(skipAfterDuration)
				Spicetify.showNotification(Translate("will_skip_after_time").formatUnicorn(shownTime))
				markerTooltip.setContent(shownTime)
			}
		}


		window.addEventListener("mouseup", mouseUpCallback)
	})

	let last_playback_id: string | undefined = undefined
	let isSkipping = false

	Spicetify.Player.addEventListener("onprogress", () => {
		if (Spicetify.Player.data.playback_id !== last_playback_id) {
			last_playback_id = Spicetify.Player.data.playback_id
			dontSkipThisOne = false
			isSkipping = false
			updateMarkerProgress(skipAfterDuration / Spicetify.Player.getDuration())
		}
		if (isSkipping) return
		

		if (shouldSkip()) {
			console.log("Should skip!")
			if (Spicetify.Player.isPlaying()) {
				isSkipping = true
				Spicetify.Player.next()
			}
			else {
				dontSkipThisOne = true
			}
		}
	})

	console.log("Loaded skip-after-timestamp")
}
	
export default main
