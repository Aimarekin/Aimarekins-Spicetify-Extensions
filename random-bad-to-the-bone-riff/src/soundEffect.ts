export default async function soundEffect(url: string, initialPool = 5): Promise<[() => () => void, HTMLAudioElement]> {
	return new Promise((resolve, reject) => {
		const audio = new Audio(url);

		audio.addEventListener("canplaythrough", () => {
			const pool = Array.from({ length: initialPool }, () => audio.cloneNode() as HTMLAudioElement)
			resolve([
				() => {
					let createdAudio = pool.pop()
					if (!createdAudio) {
						createdAudio = audio.cloneNode() as HTMLAudioElement
					}

					let hasEnded = false

					const audioOnEnded = (ev: Event) => {
						hasEnded = true
						const audio = ev.target as HTMLAudioElement
						audio.removeEventListener("ended", audioOnEnded)
						pool.push(audio)
					}

					createdAudio.addEventListener("ended", audioOnEnded)
					createdAudio.play()

					return () => {
						if (!hasEnded) {
							hasEnded = true
							createdAudio.removeEventListener("ended", audioOnEnded)
							createdAudio.pause()
							createdAudio.currentTime = 0
							pool.push(createdAudio)
						}
					}
				},
				audio
			])
		})

		audio.addEventListener("error", reject)
	})
}