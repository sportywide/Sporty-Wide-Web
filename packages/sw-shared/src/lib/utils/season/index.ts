export function isInSeason(date: Date, season: string) {
	const [start, end] = getSeasonYears(season);
	const month = date.getMonth();
	const year = date.getFullYear();
	return (month >= 7 && year === start) || (month <= 4 && year === end);
}

export function getSeason(date: Date) {
	const month = date.getMonth();
	const year = date.getFullYear();
	if (month >= 7) {
		return [year, year + 1].join('-');
	} else if (month <= 4) {
		return [year - 1, year].join('-');
	}
	return null;
}
export function getSeasonYears(season: string) {
	return season.split('-').map(num => parseInt(num, 10));
}
