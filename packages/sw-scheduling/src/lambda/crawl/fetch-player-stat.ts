import { error, ok } from '@scheduling/lib/http';
import { initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';
import { SQSEvent } from 'aws-lambda';
import { ScoreboardCrawlerService } from '@data/crawler/scoreboard-crawler.service';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';

export async function handler(event: SQSEvent, context) {
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const [{ body: leagueId }] = parseBody(event);
		const module = await initModule(SchedulingCrawlerModule);
		const s3Service = module.get(S3Service);
		const config = module.get(SCHEDULING_CONFIG);
		const objectDetails = await s3Service.getObject({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `teams/scoreboard/${leagueId}.json`,
		});
		const leagueTeams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const scoreboardCrawler = module.get(ScoreboardCrawlerService);
		const { league, teams, season } = leagueTeams;
		const teamUrlMap = await scoreboardCrawler.crawlPlayers(
			teams.map(team => team.url),
			season
		);

		const result = {};
		for (const team of teams) {
			result[team.name] = teamUrlMap[team.url];
		}
		await s3Service.uploadFile({
			Bucket: config.get('s3:data_bucket_name'),
			Key: `players/scoreboard/${league.id}.json`,
			Body: JSON.stringify(result),
			Metadata: {
				league: league.id.toString(),
				season,
			},
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	}
}
