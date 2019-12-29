require('reflect-metadata');
require('tsconfig-paths/register');
import { Gulpclass, SequenceTask } from 'gulpclass';
import { spawn } from '@root/helpers/process';
import { GenericWebpackTasks } from '@root/helpers/gulp';

const argv = require('yargs').argv;

@Gulpclass()
export class Gulpfile extends GenericWebpackTasks {
	/** Dev tasks **/
	@SequenceTask('dev:exec')
	dev() {
		process.env.SCRIPT = argv.entry;
		return ['dev:webpack', 'exec'];
	}

	/** Build tasks **/
	@SequenceTask('build')
	build() {
		return ['clean', 'build:webpack'];
	}

	@SequenceTask('exec')
	exec() {
		return spawn(`cd dist && TZ='UTC' node ${argv.entry}`);
	}
}
