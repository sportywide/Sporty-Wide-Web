export function ucfirst(str) {
	if (!str) {
		return str;
	}
	return str[0].toUpperCase() + str.slice(1);
}

export function camelcaseToSnakecase(str) {
	if (!str) {
		return str;
	}
	return str
		.split(/(?=[A-Z])/)
		.join('_')
		.toLowerCase();
}

export function dashcaseToSnakecase(str) {
	if (!str) {
		return str;
	}
	return str
		.split(/(?=[A-Z])/)
		.join('-')
		.toLowerCase();
}

export function toCamel(str) {
	if (!str) {
		return str;
	}
	return str.replace(/([-_][a-z])/gi, $1 => {
		return $1
			.toUpperCase()
			.replace('-', '')
			.replace('_', '');
	});
}
