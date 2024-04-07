export default function setTimeoutGetCanceller<T extends any[]>(func: (...args: T) => void, timeout: number, ...args: T): () => boolean {
	let pending = true
	const timeoutId = setTimeout(() => {
		pending = false
		func(...args)
	}, timeout)

	return () => {
		if (!pending) {
			return false
		}

		pending = false
		clearTimeout(timeoutId)
		return true
	}
}