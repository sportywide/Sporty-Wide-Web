import { error } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { groupBy } from 'lodash';
import { leagues } from '@shared/lib/data/data.constants';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { TeamService } from '@schema/team/services/team.service';
import { DATA_LOGGER } from '@core/logging/logging.constant';

export async function handler(event, context) {
	let whoscoreCrawler;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const module = await initModule(SchedulingModule);
		whoscoreCrawler = module.get(WhoScoreCrawlerService);
		const date = new Date();
		const matches = await whoscoreCrawler.getLiveMatches(date);
		const leagueMatches = groupBy(matches, 'whoscoreLeagueId');
		const logger = module.get(DATA_LOGGER);
		const whoscoreLeagueIds = Object.keys(leagueMatches);
		const fixtureService = module.get(FixtureService);
		const teamsService = module.get(TeamService);
		const relevantLeagues = leagues.filter(league => whoscoreLeagueIds.includes(String(league.whoscoreId)));

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
			}
		}
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
