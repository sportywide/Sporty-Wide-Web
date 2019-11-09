require('reflect-metadata');
import { Gulpclass, Task } from 'gulpclass';
import { spawn } from '@root/helpers/process';

@Gulpclass()
export class GenericWebpackTasks {
	@Task('clean')
	clean() {
		return spawn('rm -rf dist');
	}

	@Task('dev:webpack')
	buildDev() {
		return spawn('webpack --color --env=development');
	}

	@Task('build:webpack')
	webpackBuild() {
		return spawn('webpack --color --env=production');
	}
}
