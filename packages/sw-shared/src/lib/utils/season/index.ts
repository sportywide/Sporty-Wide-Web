import { startOfDay } from 'date-fns';

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

export function getSeasonRange(date = new Date()) {
	const month = date.getUTCMonth();
	if (month < 8) {
		const start = new Date(date);
		start.setUTCFullYear(date.getUTCFullYear() - 1, 7, 1);
		const end = new Date(date);
		end.setUTCFullYear(date.getUTCFullYear(), 8, 1);

		return [startOfDay(start), startOfDay(end)];
	} else {
		const start = new Date(date);
		start.setUTCFullYear(date.getUTCFullYear(), 7, 1);
		const end = new Date(date);
		end.setUTCFullYear(date.getUTCFullYear() + 1, 7, 1);

		return [startOfDay(start), startOfDay(end)];
	}
}
