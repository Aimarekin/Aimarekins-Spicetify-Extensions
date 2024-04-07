import wait from "wait"

export default async function pollCondition(condition: () => boolean, interval: number = 100) {
	while (!condition()) {
		await wait(interval)
	}
}