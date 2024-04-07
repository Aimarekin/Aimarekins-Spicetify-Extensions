export function chance(chance: number): boolean {
	if (chance <= 0) {
		return false
	}
	else if (chance >= 1) {
		return true
	}
	else {
		return Math.random() < chance
	}
}

export function randomInt(min: number, max: number): number {
	return Math.round(randomFloat(Math.round(min), Math.round(max)))
}

export function randomFloat(min: number, max: number): number {
	if (min > max) {
		throw new Error("min must be less than or equal to max")
	}
	else if (min === max) {
		return min
	}
	else {
		return Math.random() * (max - min) + min
	}
}