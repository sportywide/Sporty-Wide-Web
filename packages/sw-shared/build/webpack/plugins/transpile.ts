export function babelHelper(options = {}) {
	return (context, { merge }) =>
		merge({
			module: {
				rules: [
					Object.assign(
						{
							test: /\.(js|ts)x?$/,
							use: {
								loader: 'babel-loader',
								options,
							},
							exclude: /node_modules/,
						},
						context.match
					),
				],
			},
		});
}
