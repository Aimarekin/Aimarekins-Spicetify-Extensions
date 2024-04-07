import { chance, randomInt } from "../util/RandomUtil"
import { playSingleRiff } from "../badToTheBonePlayer"
import chanceEveryHandler from "./handlers/chanceEveryHandler"

import skullGearShifter from "../assets/skullGearShifter.png"

const skullGearShiftElement = document.createElement("img")
skullGearShiftElement.src = skullGearShifter

export function skullGearShiftPopup() {
	Spicetify.PopupModal.display({
		title: "💀",
		content: skullGearShiftElement,
		isLarge: true
	})
	playSingleRiff()
}

export function getSkullGearShiftPopupChance(boneLevel: number): boolean {
	return chance(0.25 * Math.pow(boneLevel, 2) - 0.25 * Math.pow(0.5, 2))
}

export function getSkullGearShiftPopupStepTime(): number {
	return randomInt(10000, 20000)
}

export default function skullGearShiftPopupHandler(): (newBoneLevel: number) => void {
	return chanceEveryHandler({
		body: skullGearShiftPopup,
		bodyChance: getSkullGearShiftPopupChance,
		getTimeoutTime: getSkullGearShiftPopupStepTime,
	})
}