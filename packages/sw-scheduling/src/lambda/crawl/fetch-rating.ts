import { error, ok } from '@scheduling/lib/http';
import { getLogger, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { SQSEvent } from 'aws-lambda';
import { FixtureProcess, FixtureProcessStatus } from '@scheduling/lib/fixture/models/fixture-process.model';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { keyBy } from 'lodash';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { INestApplicationContext } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';
import { SCHEDULING_LOGGER } from '@core/logging/logging.constant';
import { parseBody } from '@core/aws/lambda/body-parser';

export async function handler(event: SQSEvent, context) {
	let module: INestApplicationContext;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const messages = parseBody(event);
		const fixtureProcesses: FixtureProcess[] = messages.map(message => JSON.parse(message.body));
		module = await initModule(SchedulingModule);
		const matchUrls = fixtureProcesses.map(fixtureProcess => fixtureProcess.matchUrl);
		const playerPersisterService = module.get(PlayerPersisterService);
		const fixtureProcessService = module.get(FixtureProcessService);

		const whoscoreCrawler = module.get(WhoScoreCrawlerService);
		const fixtureMap = await getFixtureMap(module, fixtureProcesses);
		const ratingMap = await whoscoreCrawler.getRatings(matchUrls);
		await Promise.all(
			Object.entries(ratingMap).map(async ([ratingUrl, ratingData]) => {
				const { fixture, fixtureProcess } = fixtureMap[ratingUrl];
				if (!ratingData) {
					await fixtureProcessService.failed(fixtureProcess.matchUrl);
					return;
				}
				const { away, home } = ratingData;
				try {
					await Promise.all([
						playerPersisterService.savePlayerRatings(
							fixture.id,
							{
								id: fixture.homeId,
								name: fixture.home,
							},
							home
						),
						playerPersisterService.savePlayerRatings(
							fixture.id,
							{
								id: fixture.awayId,
								name: fixture.away,
							},
							away
						),
					]);
					await fixtureProcessService.markStatus(fixtureProcess.matchUrl, FixtureProcessStatus.SUCCESS);
				} catch (e) {
					const logger = module.get(SCHEDULING_LOGGER);
					logger.error(`Failed to process ${fixtureProcess.matchUrl}`, e);
					await fixtureProcessService.failed(fixtureProcess.matchUrl);
				}
			})
		);
		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	}
}

async function getFixtureMap(
	module: INestApplicationContext,
	fixtureProcesses
): Promise<{ [key: string]: { fixture: Fixture; fixtureProcess: FixtureProcess } }> {
	const fixtureService = module.get(FixtureService);
	const matchIds = fixtureProcesses.map(fixtureProcess => fixtureProcess.matchId);
	const fixtures = await fixtureService.findByIds(matchIds);
	const fixtureMapById = keyBy(fixtures, 'id');
	const fixtureMapByUrl = {};
	for (const fixtureProcess of fixtureProcesses) {
		fixtureMapByUrl[fixtureProcess.matchUrl] = {
			fixture: fixtureMapById[fixtureProcess.matchId],
			fixtureProcess,
		};
	}
	return fixtureMapByUrl;
}
