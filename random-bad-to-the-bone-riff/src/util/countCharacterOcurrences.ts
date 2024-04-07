export default function countCharacterOcurrences(str: string, char: string) {
	let count = 0;
	for (const c of str) {
		if (c === char) {
			count++;
		}
	}
	return count;
}