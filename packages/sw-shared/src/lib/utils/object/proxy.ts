export function wrap(wrapper, base) {
	const proxy = new Proxy(wrapper, {
		get(target, property) {
			if (property in target) {
				return getProperty(target, property, proxy);
			}

			return getProperty(base, property, proxy);
		},
	});
	return proxy;
}
export function getProperty(object, property, proxy) {
	if (typeof object[property] === 'function') {
		const oldFunction = object[property];
		object[property] = function(...args) {
			const value = oldFunction.apply(object, args);
			return value === object ? proxy : value;
		};
	}
	return object[property];
}
