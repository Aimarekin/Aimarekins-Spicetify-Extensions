import wait from "wait"

type Promisable<T> = T | Promise<T>

export type ChanceEveryHandlerOptions = {
	body: (boneLevel: number) => (() => void) | void,
	bodyChance?: (boneLevel: number) => Promisable<boolean>,
	getTimeoutTime: (boneLevel: number) => Promisable<number>,
	mayRun?: (boneLevel: number) => Promisable<boolean>,
}

export default function chanceEveryHandler(options: ChanceEveryHandlerOptions): (newBoneLevel: number) => void {
	const { body, bodyChance, getTimeoutTime, mayRun } = options

	let boneLevel = 0
	let boneLevelUpdateIndex = 0

	const bonerBody = async () => {
		while (true) {
			const thisBoneLevelUpadeIndex = boneLevelUpdateIndex

			const hasCancelled = () => thisBoneLevelUpadeIndex !== boneLevelUpdateIndex

			const timeoutTime = await Promise.resolve(getTimeoutTime(boneLevel))

			if (hasCancelled()) {
				return
			}

			await wait(timeoutTime)

			if (hasCancelled()) {
				return
			}
			
			if (!mayRun || await Promise.resolve(mayRun(boneLevel))) {
				if (hasCancelled()) {
					return
				}
				if (!bodyChance || await Promise.resolve(bodyChance(boneLevel))) {
					if (hasCancelled()) {
						return
					}

					body(boneLevel)
				}
			}
		}
	}

	return (newBoneLevel: number) => {
		if (newBoneLevel === boneLevel) {
			return
		}

		boneLevel = newBoneLevel
		boneLevelUpdateIndex++

		bonerBody()
	}
}