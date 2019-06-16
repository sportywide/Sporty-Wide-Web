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

export function watch() {
	return (context, util) =>
		util.merge({
			watch: true,
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
