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
		} else if (argv.packageLockOnly) {
			return spawn('lerna bootstrap -- --no-optional --package-lock-only');
		} else if (argv.optional) {
			return spawn('lerna bootstrap && link-parent-bin');
		} else {
			return spawn('lerna bootstrap -- --no-optional && link-parent-bin');
		}
	}

	@Task('cz')
	commit() {
		return spawn('git add . && git-cz');
	}

	@Task('dev:exec')
	exec() {
		return spawn(`lerna run dev:exec --stream --scope ${argv.scope} -- -- --entry ${argv.entry}`);
	}

	@Task('generate:migration')
	generateMigration() {
		return spawn('ts-node -T bin/migration.ts');
	}

	/** Test tasks **/

	@Task('test')
	test() {
		const args = ['--runInBand'];
		if (argv.watch) {
			args.push('--watch');
		}

		if (argv.coverage) {
			args.push('--coverage');
		}

		if (argv.it) {
			args.push('--testRegex=\\.it-spec\\.ts$');
		}

		if (argv.e2e) {
			args.push('--testRegex=\\.e2e-spec\\.ts$');
		}

		if (argv.full) {
			args.push('--testRegex=\\.it-spec\\.tsx?$');
			args.push('--testRegex=\\.e2e-spec\\.tsx?$');
			args.push('--testRegex=\\.spec\\.tsx?$');
		}

		for (const key of Object.keys(argv)) {
			if (['watch', 'coverage', 'it', 'e2e', 'full', '$0', '_'].includes(key)) {
				continue;
			}
			args.push(`--${key}`);
			if (typeof argv[key] !== 'boolean') {
				args.push(`"${argv[key]}"`);
			}
		}

		return spawn(`jest ${args.join(' ')}`);
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
