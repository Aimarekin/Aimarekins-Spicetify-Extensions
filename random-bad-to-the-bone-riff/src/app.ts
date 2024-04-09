
import waitPolledCondition from "wait-polled-condition"
import initializeBoners from "./boners"

waitPolledCondition([
	() => window.Spicetify,
	() => Spicetify.Player,
	() => Spicetify.showNotification
]).then(async () => {
	const updateBonerLevel = initializeBoners()
	
	// TODO: Allow configuration
	updateBonerLevel(0.5)
})