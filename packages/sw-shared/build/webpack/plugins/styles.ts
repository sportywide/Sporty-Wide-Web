import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import omit from 'lodash/omit';

export function extractCss({ test = /\.css$/, ...options }) {
	return (context, util) =>
		util.merge({
			module: {
				rules: [
					{
						test,
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
						],
						...context.match,
					},
				],
			},
			plugins: [new MiniCssExtractPlugin(options)],
		});
}

//plugins copied and adapted from @webpack-blocks/styles, @webpack-blocks/postcss and @webpack-blocks/assets
export function sass(options = {}) {
	return (context, util) => {
		return util.addLoader({
			test: /\.(sass|scss)$/,
			use: [
				{
					loader: 'sass-loader',
					options,
				},
			],
			...context.match,
		});
	};
}

export function postcss(options = {}) {
	if (Array.isArray(options)) {
		throw Error(
			'Passing PostCSS plugins as a first argument is not supported anymore, use options.plugins instead'
		);
	}

	return (context, util) => prevConfig => {
		const ruleDef = {
			test: /\.css$/,
			use: [
				{
					loader: 'postcss-loader',
					options,
				},
			],
			...context.match,
		};

		return util.addLoader(ruleDef)(prevConfig);
	};
}

export function css(options: any = {}) {
	const cssOptions = omit(options, ['styleLoader']);
	const loaders = [{ loader: 'css-loader', options: cssOptions }];

	if (options.styleLoader !== false) {
		loaders.unshift({ loader: 'style-loader', options: options.styleLoader || {} });
	}

	return (context, util) =>
		util.addLoader({
			test: /\.css$/,
			use: loaders,
			...context.match,
		});
}

export function cssModules(options: any = {}) {
	const defaultCssOptions = {
		modules: true,
		importLoaders: 1,
		localIdentName:
			String(process.env.NODE_ENV) === 'production' ? '[hash:base64:10]' : '[name]--[local]--[hash:base64:5]',
	};
	const cssOptions = Object.assign(defaultCssOptions, omit(options, ['exclude', 'include', 'styleLoader']));
	const loaders = [{ loader: 'css-loader', options: cssOptions }];

	if (options.styleLoader !== false) {
		loaders.unshift({ loader: 'style-loader', options: options.styleLoader || {} });
	}

	return (context, util) =>
		util.addLoader({
			test: /\.css$/,
			use: loaders,
			...context.match,
		});
}
