exports.target = function target(target) {
	return (context, util) =>
		util.merge({
			target,
		});
};

exports.externals = function externals(externals) {
	return (context, util) =>
		util.merge({
			externals,
		});
};

exports.watch = function() {
	return (context, util) =>
		util.merge({
			watch: true,
		});
};

exports.node = function() {
	return (context, util) =>
		util.merge({
			node: {
				__dirname: false,
			},
		});
};
