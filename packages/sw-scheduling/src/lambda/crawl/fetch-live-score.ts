import { error } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { groupBy } from 'lodash';
import { leagues } from '@shared/lib/data/data.constants';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { FixtureProcessInput, FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';
import { BrowserService } from '@data/crawler/browser.service';
import { INestApplicationContext } from '@nestjs/common';
import { addMinutes } from 'date-fns';

export async function handler(event, context) {
	let module;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		module = await initModule(SchedulingModule);
		const date = new Date('2019-12-14');
		const leagueMatches = await crawlLiveScores(module, date);
		const matches = await matchDbFixtures(module, leagueMatches, date);
		await processMatches(module, matches);
		await scheduleNextCall(module);
	} catch (e) {
		console.error(__filename, e);
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

async function matchDbFixtures(module, leagueMatches, date) {
	const whoscoreLeagueIds = Object.keys(leagueMatches);
	const fixtureService = module.get(FixtureService);
	const relevantLeagues = leagues.filter(league => whoscoreLeagueIds.includes(String(league.whoscoreId)));

	const processingMatches: FixtureProcessInput[] = [];
	for (const league of relevantLeagues) {
		const dbFixtures = await fixtureService.findMatchesForDay({
			leagueId: league.id,
			date,
		});
		const mapping = await fixtureService.saveWhoscoreFixtures(
			league.id,
			dbFixtures,
			leagueMatches[league.whoscoreId]
		);
		for (const [fixture, dbFixture] of mapping.entries()) {
			if (dbFixture.status === 'FT') {
				processingMatches.push({
					matchUrl: fixture.link,
					matchId: dbFixture.id,
					time: dbFixture.time,
				});
			}
		}
	}
	return processingMatches;
}

async function processMatches(module, matches) {
	const fixtureProcessService = module.get(FixtureProcessService);

	await fixtureProcessService.process(matches);
}

async function scheduleNextCall(module: INestApplicationContext) {
	const fixtureService = module.get(FixtureService);
	const hasActiveMatches = fixtureService.hasActiveMatches();
	let date: Date;
	if (hasActiveMatches) {
		date = addMinutes(new Date(), 1);
	}
}
