import { Gulpclass, Task } from '@root/node_modules/gulpclass';
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
		process.env.TS_NODE_TRANSPILE_ONLY = 'true';
		process.env.TS_NODE_TYPE_CHECK = 'false';
		return spawn('webpack -r tsconfig-paths/register');
	}

	@Task('build:env')
	buildEnv(callback) {
		process.env.NODE_ENV = 'production';
		callback();
	}

	@Task('build:webpack')
	webpackBuild() {
		process.env.TS_NODE_TRANSPILE_ONLY = 'true';
		process.env.TS_NODE_TYPE_CHECK = 'false';
		return spawn('webpack -r tsconfig-paths/register');
	}
}
