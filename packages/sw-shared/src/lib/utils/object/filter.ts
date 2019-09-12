export function filterValues(object, predicate) {
	if (!predicate(object)) {
		return null;
	}
	if (!object || typeof object !== 'object') {
		return object;
	}

	if (Array.isArray(object)) {
		return object.filter(predicate).map(element => filterValues(element, predicate));
	}

	return Object.keys(object).reduce((currentObject, key) => {
		if (!predicate(object[key], key)) {
			return currentObject;
		}
		return { ...currentObject, [key]: filterValues(object[key], predicate) };
	}, {});
}
