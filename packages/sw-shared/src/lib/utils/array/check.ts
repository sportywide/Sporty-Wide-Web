export function isEmptyValuesArray(arr) {
	return !arr.filter(val => val).length;
}
