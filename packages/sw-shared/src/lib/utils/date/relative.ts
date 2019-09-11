import { isBefore, isEqual, isAfter } from 'date-fns';

export function isBeforeOrSame(date1, date2) {
	return isBefore(date1, date2) || isEqual(date1, date2);
}

export function isAfterOrSame(date1, date2) {
	return isAfter(date1, date2) || isEqual(date1, date2);
}
