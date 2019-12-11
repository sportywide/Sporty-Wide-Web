import { error } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingModule } from '@scheduling/lib/scheduling.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { groupBy } from 'lodash';
import { leagues } from '@shared/lib/data/data.constants';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { TeamService } from '@schema/team/services/team.service';
import { Fixture } from '@schema/fixture/models/fixture.entity';

export async function handler() {
	let whoscoreCrawler;
	try {
		const module = await initModule(SchedulingModule);
		whoscoreCrawler = module.get(WhoScoreCrawlerService);
		const date = new Date('2019-12-08');
		const matches = await whoscoreCrawler.getLiveMatches(date);
		const leagueMatches = groupBy(matches, 'whoscoreLeagueId');
		const whoscoreLeagueIds = Object.keys(leagueMatches);
		const fixtureService = module.get(FixtureService);
		const teamsService = module.get(TeamService);
		const relevantLeagues = leagues.filter(league => whoscoreLeagueIds.includes(String(league.whoscoreId)));

		for (const league of relevantLeagues) {
			const dbFixtures = await fixtureService.findMatchesForDay({
				leagueId: league.id,
				date,
			});
			const result: Map<any, Fixture> = new Map();
			const dbTeams = await teamsService.findByLeague(league.id);
			for (const match of leagueMatches[league.whoscoreId]) {
				const homeDbTeam = teamsService.fuzzySearch(dbTeams, match.home);
				if (!homeDbTeam) {
					console.error('Cannot find the team', match.home);
					continue;
				}
				const awayDbTeam = teamsService.fuzzySearch(dbTeams, match.away);
				if (!awayDbTeam) {
					console.error('Cannot find the team', match.away);
					continue;
				}

				const dbFixture = dbFixtures.find(
					fixture => fixture.awayId === awayDbTeam.id && fixture.homeId === homeDbTeam.id
				);
				if (!dbFixture) {
					console.error(`Cannot find fixture for teams ${match.home} - ${match.away}`);
				}
				dbFixture.whoscoreUrl = match.link;
				dbFixture.incidents = match.incidents;
				await fixtureService.saveOne(dbFixture);
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
