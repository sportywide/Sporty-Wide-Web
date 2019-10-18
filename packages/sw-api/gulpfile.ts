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
		return ['dev:env', 'clean', gulp.parallel('dev:webpack', 'dev:start')];
	}

	@Task('dev:start')
	startDev() {
		return spawn('wait-on dist/main.js && node --inspect=0.0.0.0 dist/main.js');
	}

	/** Build tasks **/
	@SequenceTask('build')
	build() {
		return ['build:env', 'clean', 'build:webpack'];
	}
}