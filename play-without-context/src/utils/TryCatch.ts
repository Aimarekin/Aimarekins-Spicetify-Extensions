export function tryCatch<A extends unknown[], R>(
	fn: (...args: A) => R,
	...args: A
): [hasErrored: true, returned: R] | [hasErrored: false, error: unknown] {
	try {
		return [true, fn(...args)]
	} catch (e) {
		return [false, e]
	}
}

export function tryCatchLog<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): ReturnType<typeof tryCatch> {
	const result = tryCatch(fn, ...args)

	if (!result[0]) {
		console.error(result[1])
	}

	return result
}