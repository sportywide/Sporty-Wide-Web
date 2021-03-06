import paths from '@build/paths';
import { isDevelopment } from '@shared/lib/utils/env';
import { addPlugins, createConfig, env, setMode, setOutput } from '@webpack-blocks/webpack';
import { match } from '@webpack-blocks/core';
import { css, extractCss, postcss, sass } from '@build/webpack/plugins/styles';
import { setEntry, watch } from '@build/webpack/plugins/core';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

export function makeConfig({ entries, output, env: environment }: { entries: any; output: string; env: string }) {
	// @ts-ignore
	process.env.NODE_ENV = environment;

	return createConfig([
		setOutput(output),
		setMode(isDevelopment(environment) ? 'development' : 'production'),
		setEntry(entries),
		env('development', [watch()]),
		match(
			['*.css', '!*node_modules*'],
			[
				extractCss({
					filename: '[name].min.css',
				}),
				css({
					styleLoader: false,
					sourceMap: isDevelopment(environment),
				}),
				postcss({
					config: {
						path: paths.project.root,
					},
					sourceMap: isDevelopment(environment),
				}),
			]
		),
		match(
			['*.scss', '!*node_modules*'],
			[
				extractCss({
					filename: '[name].min.css',
				}),
				css({
					styleLoader: false,
					sourceMap: isDevelopment(environment),
				}),
				postcss({
					config: {
						path: paths.project.root,
					},
					sourceMap: isDevelopment(environment),
				}),
				sass({
					sourceMap: isDevelopment(environment),
				}),
			]
		),
		setOutput({
			path: output,
			filename: '[name].js',
		}),
		addPlugins([new FixStyleOnlyEntriesPlugin()]),
	]);
}
