import { error } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { groupBy } from 'lodash';
import { leagues } from '@shared/lib/data/data.constants';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { TeamService } from '@schema/team/services/team.service';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { FixtureProcessInput, FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';

export async function handler(event, context) {
	let whoscoreCrawler;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const module = await initModule(SchedulingModule);
		const date = new Date('2019-12-08');
		const leagueMatches = await crawlLiveScores(module, date);
		const matches = await matchDbFixtures(module, leagueMatches, date);
		await processMatches(module, matches);
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	} finally {
		if (whoscoreCrawler) {
			await whoscoreCrawler.close();
		}
		await cleanup();
	}
}

async function crawlLiveScores(module, date) {
	const whoscoreCrawler = module.get(WhoScoreCrawlerService);
	const matches = await whoscoreCrawler.getLiveMatches(date);
	return groupBy(matches, 'whoscoreLeagueId');
}

async function matchDbFixtures(module, leagueMatches, date) {
	const logger = module.get(DATA_LOGGER);
	const whoscoreLeagueIds = Object.keys(leagueMatches);
	const fixtureService = module.get(FixtureService);
	const teamsService = module.get(TeamService);
	const relevantLeagues = leagues.filter(league => whoscoreLeagueIds.includes(String(league.whoscoreId)));

	const processingMatches: FixtureProcessInput[] = [];
	for (const league of relevantLeagues) {
		const dbFixtures = await fixtureService.findMatchesForDay({
			leagueId: league.id,
			date,
		});
		const dbTeams = await teamsService.findByLeague(league.id);
		for (const match of leagueMatches[league.whoscoreId]) {
			const homeDbTeam = teamsService.fuzzySearch(dbTeams, match.home);
			if (!homeDbTeam) {
				logger.error('Cannot find the team', match.home);
				continue;
			}
			const awayDbTeam = teamsService.fuzzySearch(dbTeams, match.away);
			if (!awayDbTeam) {
				logger.error('Cannot find the team', match.away);
				continue;
			}

			const dbFixture = dbFixtures.find(
				fixture => fixture.awayId === awayDbTeam.id && fixture.homeId === homeDbTeam.id
			);
			if (!dbFixture) {
				logger.error(`Cannot find fixture for teams ${match.home} - ${match.away}`);
			}
			dbFixture.whoscoreUrl = match.link;
			dbFixture.incidents = match.incidents;
			await fixtureService.saveOne(dbFixture);
			logger.debug('Saving fixture', dbFixture.id);

			processingMatches.push({
				matchUrl: match.link,
				matchId: dbFixture.id,
				time: dbFixture.time,
			});
		}
	}
	return processingMatches;
}

async function processMatches(module, matches) {
	const fixtureProcessService = module.get(FixtureProcessService);

	await fixtureProcessService.process(matches);
}
