require('tsconfig-paths/register');
import { Gulpclass, Task } from 'gulpclass';
import { spawn } from '@root/helpers/process';

const argv = require('yargs').argv;

@Gulpclass()
export class Gulpfile {
	/** Generic tasks **/
	@Task('bootstrap')
	bootstrap() {
		if (argv.ci) {
			return spawn('lerna bootstrap -- --ci --no-optional && link-parent-bin');
		} else if (argv.production) {
			return spawn(
				'lerna bootstrap -- --production --no-optional --ci && link-parent-bin -s true -d false -o false'
			);
		} else if (argv.optional) {
			return spawn('lerna bootstrap && link-parent-bin');
		} else {
			return spawn('lerna bootstrap -- --ci --no-optional && link-parent-bin');
		}
	}

	@Task('cz')
	commit() {
		return spawn('git add . && git-cz');
	}

	@Task('generate:migration')
	generateMigration() {
		return spawn('ts-node -T bin/migration.ts');
	}

	/** Test tasks **/

	@Task('test')
	test() {
		if (argv.watch) {
			return spawn('jest --watch');
		} else if (argv.coverage) {
			return spawn('jest --coverage');
		} else {
			return spawn('jest');
		}
	}

	@Task('test:api')
	apiTest() {
		return spawn('ts-node e2e/api/api-test.ts');
	}

	/** CI tasks **/

	@Task('ci:validate')
	validateCi() {
		return spawn(
			'cat .gitlab-ci.yml | curl --header "Content-Type: application/json" https://gitlab.com/api/v4/ci/lint --data @-'
		);
	}
}
