import soundEffect from "./soundEffect"
import { chance, randomInt, randomFloat } from "./util/RandomUtil"

import badToTheBoneRiff from "./assets/badToTheBoneRiff.ogg"

const CUTOFF_CHANCE = 7 / 30
const CUTOFF_RANGE = [0.1, 0.9] as const

const SPAM_LENGTH = [3, 30] as const
const SPAM_DELAY_MS = [10, 500] as const

const badToTheBoneRiffSFPromise = soundEffect(badToTheBoneRiff)
badToTheBoneRiffSFPromise.catch((reason) => {
	console.error("Failed to load bad to the bone riff", reason)
})

export function playSingleRiff() {
	badToTheBoneRiffSFPromise.then(([badToTheBoneRiffSF, badToTheBoneRiffAudio]) => {
		const stopRiff = badToTheBoneRiffSF()

		if (chance(CUTOFF_CHANCE)) {
			setTimeout(() => {
				stopRiff()
			}, badToTheBoneRiffAudio.duration * randomFloat(...CUTOFF_RANGE) * 1000)
		}
	})
}

export function playSpamRiff() {
	const length = randomInt(...SPAM_LENGTH)

		let i = 0
		const riffSpamStep = () => {
			i++
			playSingleRiff()

			if (i < length) {
				setTimeout(riffSpamStep, randomInt(...SPAM_DELAY_MS))
			}
		}
		riffSpamStep()
}

export function playRiff(boneLevel: number) {
	const spamChance = boneLevel <= 0.5 ? (boneLevel - 0.1) * (1 / 32) : Math.pow(boneLevel - 0.5, 2) + (1 / 80)

	if (chance(spamChance)) {
		playSpamRiff()
	}
	else {
		playSingleRiff()
	}
}