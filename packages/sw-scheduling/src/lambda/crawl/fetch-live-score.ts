import { error } from '@scheduling/lib/http';
import { cleanup, getLogger, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { groupBy } from 'lodash';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';
import { BrowserService } from '@data/crawler/browser.service';
import { INestApplicationContext } from '@nestjs/common';
import { addMinutes, startOfMinute } from 'date-fns';
import { SCHEDULING_LOGGER } from '@core/logging/logging.constant';
import { CloudwatchService } from '@core/aws/cloudwatch/cloudwatch.service';

export async function handler(event, context) {
	let module: INestApplicationContext;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		module = await initModule(SchedulingModule);
		const date = new Date();
		const leagueMatches = await crawlLiveScores(module, date);
		const fixtureService = module.get(FixtureService);
		const mappedDbFixtures = await fixtureService.matchDbFixtures(module, leagueMatches, date);
		const matches = [];
		for (const [fixture, dbFixture] of mappedDbFixtures.entries()) {
			if (dbFixture.status === 'FT') {
				matches.push({
					matchUrl: fixture.link,
					matchId: dbFixture.id,
					time: dbFixture.time,
				});
			}
		}
		await processMatches(module, matches);
		await scheduleNextCall(module);
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		const browserService = module.get(BrowserService);
		await browserService.close();
		await cleanup();
	}
}

async function crawlLiveScores(module, date) {
	const whoscoreCrawler = module.get(WhoScoreCrawlerService);
	const matches = await whoscoreCrawler.getLiveMatches(date);
	return groupBy(matches, 'whoscoreLeagueId');
}

async function processMatches(module, matches) {
	const fixtureProcessService = module.get(FixtureProcessService);

	await fixtureProcessService.process(matches);
}

async function scheduleNextCall(module: INestApplicationContext) {
	const fixtureService = module.get(FixtureService);
	const schedulingLogger = module.get(SCHEDULING_LOGGER);
	const hasActiveMatches = await fixtureService.hasActiveMatches();
	let nextProcessingDate: Date;
	if (hasActiveMatches) {
		const currentDate = new Date();
		if (currentDate.getSeconds() <= 20) {
			nextProcessingDate = addMinutes(startOfMinute(currentDate), 1);
		} else {
			nextProcessingDate = addMinutes(startOfMinute(currentDate), 2);
		}
	} else {
		const pendingMatch = await fixtureService.getNextPendingMatch();
		if (pendingMatch) {
			nextProcessingDate = pendingMatch.time;
		}
	}
	schedulingLogger.info('Next schedule time', nextProcessingDate);
	const cloudWatchService = module.get(CloudwatchService);
	await cloudWatchService.putRule({
		ruleName: 'schedule-fetch-livescore',
		lambda: 'sw-production-fetch-live-score',
		date: nextProcessingDate,
	});
}
