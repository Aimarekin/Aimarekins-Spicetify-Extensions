import { playRiff } from "../badToTheBonePlayer"
import { chance, randomInt } from "../util/RandomUtil"
import chanceEveryHandler from "./handlers/chanceEveryHandler"

export function getPlayRiffRandomlyChance(boneLevel: number): boolean {
	if (chance(boneLevel <= 0.5 ? (boneLevel - 0.1) * (1 / 12) : 2 * Math.pow(boneLevel - 0.3, 3) + (13 / 750))) {
		return Spicetify.Player.isPlaying() || chance(2 * boneLevel - 1.2)
	}
	return false
}

export function getPlayRiffRandomlyStepTime(boneLevel: number): number {
	return randomInt(boneLevel <= 0.8 ? 1000 : 500, Math.max(1000, -40000 * boneLevel + 50000))
}

export default function playRiffRandomlyHandler(): (boneLevel: number) => void {
	return chanceEveryHandler({
		body: playRiff,
		bodyChance: getPlayRiffRandomlyChance,
		getTimeoutTime: getPlayRiffRandomlyStepTime,
	})
}