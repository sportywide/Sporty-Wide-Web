require('reflect-metadata');
import { Gulpclass, Task } from 'gulpclass';
import { spawn } from '@root/helpers/process';

@Gulpclass()
export class GenericWebpackTasks {
	@Task('clean')
	clean() {
		return spawn('rm -rf dist');
	}

	@Task('dev:env')
	setDevEnv(callback) {
		process.env.NODE_ENV = 'development';
		callback();
	}

	@Task('dev:webpack')
	buildDev() {
		return spawn('webpack');
	}

	@Task('build:env')
	buildEnv(callback) {
		process.env.NODE_ENV = 'production';
		callback();
	}

	@Task('build:webpack')
	webpackBuild() {
		return spawn('webpack');
	}
}
