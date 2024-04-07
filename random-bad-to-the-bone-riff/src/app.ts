
import pollCondition from "./util/pollCondition"
import initializeBoners from "./boners"

pollCondition(() => [
	() => window.Spicetify,
	() => Spicetify.Player,
	() => Spicetify.showNotification
].every((fn) => fn())).then(async () => {
	const updateBonerLevel = initializeBoners()
	
	// TODO: Allow configuration
	updateBonerLevel(0.5)
})