import 'reflect-metadata';

const _wr = function(type) {
	const orig = history[type];
	return function(...args) {
		const rv = orig.apply(this, args);
		const e = new Event(type);
		e.arguments = args;
		window.dispatchEvent(e);
		return rv;
	};
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
