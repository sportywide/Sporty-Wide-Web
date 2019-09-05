export function url(options = {}) {
	return (context, util) => {
		if (!context.match) {
			throw new Error(
				`The url() block can only be used in combination with match(). ` +
					`Use match() to state on which files to apply the url loader.`
			);
		}

		return util.addLoader({
			use: [{ loader: 'url-loader', options }],
			...context.match,
		});
	};
}

export function file(options = {}) {
	return (context, util) => {
		if (!context.match) {
			throw new Error(
				`The file() block can only be used in combination with match(). ` +
					`Use match() to state on which files to apply the file loader.`
			);
		}

		return util.addLoader({
			use: [{ loader: 'file-loader', options }],
			...context.match,
		});
	};
}
