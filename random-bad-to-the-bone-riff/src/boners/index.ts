import crazyOnBadToTheBoneHandler from "./CrazyOnBadToTheBone";
import playRiffRandomlyHandler from "./PlayRiffRandomly";
import queueBadToTheBoneHandler from "./QueueBadToTheBone";
import riffOnSongStartHandler from "./RiffOnSongStart";
import searchBarSkullRiffHandler from "./SearchBarSkullRiff";
import skullGearShiftPopupHandler from "./SkullGearShiftPopup";

const BONER_HANDLERS = [
	crazyOnBadToTheBoneHandler,
	playRiffRandomlyHandler,
	queueBadToTheBoneHandler,
	riffOnSongStartHandler,
	searchBarSkullRiffHandler,
	skullGearShiftPopupHandler
]

export default function initializeBoners(): (boneLevel: number) => void {
	let reporters: ((boneLevel: number) => void)[] | undefined

	return (boneLevel: number) => {
		console.log("hell yea brother... Bone level is now", boneLevel, "💀")

		if (!reporters) {
			reporters = BONER_HANDLERS.map((fn) => fn())
		}

		reporters.forEach((fn) => fn(boneLevel))
	}
}