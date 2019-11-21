export function target(target) {
	return (context, util) =>
		util.merge({
			target,
		});
}

export function externals(externals) {
	return (context, util) =>
		util.merge({
			externals,
		});
}

export function none() {
	return () => config => config;
}

export function optimize(options) {
	return (context, util) =>
		util.merge({
			optimization: options,
		});
}

export function watch() {
	return (context, util) =>
		util.merge({
			watch: true,
			watchOptions: {
				ignored: /node_modules/,
			},
		});
}

export function node() {
	return (context, util) =>
		util.merge({
			node: {
				__dirname: false,
			},
		});
}

export function setEntry(entry) {
	return (context, util) =>
		util.merge({
			entry,
		});
}
