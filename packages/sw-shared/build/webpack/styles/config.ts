import path from 'path';
import paths from '@build/paths';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { isDevelopment } from '@shared/lib/utils/env';
import { addPlugins, createConfig, env, setMode, setOutput } from '@webpack-blocks/webpack';
import { match } from '@webpack-blocks/core';
import { css, extractCss, postcss, sass } from '@build/webpack/plugins/styles';
import { none, setEntry, watch } from '@build/webpack/plugins/core';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

export function makeConfig({ entries, output }: { entries: any; output: string }) {
	// @ts-ignore
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';

	return createConfig([
		setOutput(output),
		setMode(isDevelopment() ? 'development' : 'production'),
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
					sourceMap: false,
				}),
				isDevelopment()
					? none()
					: postcss({
							config: {
								path: paths.project.root,
							},
							sourceMap: isDevelopment(),
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
					sourceMap: isDevelopment(),
				}),
				isDevelopment()
					? none()
					: postcss({
							config: {
								path: paths.project.root,
							},
							sourceMap: isDevelopment(),
					  }),
				sass({
					sourceMap: isDevelopment(),
				}),
			]
		),
		setOutput({
			path: output,
		}),
		addPlugins([new FixStyleOnlyEntriesPlugin()]),
		addPlugins([
			new CopyWebpackPlugin(
				[
					{
						from: {
							glob: '*.min.css',
						},
						to: path.resolve(output),
						context: path.resolve(paths.project.root, 'node_modules', 'sporty-wide-style', 'dist'),
					},
				],
				{
					copyUnmodified: true,
				}
			),
		]),
	]);
}
