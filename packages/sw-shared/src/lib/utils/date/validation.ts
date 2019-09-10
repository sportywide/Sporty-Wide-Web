export function isValidDate(date) {
	return date && date instanceof Date && !isNaN(date.getTime());
}
