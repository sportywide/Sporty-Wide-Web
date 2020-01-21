import { get } from 'lodash';
export function sortProperty<T>(array: Array<T>, property, compareFunc) {
	return array.sort((a, b) => {
		return compareFunc(get(a, property), get(b, property));
	});
}
