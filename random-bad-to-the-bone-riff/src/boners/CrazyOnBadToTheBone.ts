import { chance, randomInt } from "../util/RandomUtil"
import isBadToTheBone from "../isBadToTheBone"
import chanceEveryHandler from "./handlers/chanceEveryHandler"
import { playRiff } from "../badToTheBonePlayer"

export function getCrazyOnBadToTheBoneChance(boneLevel: number) {
	return chance(boneLevel <= 0.2 ? 2 * boneLevel : boneLevel * (4 / 3) + (2 / 15))
}

export async function mayCrazyOnBadToTheBone() {
	return Spicetify.Player.isPlaying() && await isBadToTheBone(Spicetify.Player.data.item?.uri)
}

export function getCrazyOnBadToTheBoneStepTime() {
	return randomInt(500, 2000)
}

export default function crazyOnBadToTheBoneHandler(): (boneLevel: number) => void {
	return chanceEveryHandler({
		body: playRiff,
		bodyChance: getCrazyOnBadToTheBoneChance,
		getTimeoutTime: getCrazyOnBadToTheBoneStepTime,
		mayRun: mayCrazyOnBadToTheBone,
	})
}