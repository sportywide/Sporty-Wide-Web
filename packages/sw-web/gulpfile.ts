require('reflect-metadata');
require('tsconfig-paths/register');
import { Gulpclass, SequenceTask, Task } from 'gulpclass';
import { GenericWebpackTasks } from '@root/helpers/gulp';
import { spawn } from '@root/helpers/process';
import gulp from 'gulp';

@Gulpclass()
export class Gulpfile extends GenericWebpackTasks {
	/** Dev tasks **/
	@SequenceTask('dev')
	dev() {
		return ['dev:env', 'clean', gulp.parallel('dev:codegen', 'dev:webpack', 'dev:start')];
	}

	@Task('dev:start')
	startDev() {
		return spawn('wait-on dist/main.js && node --inspect=0.0.0.0 dist/main.js');
	}

	@Task('dev:codegen')
	devCodegen() {
		return spawn('graphql-codegen --config codegen.yml --watch');
	}

	/** Build tasks **/
	@SequenceTask('build')
	build() {
		return ['build:env', 'clean', 'build:codegen', gulp.parallel('build:webpack', 'build:next')];
	}

	@SequenceTask('build:next')
	buildNext() {
		return ['clean:next', 'build:next-webpack'];
	}

	@Task('clean:next')
	cleanNext() {
		return spawn('rm -rf next-build');
	}

	@Task('build:next-webpack')
	buildNextWebpack() {
		return spawn('next build ./src');
	}

	@Task('build:analyze')
	analyze() {
		process.env.BUNDLE_ANALYZE = 'both';
		return spawn('next build ./src');
	}

	@Task('build:analyze-browser')
	analyzeBrowser() {
		process.env.BUNDLE_ANALYZE = 'browser';
		return spawn('next build ./src');
	}

	@Task('build:analyze-server')
	analyzeServer() {
		process.env.BUNDLE_ANALYZE = 'server';
		return spawn('next build ./src');
	}

	@Task('build:codegen')
	buildCodegen() {
		return spawn('graphql-codegen --config codegen.yml');
	}

	@Task('start')
	startServer() {
		return spawn('node dist/main.js');
	}
}
