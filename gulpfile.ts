require('reflect-metadata');
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
			return spawn('npx lerna bootstrap -- --ci --no-optional && link-parent-bin');
		} else if (argv.production) {
			return spawn(
				'npx lerna bootstrap -- --production --no-optional && link-parent-bin -s true -d false -o false'
			);
		} else if (argv.packageLockOnly) {
			return spawn('npx lerna bootstrap -- --no-optional --package-lock-only');
		} else if (argv.optional) {
			return spawn('npx lerna bootstrap && link-parent-bin');
		} else {
			return spawn('npx lerna bootstrap -- --no-optional && link-parent-bin');
		}
	}

	@Task('cz')
	commit() {
		return spawn('git add . && git-cz');
	}

	@Task('lint')
	lint() {
		return spawn("eslint '**/*.{js,jsx,ts,tsx}'");
	}

	@Task('dev:exec')
	exec() {
		return spawn(`npx lerna exec "gulp dev:exec --entry ${argv.entry}" --stream --scope ${argv.scope}`);
	}

	@Task('generate:migration')
	generateMigration() {
		return spawn('npx ts-node -T bin/migration.ts');
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
			args.push('--detectOpenHandles');
		}

		if (argv.e2e) {
			args.push('--testRegex=\\.e2e-spec\\.ts$');
		}

		if (argv.full) {
			args.push('--testRegex=\\.it-spec\\.tsx?$');
			args.push('--testRegex=\\.e2e-spec\\.tsx?$');
			args.push('--testRegex=\\.spec\\.tsx?$');
			args.push('--detectOpenHandles');
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

		return spawn(`npx jest ${args.join(' ')}`);
	}

	@Task('test:api')
	apiTest() {
		return spawn('npx ts-node e2e/api/api-test.ts');
	}

	@Task('typecheck')
	typeCheck() {
		return spawn('node --max-old-space-size=4096 node_modules/.bin/tsc --noEmit');
	}

	/** CI tasks **/
	@Task('ci:validate')
	validateCi() {
		return spawn(
			'cat .gitlab-ci.yml | curl --header "Content-Type: application/json" https://gitlab.com/api/v4/ci/lint --data @-'
		);
	}
}
