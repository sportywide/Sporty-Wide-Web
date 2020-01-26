export function toHashMap(arr: string[]) {
	const keyMap: Record<string, boolean> = {};
	for (const element of arr) {
		keyMap[element] = true;
	}
	return keyMap;
}
