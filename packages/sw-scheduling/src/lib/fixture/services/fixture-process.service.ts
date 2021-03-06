import { FixtureProcessModel, FixtureProcessStatus } from '@scheduling/lib/fixture/models/fixture-process.model';
import { addMinutes } from 'date-fns';
import { keyBy } from 'lodash';

export type FixtureProcessInput = {
	matchUrl: string;
	matchId: number;
	time: Date;
};

export class FixtureProcessService {
	find(matchUrl) {
		return FixtureProcessModel.queryOne('matchUrl')
			.eq(matchUrl)
			.exec();
	}

	findAll(matchUrls) {
		return Promise.all(matchUrls.map(matchUrl => this.find(matchUrl)));
	}

	async create(match: FixtureProcessInput) {
		await this.batchCreate([match]);
	}

	async batchCreate(matches: FixtureProcessInput[]) {
		await FixtureProcessModel.batchPut(
			matches.map(({ matchUrl, matchId, time }) => ({
				matchUrl,
				matchId,
				attempt: 1,
				status: FixtureProcessStatus.PENDING,
				nextTime: addMinutes(time, 130),
			})),
			{ overwrite: true }
		);
	}

	markStatus(matchUrl, status: FixtureProcessStatus) {
		return FixtureProcessModel.update({ matchUrl }, { status });
	}

	async process(matches: FixtureProcessInput[]) {
		if (!matches.length) {
			return;
		}
		const fixtureProcesses = await this.findAll(matches.map(({ matchUrl }) => matchUrl));
		const fixtureMap = keyBy(fixtureProcesses, 'matchUrl');

		const matchesToProcess = matches.filter(match => !fixtureMap[match.matchUrl]);
		await this.batchCreate(matchesToProcess);
	}

	async failed(matchUrl) {
		const fixtureProcess = await this.find(matchUrl);
		if (!fixtureProcess) {
			return;
		}

		fixtureProcess.attempt = fixtureProcess.attempt + 1;
		if (fixtureProcess.attempt >= 3) {
			fixtureProcess.status = FixtureProcessStatus.FAILED;
			fixtureProcess.nextTime = null;
		} else {
			fixtureProcess.nextTime = addMinutes(fixtureProcess.nextTime, 15 * (fixtureProcess.attempt - 1));
			fixtureProcess.status = FixtureProcessStatus.RETRY;
		}
		return fixtureProcess.save();
	}

	async findReadyFixtures() {
		const [pendingFixtures, retryFixtures] = await Promise.all([
			FixtureProcessModel.query('status')
				.using('statusIndex')
				.eq(FixtureProcessStatus.PENDING)
				.filter('nextTime')
				.le(new Date())
				.exec(),
			FixtureProcessModel.query('status')
				.using('statusIndex')
				.eq(FixtureProcessStatus.RETRY)
				.filter('attempt')
				.lt(3)
				.filter('nextTime')
				.le(new Date())
				.exec(),
		]);
		const fixtures = [...pendingFixtures, ...retryFixtures];
		for (const fixture of fixtures) {
			fixture.status = FixtureProcessStatus.PROCESSING;
		}
		await FixtureProcessModel.batchPut(
			fixtures.map(fixture => ({ ...fixture }), {
				overwrite: true,
			})
		);
		return fixtures;
	}
}
