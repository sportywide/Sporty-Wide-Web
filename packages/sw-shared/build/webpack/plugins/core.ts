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
	return (context, util) => config => config;
}

export function watch() {
	return (context, util) =>
		util.merge({
			watch: true,
			watchOptions: {
				ignored: /node_modules/,
				poll: 1000,
				aggregateTimeout: 300,
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
