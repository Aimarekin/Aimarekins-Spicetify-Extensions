import { playRiff } from "../badToTheBonePlayer"
import { chance } from "../util/RandomUtil"
import initializedWithGetterHandler from "./handlers/initializedWithGetterHandler"

export function riffOnSongStartChance(boneLevel: number): boolean {
	return chance(boneLevel <= 0.5 ? boneLevel * (2 / 30) : 3 * Math.pow(boneLevel - 0.2, 2) - (17 / 300))
}

export default function riffOnSongStartHandler(): (newBoneLevel: number) => void {
	return initializedWithGetterHandler((getBoneLevel: () => number) => {
		Spicetify.Player.addEventListener("songchange", () => {
			if (riffOnSongStartChance(getBoneLevel())) {
				playRiff(getBoneLevel())
			}
		})
	})
}