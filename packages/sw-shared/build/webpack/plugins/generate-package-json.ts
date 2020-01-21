import fs from 'fs';
import path from 'path';
import { merge, uniq } from 'lodash';
import fsExtra from 'fs-extra';
import sortPackageJson from 'sort-package-json';

export const nodeBuiltInModules = [
	'assert',
	'async_hooks',
	'buffer',
	'child_process',
	'cluster',
	'console',
	'constants',
	'crypto',
	'dgram',
	'dns',
	'domain',
	'events',
	'fs',
	'http',
	'http2',
	'https',
	'inspector',
	'module',
	'net',
	'os',
	'path',
	'perf_hooks',
	'process',
	'punycode',
	'querystring',
	'readline',
	'repl',
	'stream',
	'string_decoder',
	'timers',
	'tls',
	'trace_events',
	'tty',
	'url',
	'util',
	'v8',
	'vm',
	'zlib',
];

export class GenerateDependencyPackages {
	private excludes: string[];
	private includes: string[];
	private packageJson: any;
	private outputPath: string;

	constructor({ excludes = [], includes = [], packageJson = null, packageJsonPath = '', outputPath = '' } = {}) {
		this.excludes = excludes.concat(nodeBuiltInModules);
		this.includes = includes;
		this.packageJson =
			packageJson ||
			JSON.parse(
				fs.readFileSync(packageJsonPath, {
					encoding: 'utf-8',
				})
			);
		this.outputPath = outputPath;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap('GenerateDependencyPackagesPlugin', compilation => {
			compilation.hooks.finishModules.tap('GenerateDependencyPackagesPlugin', modules => {
				const dependentPackages: string[] = [];

				modules
					.filter(module => module.type === 'javascript/auto')
					.forEach(module => {
						const dependencies = module.dependencies.filter(
							dependency =>
								getConstructorName(dependency) === 'CommonJsRequireDependency' &&
								dependency.module.external
						);
						dependentPackages.push(...dependencies.map(dependency => dependency.request));
					});

				dependentPackages.push(...this.includes);

				const allDependencyMap = merge(
					this.packageJson.dependencies || {},
					this.packageJson.devDependencies || {}
				);
				const allDependencies = Object.keys(allDependencyMap);

				const generatedDependencyMap = uniq(dependentPackages).reduce(
					(currentDependencyMap, dependentPackage) => {
						if (this.excludes.includes(dependentPackage)) {
							return currentDependencyMap;
						}
						if (dependentPackage.startsWith('sportywide')) {
							return currentDependencyMap;
						}
						const foundDependency = allDependencies.find(
							dependency =>
								dependentPackage === dependency || dependentPackage.startsWith(`${dependency}/`)
						);
						if (!foundDependency) {
							console.info(`Cannot find version for ${dependentPackage}`);
							return {
								...currentDependencyMap,
								[dependentPackage]: 'latest',
							};
						}
						return {
							...currentDependencyMap,
							[foundDependency]: allDependencyMap[foundDependency],
						};
					},
					{}
				);

				const newPackageJson = {
					name: 'generated-package',
					dependencies: generatedDependencyMap,
				};

				const packageJsonString = sortPackageJson(JSON.stringify(newPackageJson, null, 4));

				fsExtra.mkdirpSync(path.dirname(this.outputPath));
				fs.writeFileSync(this.outputPath, packageJsonString, {
					encoding: 'utf-8',
				});
			});
		});
	}
}

function getConstructorName(obj) {
	return Object.getPrototypeOf(obj).constructor.name;
}
