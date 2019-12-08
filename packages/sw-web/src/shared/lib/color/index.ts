export function getRatingColor(rating: number): any {
	if (rating >= 90) {
		return 'red';
	} else if (80 <= rating && rating < 90) {
		return 'blue';
	} else if (70 <= rating && rating < 80) {
		return 'green';
	}
	return 'yellow';
}
export function getPositionColor(position: string): any {
	const map: { [name: string]: string } = {
		GK: 'red',
		CM: 'green',
		LM: 'green',
		RM: 'green',
		ST: 'blue',
	};
	return map[position] || 'blue';
}
