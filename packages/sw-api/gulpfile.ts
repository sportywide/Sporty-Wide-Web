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
		return ['clean', gulp.parallel('dev:webpack', 'dev:start')];
	}

	@Task('dev:start')
	startDev() {
		return spawn('wait-on dist/main.js && nodemon');
	}

	/** Build tasks **/
	@SequenceTask('build')
	build() {
		return ['clean', 'build:webpack'];
	}
}
