export default function initializedWithGetterHandler(body: (getBoneLevel: () => number) => void): (newBoneLevel: number) => void {
	let boneLevel = 0
	let getBoneLevel = () => boneLevel

	let hasInitialized = false

	return (newBoneLevel: number) => {
		boneLevel = newBoneLevel

		if (!hasInitialized) {
			hasInitialized = true
			body(getBoneLevel)
		}
	}
}